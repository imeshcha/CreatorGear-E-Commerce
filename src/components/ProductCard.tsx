'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { Heart, Star, ShieldCheck, ShoppingBag, Eye, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const primaryImage = product.images.find(img => img.is_primary)?.storage_path || product.images[0]?.storage_path || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80';
  const [imgSrc, setImgSrc] = useState(primaryImage);

  React.useEffect(() => {
    setImgSrc(primaryImage);
  }, [primaryImage]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock_quantity > 0) {
      addToCart(product, 1);
      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 1500);
    }
  };

  const getConditionBadge = () => {
    switch (product.condition) {
      case 'new':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">New</span>;
      case 'used':
        return (
          <span className="bg-amber-50 text-amber-700 border border-amber-200/60 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
            Used {product.condition_grade ? `• ${product.condition_grade.replace('_', ' ')}` : ''}
          </span>
        );
      case 'refurbished':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200/60 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Refurbished</span>;
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200/80 bg-white p-4 sm:p-5 transition-all duration-300 hover:border-neutral-400 hover:shadow-lg">
      <div>
        {/* Top bar on image: Condition & Wishlist */}
        <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-xl bg-neutral-100">
          <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
            {getConditionBadge()}
            {product.stock_quantity === 0 && (
              <span className="bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                Out of Stock
              </span>
            )}
            {product.stock_quantity > 0 && product.stock_quantity <= product.low_stock_threshold && (
              <span className="bg-orange-50 text-orange-600 border border-orange-200 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                Only {product.stock_quantity} Left
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsWishlisted(!isWishlisted);
            }}
            className="absolute top-2.5 right-2.5 z-10 rounded-full bg-white/80 p-2 text-neutral-600 backdrop-blur-xs transition hover:bg-white hover:text-red-500 shadow-xs"
            aria-label="Save to Wishlist"
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </button>

          {/* Product Image */}
          <Link href={`/product/${product.slug}`} className="block h-full w-full">
            <img
              src={imgSrc}
              alt={product.name}
              onError={() => setImgSrc('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80')}
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
        </div>

        {/* Category & Brand */}
        <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-neutral-400">
          <span>{product.category?.name || 'Equipment'}</span>
          <span>{product.brand?.name}</span>
        </div>

        {/* Product Title */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-bold text-neutral-900 group-hover:text-neutral-700 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Seller Info with Verified Badge */}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-neutral-600">
          <span className="text-[11px] text-neutral-400">Seller:</span>
          <span className="font-medium text-neutral-800">{product.seller?.store_name || 'Marketplace Seller'}</span>
          {product.seller?.is_verified && (
            <span
              className="inline-flex items-center gap-0.5 text-emerald-600"
              title="Verified Seller - Identity or Business Confirmed by CreatorGear"
            >
              <ShieldCheck className="h-3.5 w-3.5 fill-emerald-100" />
            </span>
          )}
        </div>

        {/* Warranty Details */}
        {product.warranty_details && (
          <p className="mt-1 text-[11px] text-neutral-500 line-clamp-1">
            🛡️ {product.warranty_details}
          </p>
        )}

        {/* Reviews and Rating */}
        {product.review_count > 0 && (
          <div className="mt-2 flex items-center gap-1 text-xs">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-neutral-800">{product.rating.toFixed(1)}</span>
            <span className="text-neutral-400 text-[11px]">({product.review_count})</span>
          </div>
        )}
      </div>

      {/* Bottom: Price and Actions */}
      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-base font-black text-neutral-900 font-mono whitespace-nowrap">
              LKR {product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="text-xs text-neutral-400 line-through font-mono whitespace-nowrap">
                LKR {product.compare_at_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>
          <span className="text-[10px] text-neutral-400 font-medium">LKR • Tax incl.</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            href={`/product/${product.slug}`}
            className="rounded-lg border border-neutral-200 bg-neutral-50 p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-all shadow-xs ${
              product.stock_quantity === 0
                ? 'cursor-not-allowed bg-neutral-200 text-neutral-400'
                : addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-neutral-900 text-white hover:bg-neutral-800'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
