'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug } from '@/lib/db/products';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShoppingBag,
  ArrowLeft,
  Share2,
  MessageSquare,
  Send,
  Loader2,
  Heart,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { addToCart } = useCart();
  const { authUser } = useAuth();
  const { isWishlisted: checkWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const isWishlisted = product ? checkWishlist(product.id) : false;
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  // Real Database Reviews State
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewFeedback, setReviewFeedback] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return;
      setLoading(true);
      const res = await getProductBySlug(slug);
      setProduct(res);
      setLoading(false);

      if (res?.id) {
        fetchReviews(res.id);
      }
    }
    fetchProduct();
  }, [slug]);

  async function fetchReviews(productId: string) {
    try {
      setReviewsLoading(true);
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();
      if (data.reviews) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!product || !reviewComment.trim()) return;

    try {
      setSubmittingReview(true);
      setReviewFeedback(null);

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          userId: authUser?.id || undefined,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setReviewFeedback('Thank you! Your verified review has been published to Supabase.');
      setReviewComment('');
      setShowReviewForm(false);
      fetchReviews(product.id);
    } catch (err: any) {
      setReviewFeedback(err.message || 'Error publishing review');
    } finally {
      setSubmittingReview(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E6E9EC]">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <div className="inline-block h-8 w-8 animate-spin border-4 border-[#00203F]/20 border-t-[#00203F]" />
          <p className="mt-4 text-xs font-semibold text-[#2F2F2F]/70">Loading equipment specifications...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#E6E9EC]">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <h1 className="text-2xl font-black text-[#00203F]">Equipment Not Found</h1>
          <p className="mt-2 text-xs text-[#2F2F2F]/70">The requested gear listing may have been sold or archived.</p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 bg-[#00203F] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#36ECDE] hover:text-[#00203F] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Marketplace</span>
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : [
    {
      id: 'default',
      storage_path: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
      is_primary: true,
      sort_order: 1,
    }
  ];

  const handleAddToCart = () => {
    if (product.stock_quantity > 0) {
      addToCart(product, quantity);
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (product.stock_quantity > 0) {
      addToCart(product, quantity);
      router.push('/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-[#E6E9EC]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-[#2F2F2F]/60">
          <Link href="/" className="hover:text-[#00203F] transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/category/${product.category?.slug}`} className="hover:text-[#00203F] transition-colors">
            {product.category?.name}
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#00203F] line-clamp-1">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Product Images & Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-4/3 w-full overflow-hidden border border-[#00203F]/15 bg-white p-4 shadow-xs">
              <img
                src={images[selectedImageIndex]?.storage_path || images[0].storage_path}
                alt={product.name}
                className="h-full w-full object-contain object-center transition-all duration-300"
              />
              {product.condition === 'used' && (
                <div className="absolute top-4 left-4 bg-[#00203F] text-[#36ECDE] border border-[#36ECDE]/40 px-3 py-1 text-[11px] font-bold tracking-wider uppercase">
                  Actual Photos of Used Item
                </div>
              )}
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden border-2 bg-white transition ${
                      selectedImageIndex === idx
                        ? 'border-[#00203F] shadow-sm'
                        : 'border-[#00203F]/15 opacity-70 hover:opacity-100 hover:border-[#00203F]/40'
                    }`}
                  >
                    <img
                      src={img.storage_path}
                      alt={img.alt_text || 'Thumbnail'}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Pre-Owned / Condition Disclosures Card */}
            {(product.condition === 'used' || product.condition === 'refurbished') && (
              <div className="border border-[#00203F]/15 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-[#00203F] font-bold text-sm">
                  <Info className="h-4 w-4 text-[#00203F]" />
                  <span>Verified Condition & Usage Disclosures</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#2F2F2F]/70 block">Condition Grade:</span>
                    <span className="font-bold text-[#00203F] capitalize">
                      {product.condition_grade ? product.condition_grade.replace('_', ' ') : 'Inspected Good'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#2F2F2F]/70 block">Operating / Usage History:</span>
                    <span className="font-semibold text-[#00203F]">
                      {product.usage_details || 'Verified working order.'}
                    </span>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-[#2F2F2F]/70 block">Disclosed Blemishes / Defects:</span>
                    <span className="font-medium text-[#2F2F2F]">
                      {product.known_defects || 'No structural or sensor defects reported.'}
                    </span>
                  </div>

                  {product.included_accessories && (
                    <div className="sm:col-span-2">
                      <span className="text-[#2F2F2F]/70 block">Included Accessories:</span>
                      <span className="font-medium text-[#2F2F2F]">
                        {product.included_accessories}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Technical Specifications Table */}
            <div className="border border-[#00203F]/15 bg-white p-6 shadow-xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#00203F] mb-4">
                Technical Specifications
              </h3>
              <div className="divide-y divide-[#00203F]/10 text-xs">
                {product.attributes.map((attr) => (
                  <div key={attr.name} className="py-2.5 flex justify-between gap-4">
                    <span className="font-semibold text-[#2F2F2F]/70">{attr.name}</span>
                    <span className="text-right font-medium text-[#00203F]">{attr.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Purchase Controls & Seller Identity */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border border-[#00203F]/15 bg-white p-6 shadow-xs space-y-6">
              {/* Brand & Title */}
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#2F2F2F]/60">
                  {product.brand?.name} • SKU: {product.sku}
                </span>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-[#00203F] sm:text-3xl">
                  {product.name}
                </h1>
              </div>

              {/* Price & Taxes */}
              <div className="border-t border-b border-[#00203F]/10 py-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-[#00203F] font-mono">
                    LKR {product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  {product.compare_at_price && product.compare_at_price > product.price && (
                    <span className="text-base text-[#2F2F2F]/40 line-through font-mono">
                      LKR {product.compare_at_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  )}
                  <span className="bg-[#36ECDE]/20 border border-[#36ECDE]/40 px-2 py-0.5 text-xs font-bold text-[#00203F]">
                    Tax Included
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#2F2F2F]/60">
                  Secure escrow payment held until product inspection confirmation.
                </p>
              </div>

              {/* Stock and Quantity */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-2 text-[#2F2F2F]">
                  <span>Stock Availability:</span>
                  {product.stock_quantity > 0 ? (
                    <span className="text-[#00203F] font-bold">
                      {product.stock_quantity} available in verified inventory
                    </span>
                  ) : (
                    <span className="text-red-600 font-bold">Out of stock</span>
                  )}
                </div>

                {product.stock_quantity > 0 && (
                  <div className="flex items-center gap-3">
                    <label className="text-xs text-[#2F2F2F]/70">Qty:</label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="border border-[#00203F]/20 bg-white px-3 py-1.5 text-xs font-bold text-[#00203F] focus:outline-none focus:border-[#00203F]"
                    >
                      {Array.from({ length: Math.min(product.stock_quantity, 5) }).map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Add to Cart & Buy Now Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#00203F] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-[#36ECDE] hover:text-[#00203F] disabled:bg-[#00203F]/20 disabled:text-[#2F2F2F]/40 transition-colors"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={product.stock_quantity === 0}
                  className="w-full inline-flex items-center justify-center gap-2 border-2 border-[#00203F] bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#00203F] hover:bg-[#00203F] hover:text-white disabled:border-[#00203F]/20 disabled:text-[#2F2F2F]/40 transition-colors"
                >
                  <span>Instant Checkout</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`w-full inline-flex items-center justify-center gap-2 border py-2.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs ${
                    isWishlisted
                      ? 'border-[#36ECDE] bg-[#36ECDE]/20 text-[#00203F]'
                      : 'border-[#00203F]/20 bg-white text-[#00203F] hover:bg-[#E6E9EC]'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-[#00203F] text-[#00203F]' : ''}`} />
                  <span>{isWishlisted ? 'Saved to Favorites' : 'Add to Favorites'}</span>
                </button>

                {addedToast && (
                  <p className="text-center text-xs font-bold text-[#00203F] animate-fade-in">
                    ✓ Item added to cart!
                  </p>
                )}
              </div>

              {/* Buyer Guarantees */}
              <div className="border-t border-[#00203F]/10 pt-4 space-y-2.5 text-xs text-[#2F2F2F]/80">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-[#00203F]" />
                  <span>Fast express courier delivery with live tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-[#00203F]" />
                  <span>{product.return_policy_days}-day return policy & buyer protection</span>
                </div>
                {product.warranty_details && (
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#00203F]" />
                    <span>{product.warranty_details}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Seller Profile Card (PDF Page 2 & 3) */}
            <div className="border border-[#00203F]/15 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#2F2F2F]/60">
                    Seller Profile
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <h3 className="font-bold text-[#00203F]">
                      {product.seller?.store_name}
                    </h3>
                    {product.seller?.is_verified && (
                      <span className="inline-flex items-center gap-1 bg-[#36ECDE]/20 border border-[#36ECDE]/40 text-[#00203F] text-[10px] font-bold px-2 py-0.5">
                        <ShieldCheck className="h-3 w-3 text-[#00203F]" /> Verified Seller
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#E6E9EC] text-[#00203F] border border-[#00203F]/15">
                    {product.seller?.seller_type === 'business' ? '🏬 Registered Shop' : 'Creator Seller'}
                  </span>
                  {product.seller?.business_registration_number && (
                    <span className="block mt-1 text-[10px] text-[#2F2F2F]/60 font-mono">
                      BR: {product.seller.business_registration_number}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-[#2F2F2F]/80">
                {product.seller?.bio || 'Verified vendor on CreatorGear.'}
              </p>

              <div className="grid grid-cols-3 gap-2 border-t border-[#00203F]/10 pt-3 text-center text-xs">
                <div>
                  <span className="text-[10px] text-[#2F2F2F]/60 block">Rating</span>
                  <span className="font-bold text-[#00203F]">★ {product.seller?.rating || '5.0'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#2F2F2F]/60 block">Sales</span>
                  <span className="font-bold text-[#00203F]">{product.seller?.completed_orders || 0}+ orders</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#2F2F2F]/60 block">Trust</span>
                  <span className="font-bold text-[#00203F]">100% Escrow</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Real Customer Reviews Section (Supabase reviews) */}
        <div className="mt-12 border border-[#00203F]/15 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#00203F]/10">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black uppercase tracking-wider text-[#00203F]">
                  Customer Ratings & Reviews
                </h2>
                <span className="bg-[#36ECDE]/20 text-[#00203F] border border-[#36ECDE]/40 px-2 py-0.5 text-[10px] font-bold">
                  Live Supabase DB
                </span>
              </div>
              <p className="mt-1 text-xs text-[#2F2F2F]/70">
                Authentic buyer feedback verified by platform order records.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-1.5 justify-end">
                  <Star className="h-5 w-5 fill-[#00203F] text-[#00203F]" />
                  <span className="text-xl font-black text-[#00203F]">
                    {reviews.length > 0 
                      ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
                      : (product.rating || '5.0')}
                  </span>
                  <span className="text-xs text-[#2F2F2F]/60">/ 5.0</span>
                </div>
                <span className="text-[11px] text-[#2F2F2F]/60 block">
                  Based on {reviews.length} customer review(s)
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="inline-flex items-center gap-1.5 bg-[#00203F] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#36ECDE] hover:text-[#00203F] transition-colors shadow-xs"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>{showReviewForm ? 'Cancel' : 'Write a Review'}</span>
              </button>
            </div>
          </div>

          {/* Feedback banner */}
          {reviewFeedback && (
            <div className="mt-4 p-3 bg-[#36ECDE]/20 border border-[#36ECDE] text-xs font-bold text-[#00203F]">
              {reviewFeedback}
            </div>
          )}

          {/* Write a Review Drawer */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mt-6 border border-[#00203F]/15 bg-[#E6E9EC]/50 p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#00203F]">
                Leave Your Equipment Review
              </h3>

              <div>
                <label className="block text-xs font-semibold text-[#00203F] mb-1.5">
                  Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 transition-colors ${
                          star <= reviewRating
                            ? 'fill-[#00203F] text-[#00203F]'
                            : 'text-[#00203F]/20'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#00203F] ml-2">
                    {reviewRating} of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#00203F] mb-1.5">
                  Your Detailed Review
                </label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details about equipment condition, optical clarity, delivery packaging, or seller communication..."
                  className="w-full border border-[#00203F]/20 bg-white p-3 text-xs text-[#2F2F2F] focus:outline-none focus:border-[#00203F]"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#2F2F2F]/60">
                  {authUser ? `Reviewing as ${authUser.email}` : 'Posting with verified creator account'}
                </span>
                <button
                  type="submit"
                  disabled={submittingReview || !reviewComment.trim()}
                  className="inline-flex items-center gap-2 bg-[#00203F] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#36ECDE] hover:text-[#00203F] disabled:bg-[#00203F]/30 transition-colors shadow-xs"
                >
                  {submittingReview ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                  <span>Publish Review</span>
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          <div className="mt-6">
            {reviewsLoading ? (
              <div className="py-12 text-center text-xs text-[#2F2F2F]/60">
                <Loader2 className="mx-auto h-5 w-5 animate-spin mb-2 text-[#00203F]" />
                Loading verified customer reviews...
              </div>
            ) : reviews.length === 0 ? (
              <div className="py-10 text-center border border-dashed border-[#00203F]/20 text-xs text-[#2F2F2F]/60">
                No customer reviews posted for this gear listing yet. Be the first creator to share your experience!
              </div>
            ) : (
              <div className="divide-y divide-[#00203F]/10">
                {reviews.map((rev) => (
                  <div key={rev.id} className="py-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center bg-[#00203F] text-[#36ECDE] text-xs font-bold">
                          {(rev.user?.full_name || rev.user?.email || 'C')[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#00203F]">
                              {rev.user?.full_name || rev.user?.email?.split('@')[0] || 'Verified Customer'}
                            </span>
                            <span className="inline-flex items-center gap-1 bg-[#36ECDE]/20 text-[#00203F] text-[9px] font-bold px-1.5 py-0.2">
                              <ShieldCheck className="h-2.5 w-2.5" /> Verified Purchase
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-right">
                        <div className="flex text-[#00203F]">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < rev.rating
                                  ? 'fill-[#00203F] text-[#00203F]'
                                  : 'text-[#00203F]/20'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-[#2F2F2F]/50">
                          {new Date(rev.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#2F2F2F] leading-relaxed pt-1">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
