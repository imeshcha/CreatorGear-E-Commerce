import { NextResponse } from 'next/server';
import { verifyPayHereNotification } from '@/lib/payments/payhere';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const merchantId = formData.get('merchant_id') as string;
    const orderId = formData.get('order_id') as string;
    const paymentId = formData.get('payment_id') as string;
    const payhereAmount = formData.get('payhere_amount') as string;
    const payhereCurrency = formData.get('payhere_currency') as string;
    const statusCode = formData.get('status_code') as string;
    const md5sig = formData.get('md5sig') as string;
    const custom1 = formData.get('custom_1') as string;

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || '4MTM4MTc4MjgxNjM4NTM3NjY2Mjk=';

    // Verify signature cryptographically
    const isValidSignature = verifyPayHereNotification(
      merchantId,
      orderId,
      payhereAmount,
      payhereCurrency,
      statusCode,
      md5sig,
      merchantSecret
    );

    if (!isValidSignature) {
      console.error(`PayHere notification signature verification failed for Order: ${orderId}`);
      return new NextResponse('Invalid signature', { status: 400 });
    }

    console.log(`PayHere verified notification received: Order ${orderId}, Status: ${statusCode}, Amount: ${payhereAmount} ${payhereCurrency}`);

    // If status_code is '2' -> Payment was successful
    if (statusCode === '2') {
      // In production with Supabase connected, update payments & orders table
      // and write entry to seller_ledger
    }

    return new NextResponse('OK', { status: 200 });
  } catch (err: any) {
    console.error('Error handling PayHere notification:', err);
    return new NextResponse('Error', { status: 500 });
  }
}
