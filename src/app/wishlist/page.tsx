'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Heart, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Package } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-[#E6E9EC] text-[#2F2F2F]">
      <Navbar />

      <main className="mx-auto max-w-[1760px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between border-b border-[#00203F]/15 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#00203F]">
                Saved Favorites
              </h1>
              <span className="bg-[#36ECDE]/20 text-[#00203F] border border-[#36ECDE]/40 px-2 py-0.5 text-[10px] font-bold">
                {wishlist.length} item(s)
              </span>
            </div>
            <p className="text-xs text-[#2F2F2F]/60 mt-1">
              Your shortlisted cameras, lenses, microphones, and studio production equipment.
            </p>
          </div>

          {wishlist.length > 0 && (
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00203F] hover:underline"
            >
              <span>Continue Browsing</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="border border-[#00203F]/15 bg-white p-12 sm:p-16 text-center space-y-4 shadow-xs max-w-xl mx-auto my-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center bg-[#E6E9EC] border border-[#00203F]/15 text-[#00203F]">
              <Heart className="h-8 w-8 text-[#00203F]/40" />
            </div>
            <h2 className="text-lg font-bold text-[#00203F]">
              Your Favorites List is Empty
            </h2>
            <p className="text-xs text-[#2F2F2F]/70 max-w-sm mx-auto">
              Click the heart icon on any camera, lens, audio microphone, or studio light to save it for easy access later.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#00203F] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#36ECDE] hover:text-[#00203F] transition-colors shadow-xs"
            >
              <Package className="h-4 w-4" />
              <span>Explore Equipment</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => {
              const primaryImg = item.images?.find(i => i.is_primary)?.storage_path || item.images?.[0]?.storage_path || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80';
              return (
                <div
                  key={item.id}
                  className="border border-[#00203F]/15 bg-white p-4 shadow-xs flex flex-col justify-between hover:border-[#00203F] transition"
                >
                  <div>
                    <div className="relative aspect-square w-full bg-[#E6E9EC] overflow-hidden mb-3">
                      <img
                        src={primaryImg}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                      <button
                        type="button"
                        onClick={() => toggleWishlist(item)}
                        className="absolute top-2 right-2 bg-white/90 p-1.5 text-[#00203F] hover:bg-red-50 hover:text-red-600 transition shadow-xs"
                        title="Remove from Favorites"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <span className="text-[10px] font-mono text-[#2F2F2F]/60 block uppercase">
                      {item.brand?.name || 'Verified Brand'} • {item.sku}
                    </span>

                    <Link
                      href={`/product/${item.slug}`}
                      className="mt-1 font-bold text-xs text-[#00203F] hover:underline line-clamp-2 block"
                    >
                      {item.name}
                    </Link>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-black font-mono text-[#00203F]">
                        LKR {Number(item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="bg-[#E6E9EC] px-2 py-0.5 text-[9px] font-bold uppercase text-[#00203F]">
                        {item.condition}
                      </span>
                    </div>

                    {item.seller?.store_name && (
                      <div className="mt-2 text-[10px] text-[#2F2F2F]/70 flex items-center gap-1">
                        <span>Store:</span>
                        <span className="font-semibold text-[#00203F] truncate">{item.seller.store_name}</span>
                        {item.seller.is_verified && (
                          <ShieldCheck className="h-3 w-3 text-[#00203F] shrink-0" />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#00203F]/10 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => addToCart(item, 1)}
                      disabled={item.stock_quantity === 0}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#00203F] py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#36ECDE] hover:text-[#00203F] disabled:bg-[#00203F]/20 disabled:text-[#2F2F2F]/40 transition-colors shadow-2xs"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      <span>{item.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
