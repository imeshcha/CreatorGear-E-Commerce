'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug } from '@/lib/db/products';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
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
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return;
      setLoading(true);
      const res = await getProductBySlug(slug);
      setProduct(res);
      setLoading(false);
    }
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F4F4]">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-neutral-900" />
          <p className="mt-4 text-xs font-semibold text-neutral-500">Loading equipment specifications...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F4F4F4]">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <h1 className="text-2xl font-black text-neutral-900">Equipment Not Found</h1>
          <p className="mt-2 text-xs text-neutral-500">The requested gear listing may have been sold or archived.</p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition"
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
    <div className="min-h-screen bg-[#F4F4F4]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-neutral-500">
          <Link href="/" className="hover:text-neutral-900">Home</Link>
          <span>/</span>
          <Link href={`/?category=${product.category?.slug}`} className="hover:text-neutral-900">
            {product.category?.name}
          </Link>
          <span>/</span>
          <span className="font-semibold text-neutral-800 line-clamp-1">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Product Images & Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
              <img
                src={images[selectedImageIndex]?.storage_path || images[0].storage_path}
                alt={product.name}
                className="h-full w-full object-contain object-center transition-all duration-300"
              />
              {product.condition === 'used' && (
                <div className="absolute top-4 left-4 rounded-full bg-amber-500/90 text-white px-3 py-1 text-[11px] font-bold tracking-wider uppercase backdrop-blur-xs">
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
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition ${
                      selectedImageIndex === idx
                        ? 'border-neutral-900 shadow-md'
                        : 'border-neutral-200 opacity-70 hover:opacity-100'
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

            {/* Pre-Owned / Condition Disclosures Card (PDF Page 9) */}
            {(product.condition === 'used' || product.condition === 'refurbished') && (
              <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <Info className="h-4 w-4 text-amber-600" />
                  <span>Verified Condition & Usage Disclosures</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-neutral-500 block">Condition Grade:</span>
                    <span className="font-bold text-neutral-900 capitalize">
                      {product.condition_grade ? product.condition_grade.replace('_', ' ') : 'Inspected Good'}
                    </span>
                  </div>

                  <div>
                    <span className="text-neutral-500 block">Operating / Usage History:</span>
                    <span className="font-semibold text-neutral-900">
                      {product.usage_details || 'Verified working order.'}
                    </span>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-neutral-500 block">Disclosed Blemishes / Defects:</span>
                    <span className="font-medium text-neutral-800">
                      {product.known_defects || 'No structural or sensor defects reported.'}
                    </span>
                  </div>

                  {product.included_accessories && (
                    <div className="sm:col-span-2">
                      <span className="text-neutral-500 block">Included Accessories:</span>
                      <span className="font-medium text-neutral-800">
                        {product.included_accessories}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Technical Specifications Table (PDF Page 10) */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">
                Technical Specifications
              </h3>
              <div className="divide-y divide-neutral-100 text-xs">
                {product.attributes.map((attr) => (
                  <div key={attr.name} className="py-2.5 flex justify-between gap-4">
                    <span className="font-semibold text-neutral-500">{attr.name}</span>
                    <span className="text-right font-medium text-neutral-900">{attr.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Purchase Controls & Seller Identity */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-6">
              {/* Brand & Title */}
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                  {product.brand?.name} • SKU: {product.sku}
                </span>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-neutral-900 sm:text-3xl">
                  {product.name}
                </h1>
              </div>

              {/* Price & Taxes */}
              <div className="border-t border-b border-neutral-100 py-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-neutral-900">
                    ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  {product.compare_at_price && product.compare_at_price > product.price && (
                    <span className="text-base text-neutral-400 line-through">
                      ${product.compare_at_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  )}
                  <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                    Tax Included
                  </span>
                </div>
                <p className="mt-1 text-xs text-neutral-400">
                  Secure escrow payment held until product inspection confirmation.
                </p>
              </div>

              {/* Stock and Quantity */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span>Stock Availability:</span>
                  {product.stock_quantity > 0 ? (
                    <span className="text-emerald-600 font-bold">
                      {product.stock_quantity} available in verified inventory
                    </span>
                  ) : (
                    <span className="text-red-500 font-bold">Out of stock</span>
                  )}
                </div>

                {product.stock_quantity > 0 && (
                  <div className="flex items-center gap-3">
                    <label className="text-xs text-neutral-500">Qty:</label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-bold text-neutral-900 focus:outline-none"
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
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 transition"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={product.stock_quantity === 0}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-900 bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-neutral-900 hover:bg-neutral-50 disabled:border-neutral-200 disabled:text-neutral-400 transition"
                >
                  <span>Instant Checkout</span>
                </button>

                {addedToast && (
                  <p className="text-center text-xs font-semibold text-emerald-600 animate-fade-in">
                    ✓ Item added to cart!
                  </p>
                )}
              </div>

              {/* Buyer Guarantees */}
              <div className="border-t border-neutral-100 pt-4 space-y-2.5 text-xs text-neutral-600">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-neutral-800" />
                  <span>Fast express courier delivery with live tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-neutral-800" />
                  <span>{product.return_policy_days}-day return policy & buyer protection</span>
                </div>
                {product.warranty_details && (
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>{product.warranty_details}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Seller Profile Card (PDF Page 2 & 3) */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Seller Profile
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <h3 className="font-bold text-neutral-900">
                      {product.seller?.store_name}
                    </h3>
                    {product.seller?.is_verified && (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        <ShieldCheck className="h-3 w-3 text-emerald-600" /> Verified Seller
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                    {product.seller?.seller_type === 'business' ? 'Verified Business' : 'Creator Seller'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-neutral-600">
                {product.seller?.bio || 'Verified vendor on CreatorGear.'}
              </p>

              <div className="grid grid-cols-3 gap-2 border-t border-neutral-100 pt-3 text-center text-xs">
                <div>
                  <span className="text-[10px] text-neutral-400 block">Rating</span>
                  <span className="font-bold text-neutral-900">★ {product.seller?.rating || '5.0'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">Sales</span>
                  <span className="font-bold text-neutral-900">{product.seller?.completed_orders || 0}+ orders</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">Trust</span>
                  <span className="font-bold text-emerald-600">100% Escrow</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
