export type UserRole = 'customer' | 'seller' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone_number?: string;
  role: UserRole;
  status: 'active' | 'suspended' | 'banned';
  created_at: string;
}

export type SellerType = 'individual' | 'business';
export type VerificationStatus = 
  | 'buyer_only'
  | 'pending'
  | 'approved'
  | 'more_information_required'
  | 'rejected'
  | 'suspended';

export interface SellerProfile {
  id: string; // matches user id
  store_name: string;
  slug: string;
  seller_type: SellerType;
  bio?: string;
  logo_url?: string;
  banner_url?: string;
  business_registration_number?: string;
  tax_id?: string;
  website_url?: string;
  support_email?: string;
  support_phone?: string;
  is_verified: boolean;
  rating: number;
  review_count: number;
  completed_orders: number;
  joined_date: string;
  commission_rate: number;
}

export interface SellerVerificationApplication {
  id: string;
  user_id: string;
  seller_type: SellerType;
  legal_name: string;
  phone_number: string;
  business_name?: string;
  business_registration_number?: string;
  tax_id?: string;
  id_document_url: string;
  proof_of_address_url?: string;
  business_proof_url?: string;
  verification_status: VerificationStatus;
  review_notes?: string;
  reviewed_by?: string;
  reviewed_date?: string;
  appeal_notes?: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon_name?: string;
  image_url?: string;
  parent_id?: string;
  sort_order: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  website?: string;
}

export type ProductCondition = 'new' | 'used' | 'refurbished';
export type ConditionGrade = 'like_new' | 'excellent' | 'good' | 'fair' | 'for_parts';
export type ProductStatus = 'draft' | 'active' | 'archived' | 'suspended';

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface ProductImage {
  id: string;
  storage_path: string;
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
}

export interface Product {
  id: string;
  seller_id: string;
  seller?: SellerProfile;
  name: string;
  slug: string;
  sku: string;
  description: string;
  category_id: string;
  category?: Category;
  brand_id?: string;
  brand?: Brand;
  price: number;
  compare_at_price?: number;
  currency: string;
  condition: ProductCondition;
  condition_grade?: ConditionGrade;
  known_defects?: string;
  usage_details?: string;
  included_accessories?: string;
  warranty_details?: string;
  warranty_provider?: 'seller' | 'manufacturer' | 'none';
  stock_quantity: number;
  low_stock_threshold: number;
  status: ProductStatus;
  return_policy_days: number;
  rating: number;
  review_count: number;
  images: ProductImage[];
  attributes: ProductAttribute[];
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod = 'cod' | 'payhere' | 'crypto';
export type PaymentStatus = 'pending' | 'successful' | 'failed' | 'refunded';
export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'partially_shipped'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  seller_id: string;
  seller?: SellerProfile;
  product?: Product;
  quantity: number;
  unit_price_snapshot: number;
  product_name_snapshot: string;
  condition_snapshot: string;
  commission_rate_snapshot: number;
  commission_amount: number;
  seller_payout_amount: number;
  fulfillment_status: 'pending' | 'processing' | 'dispatched' | 'delivered' | 'cancelled';
}

export interface Order {
  id: string;
  customer_id: string;
  total_amount: number;
  currency: string;
  order_status: OrderStatus;
  shipping_name: string;
  shipping_phone: string;
  shipping_address_line1: string;
  shipping_address_line2?: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  items: OrderItem[];
  payment?: Payment;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  method: PaymentMethod;
  provider: string;
  amount: number;
  currency: string;
  payment_status: PaymentStatus;
  provider_reference?: string;
  created_at: string;
}

export interface CryptoPaymentRequest {
  id: string;
  payment_id: string;
  network: string;
  asset: string;
  expected_amount: number;
  receiving_address: string;
  expires_at: string;
}

export interface CryptoVerificationResult {
  verified: boolean;
  txHash: string;
  fromAddress: string;
  toAddress: string;
  receivedAmount: string;
  confirmationCount: number;
  network: string;
  error?: string;
}

export interface SellerLedgerEntry {
  id: string;
  seller_id: string;
  order_id?: string;
  order_item_id?: string;
  entry_type: 'sale_credit' | 'commission_debit' | 'payout_debit' | 'refund_debit' | 'adjustment';
  amount: number;
  currency: string;
  reference_id?: string;
  balance_after: number;
  created_at: string;
}
