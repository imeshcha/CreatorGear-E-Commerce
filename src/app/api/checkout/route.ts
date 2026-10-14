import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generatePayHereHash, getPayHereEndpoint } from '@/lib/payments/payhere';
import { getAdminSupabase } from '@/lib/supabase/admin';

// Server-side Zod validation schema
const CheckoutSchema = z.object({
  userId: z.string().optional(),
  customerName: z.string().min(2, 'Full name is required'),
  customerEmail: z.string().email('Valid email required'),
  customerPhone: z.string().min(8, 'Phone number is required'),
  addressLine1: z.string().min(3, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  paymentMethod: z.enum(['cod', 'payhere', 'crypto']),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
    })
  ).min(1, 'Cart cannot be empty'),
});

const PLATFORM_COMMISSION_PERCENTAGE = 8.0; // 8% platform fee
const ETH_EXCHANGE_RATE = 2800.0; // 1 ETH = $2,800 USD

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = CheckoutSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid checkout parameters', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const {
      customerName,
      customerEmail,
      customerPhone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      paymentMethod,
      items,
    } = validation.data;

    const supabase = getAdminSupabase();

    // 1. Resolve or create customer account in public.users
    let customerId = validation.data.userId;
    if (!customerId) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', customerEmail)
        .single();

      if (existingUser) {
        customerId = existingUser.id;
      } else {
        // Create customer auth & profile
        const { data: authData } = await supabase.auth.admin.createUser({
          email: customerEmail,
          password: 'GuestPassword@123!',
          email_confirm: true,
          user_metadata: { full_name: customerName },
        });

        if (authData?.user) {
          customerId = authData.user.id;
          await supabase.from('users').upsert({
            id: customerId,
            email: customerEmail,
            full_name: customerName,
            phone_number: customerPhone,
            role: 'customer',
            status: 'active',
          });
        }
      }
    }

    // 2. Validate products and calculate total & commissions on server
    let totalAmount = 0;
    const validatedOrderItems = [];

    // Pre-fetch sellers map
    const { data: sellersData } = await supabase.from('seller_profiles').select('*');
    const sellersMap = new Map((sellersData || []).map(s => [s.id, s]));

    for (const item of items) {
      // Query from Supabase first
      const { data: dbProd } = await supabase
        .from('products')
        .select('*')
        .or(`id.eq.${item.productId},slug.eq.${item.productId}`)
        .single();

      const liveProduct = dbProd;

      if (!liveProduct) {
        return NextResponse.json(
          { error: `Product ID ${item.productId} not found in verified catalogue.` },
          { status: 400 }
        );
      }

      if (liveProduct.stock_quantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${liveProduct.name}. Requested: ${item.quantity}, Available: ${liveProduct.stock_quantity}` },
          { status: 400 }
        );
      }

      const sellerProfile = sellersMap.get(liveProduct.seller_id) || liveProduct.seller;
      const unitPrice = Number(liveProduct.price);
      const itemSubtotal = unitPrice * item.quantity;
      const commissionRate = sellerProfile?.commission_rate || PLATFORM_COMMISSION_PERCENTAGE;
      const commissionAmount = Number(((itemSubtotal * commissionRate) / 100).toFixed(2));
      const sellerPayoutAmount = Number((itemSubtotal - commissionAmount).toFixed(2));

      totalAmount += itemSubtotal;

      validatedOrderItems.push({
        productId: liveProduct.id,
        productName: liveProduct.name,
        sellerId: liveProduct.seller_id,
        sellerName: sellerProfile?.store_name || 'Marketplace Seller',
        quantity: item.quantity,
        unitPriceSnapshot: unitPrice,
        conditionSnapshot: liveProduct.condition,
        commissionRateSnapshot: commissionRate,
        commissionAmount,
        sellerPayoutAmount,
      });

      // Safely decrement stock on server
      if (dbProd?.id) {
        await supabase
          .from('products')
          .update({ stock_quantity: Math.max(0, dbProd.stock_quantity - item.quantity) })
          .eq('id', dbProd.id);
      }
    }

    const orderId = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 3. Persist Order to Supabase if customerId is resolved
    let dbOrderId = crypto.randomUUID();
    if (customerId) {
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .insert({
          id: dbOrderId,
          customer_id: customerId,
          total_amount: totalAmount,
          subtotal_amount: totalAmount,
          shipping_fee: 0,
          platform_fee: Number((totalAmount * 0.08).toFixed(2)),
          currency: 'LKR',
          payment_method: paymentMethod,
          payment_status: paymentMethod === 'cod' ? 'pending' : 'pending',
          order_status: paymentMethod === 'cod' ? 'processing' : 'pending',
          shipping_address: {
            name: customerName,
            phone: customerPhone,
            address_line1: addressLine1,
            address_line2: addressLine2 || null,
            city,
            state,
            postal_code: postalCode,
            country: 'Sri Lanka',
          },
          tracking_number: `PX-${Math.floor(100000 + Math.random() * 900000)}`,
          courier_partner: 'PromptXpress Express Logistics',
        })
        .select()
        .single();

      if (orderData) {
        dbOrderId = orderData.id;

        // Insert order items
        for (const oi of validatedOrderItems) {
          await supabase.from('order_items').insert({
            order_id: dbOrderId,
            product_id: oi.productId,
            seller_id: oi.sellerId,
            product_name: oi.productName,
            product_sku: oi.productId,
            unit_price: oi.unitPriceSnapshot,
            quantity: oi.quantity,
            total_price: oi.unitPriceSnapshot * oi.quantity,
            item_status: 'confirmed',
          });

          // Insert seller ledger record
          await supabase.from('seller_ledger').insert({
            seller_id: oi.sellerId,
            order_id: dbOrderId,
            entry_type: 'sale_credit',
            amount: oi.sellerPayoutAmount,
            balance_after: oi.sellerPayoutAmount,
            reference_id: orderId,
            description: `Order sale credit: ${oi.productName}`,
          });
        }

        // Insert payments row
        await supabase.from('payments').insert({
          order_id: dbOrderId,
          payment_method: paymentMethod,
          amount: totalAmount,
          currency: 'LKR',
          status: paymentMethod === 'cod' ? 'pending' : 'pending',
          provider_transaction_id: orderId,
        });
      } else if (orderErr) {
        console.error('Error inserting order to Supabase:', orderErr.message);
      }
    }

    // Prepare response depending on chosen payment method
    if (paymentMethod === 'payhere') {
      const merchantId = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID || '1220001';
      const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || '4MTM4MTc4MjgxNjM4NTM3NjY2Mjk=';
      const currency = 'LKR';

      // Generate official MD5 hash
      const hash = generatePayHereHash(
        merchantId,
        orderId,
        totalAmount,
        currency,
        merchantSecret
      );

      const baseUrl = request.headers.get('origin') || 'http://localhost:3000';

      const payHereParams = {
        actionUrl: getPayHereEndpoint(),
        merchant_id: merchantId,
        return_url: `${baseUrl}/order/success?order_id=${orderId}`,
        cancel_url: `${baseUrl}/checkout?cancelled=true`,
        notify_url: `${baseUrl}/api/payments/payhere/notify`,
        order_id: orderId,
        items: `CreatorGear Order ${orderId}`,
        currency: currency,
        amount: totalAmount.toFixed(2),
        first_name: customerName.split(' ')[0] || customerName,
        last_name: customerName.split(' ').slice(1).join(' ') || 'Customer',
        email: customerEmail,
        phone: customerPhone,
        address: `${addressLine1} ${addressLine2 || ''}`.trim(),
        city: city,
        country: 'Sri Lanka',
        hash: hash,
      };

      return NextResponse.json({
        success: true,
        orderId,
        paymentMethod: 'payhere',
        totalAmount,
        payHereParams,
      });
    }

    if (paymentMethod === 'crypto') {
      const expectedEth = parseFloat((totalAmount / ETH_EXCHANGE_RATE).toFixed(5));
      const receivingAddress = process.env.NEXT_PUBLIC_CRYPTO_RECEIVING_ADDRESS || '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5';

      return NextResponse.json({
        success: true,
        orderId,
        paymentMethod: 'crypto',
        totalAmount,
        cryptoPayment: {
          network: process.env.NEXT_PUBLIC_CRYPTO_NETWORK || 'sepolia',
          asset: 'ETH',
          expectedAmountEth: expectedEth,
          receivingAddress,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour validity
        },
      });
    }

    // Cash on Delivery
    return NextResponse.json({
      success: true,
      orderId,
      paymentMethod: 'cod',
      totalAmount,
      courierInfo: {
        courierName: 'PromptXpress Express Logistics',
        courierReference: `PX-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'pending_delivery',
      },
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error?.message || 'Server error processing order checkout.' },
      { status: 500 }
    );
  }
}
