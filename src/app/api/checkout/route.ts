import { NextResponse } from 'next/server';
import { z } from 'zod';
import { INITIAL_PRODUCTS } from '@/data/initial-products';
import { generatePayHereHash, getPayHereEndpoint } from '@/lib/payments/payhere';

// Server-side Zod validation schema
const CheckoutSchema = z.object({
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

    // Rule 1: Always validate and calculate prices & stock on server
    let totalAmount = 0;
    const validatedOrderItems = [];

    for (const item of items) {
      const liveProduct = INITIAL_PRODUCTS.find(p => p.id === item.productId);
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

      const unitPrice = liveProduct.price;
      const itemSubtotal = unitPrice * item.quantity;
      const commissionRate = liveProduct.seller?.commission_rate || PLATFORM_COMMISSION_PERCENTAGE;
      const commissionAmount = Number(((itemSubtotal * commissionRate) / 100).toFixed(2));
      const sellerPayoutAmount = Number((itemSubtotal - commissionAmount).toFixed(2));

      totalAmount += itemSubtotal;

      validatedOrderItems.push({
        productId: liveProduct.id,
        productName: liveProduct.name,
        sellerId: liveProduct.seller_id,
        sellerName: liveProduct.seller?.store_name || 'Marketplace Seller',
        quantity: item.quantity,
        unitPriceSnapshot: unitPrice,
        conditionSnapshot: liveProduct.condition,
        commissionRateSnapshot: commissionRate,
        commissionAmount,
        sellerPayoutAmount,
      });
    }

    const orderId = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Prepare response depending on chosen payment method
    if (paymentMethod === 'payhere') {
      const merchantId = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID || '1220001';
      const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || '4MTM4MTc4MjgxNjM4NTM3NjY2Mjk=';
      const currency = 'USD';

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
