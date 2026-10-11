import CryptoJS from 'crypto-js';

export interface PayHerePaymentParams {
  merchant_id: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  order_id: string;
  items: string;
  currency: string;
  amount: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

/**
 * Calculates official PayHere MD5 hash for payment initiation
 * Formula: strtoupper(md5(merchant_id + order_id + formatted_amount + currency + strtoupper(md5(merchant_secret))))
 */
export function generatePayHereHash(
  merchantId: string,
  orderId: string,
  amount: number,
  currency: string,
  merchantSecret: string
): string {
  const formattedAmount = Number(amount).toFixed(2);
  const hashedSecret = CryptoJS.MD5(merchantSecret).toString().toUpperCase();
  const rawString = `${merchantId}${orderId}${formattedAmount}${currency}${hashedSecret}`;
  return CryptoJS.MD5(rawString).toString().toUpperCase();
}

/**
 * Verifies PayHere server-to-server IPN/webhook notification signature
 * Formula: strtoupper(md5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + strtoupper(md5(merchant_secret))))
 */
export function verifyPayHereNotification(
  merchantId: string,
  orderId: string,
  payhereAmount: string,
  payhereCurrency: string,
  statusCode: string,
  receivedMd5Sig: string,
  merchantSecret: string
): boolean {
  const hashedSecret = CryptoJS.MD5(merchantSecret).toString().toUpperCase();
  const rawString = `${merchantId}${orderId}${payhereAmount}${payhereCurrency}${statusCode}${hashedSecret}`;
  const localMd5Sig = CryptoJS.MD5(rawString).toString().toUpperCase();

  return localMd5Sig === receivedMd5Sig.toUpperCase();
}

export function getPayHereEndpoint(): string {
  const isSandbox = process.env.NEXT_PUBLIC_PAYHERE_SANDBOX !== 'false';
  return isSandbox
    ? 'https://sandbox.payhere.lk/pay/checkout'
    : 'https://www.payhere.lk/pay/checkout';
}
