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
        return <span className="bg-[#36ECDE]/20 text-[#00203F] border border-[#36ECDE] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">New</span>;
      case 'used':
        return (
          <span className="bg-[#E6E9EC] text-[#00203F] border border-[#00203F]/20 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
            Used {product.condition_grade ? `• ${product.condition_grade.replace('_', ' ')}` : ''}
          </span>
        );
      case 'refurbished':
        return <span className="bg-[#00203F]/10 text-[#00203F] border border-[#00203F]/20 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">Refurbished</span>;
    }
  };

  return (
    <div className="group relative flex flex-col justify-between border border-[#00203F]/15 bg-white p-4 sm:p-5 transition-all duration-300 hover:border-[#00203F] hover:shadow-lg">
      <div>
        {/* Top bar on image: Condition & Wishlist */}
        <div className="relative mb-3 aspect-square w-full overflow-hidden bg-[#E6E9EC]">
          <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
            {getConditionBadge()}
            {product.stock_quantity === 0 && (
              <span className="bg-[#2F2F2F] text-white border border-[#2F2F2F] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                Out of Stock
              </span>
            )}
            {product.stock_quantity > 0 && product.stock_quantity <= product.low_stock_threshold && (
              <span className="bg-[#36ECDE] text-[#00203F] border border-[#00203F]/20 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
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
            className="absolute top-2.5 right-2.5 z-10 bg-white/90 p-2 text-[#00203F] backdrop-blur-xs transition hover:bg-[#36ECDE] hover:text-[#00203F] shadow-xs"
            aria-label="Save to Wishlist"
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-[#00203F] text-[#00203F]' : ''}`} />
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
        <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-[#2F2F2F]/60">
          <span>{product.category?.name || 'Equipment'}</span>
          <span className="text-[#00203F] font-bold">{product.brand?.name}</span>
        </div>

        {/* Product Title */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-bold text-[#00203F] group-hover:text-[#2F2F2F] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Seller Info with Verified Badge */}
        <div className="mt-2 flex items-center flex-wrap gap-1.5 text-xs text-[#2F2F2F]">
          <span className="text-[11px] text-[#2F2F2F]/60">Seller:</span>
          <span className="font-semibold text-[#00203F]">{product.seller?.store_name || 'Marketplace Seller'}</span>
          {product.seller?.seller_type === 'business' && (
            <span
              className="inline-flex items-center gap-1 bg-[#00203F] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#36ECDE] border border-[#00203F]"
              title="Registered Business / Equipment Store"
            >
              Shop
            </span>
          )}
          {product.seller?.is_verified && (
            <span
              className="inline-flex items-center gap-0.5 text-[#00203F]"
              title="Verified Seller - Identity or Business Confirmed by CreatorGear"
            >
              <ShieldCheck className="h-3.5 w-3.5 fill-[#36ECDE] text-[#00203F]" />
            </span>
          )}
        </div>

        {/* Warranty Details */}
        {product.warranty_details && (
          <p className="mt-1 text-[11px] text-[#2F2F2F]/70 line-clamp-1">
            🛡️ {product.warranty_details}
          </p>
        )}

        {/* Reviews and Rating */}
        {product.review_count > 0 && (
          <div className="mt-2 flex items-center gap-1 text-xs">
            <Star className="h-3.5 w-3.5 fill-[#36ECDE] text-[#00203F]" />
            <span className="font-bold text-[#00203F]">{product.rating.toFixed(1)}</span>
            <span className="text-[#2F2F2F]/60 text-[11px]">({product.review_count})</span>
          </div>
        )}
      </div>

      {/* Bottom: Price and Actions */}
      <div className="mt-4 pt-3 border-t border-[#00203F]/10 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-base font-black text-[#00203F] font-mono whitespace-nowrap">
              LKR {product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="text-xs text-[#2F2F2F]/50 line-through font-mono whitespace-nowrap">
                LKR {product.compare_at_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>
          <span className="text-[10px] text-[#2F2F2F]/60 font-medium">LKR • Tax incl.</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            href={`/product/${product.slug}`}
            className="border border-[#00203F]/20 bg-[#E6E9EC] p-2 text-[#00203F] hover:bg-white hover:border-[#00203F] transition"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold transition-all shadow-xs ${
              product.stock_quantity === 0
                ? 'cursor-not-allowed bg-[#E6E9EC] text-[#2F2F2F]/40'
                : addedAnimation
                ? 'bg-[#36ECDE] text-[#00203F]'
                : 'bg-[#00203F] text-white hover:bg-[#36ECDE] hover:text-[#00203F]'
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
