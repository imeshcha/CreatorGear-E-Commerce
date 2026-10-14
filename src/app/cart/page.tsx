'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#E6E9EC]">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-24 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center bg-white shadow-xs border border-[#00203F]/15">
            <span className="text-2xl">🎒</span>
          </div>
          <h1 className="mt-4 text-2xl font-black text-[#00203F]">Your Cart is Empty</h1>
          <p className="mt-2 text-xs text-[#2F2F2F]/70">
            Browse our verified inventory for cinema cameras, audio, and studio lighting.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 bg-[#00203F] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#36ECDE] hover:text-[#00203F] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Discover Creator Gear</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E6E9EC]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black tracking-tight text-[#00203F] sm:text-3xl">
            SHOPPING CART ({totalItems})
          </h1>
          <p className="text-xs text-[#2F2F2F]/70">
            Multi-vendor marketplace order • Direct settlement with individual sellers and brands
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map(({ product, quantity }) => {
              const img = product.images[0]?.storage_path || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80';

              return (
                <div
                  key={product.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[#00203F]/15 bg-white p-5 shadow-xs"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={img}
                      alt={product.name}
                      className="h-20 w-20 shrink-0 object-cover bg-[#E6E9EC]"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F2F2F]/60">
                        {product.condition} {product.condition_grade ? `• ${product.condition_grade}` : ''}
                      </span>
                      <h3 className="text-sm font-bold text-[#00203F] line-clamp-1">
                        <Link href={`/product/${product.slug}`} className="hover:underline">
                          {product.name}
                        </Link>
                      </h3>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-[#2F2F2F]/70">
                        <span>Sold by:</span>
                        <span className="font-semibold text-[#00203F]">
                          {product.seller?.store_name || 'Marketplace Vendor'}
                        </span>
                        {product.seller?.is_verified && (
                          <ShieldCheck className="h-3.5 w-3.5 text-[#00203F] inline" />
                        )}
                      </div>
                      <div className="mt-1 text-xs font-mono font-bold text-[#00203F]">
                        LKR {product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-[#00203F]/20 bg-[#E6E9EC]/50">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="p-1.5 text-[#00203F] hover:bg-[#00203F]/10 transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 text-xs font-bold text-[#00203F]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        disabled={quantity >= product.stock_quantity}
                        className="p-1.5 text-[#00203F] hover:bg-[#00203F]/10 disabled:opacity-30 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Total for item */}
                    <div className="text-right">
                      <span className="text-sm font-black text-[#00203F] font-mono">
                        LKR {(product.price * quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id)}
                      className="text-[#2F2F2F]/40 hover:text-red-600 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-4">
            <div className="border border-[#00203F]/15 bg-white p-6 shadow-xs space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#00203F]">
                Order Summary
              </h2>

              <div className="space-y-2 text-xs divide-y divide-[#00203F]/10">
                <div className="flex justify-between py-2 text-[#2F2F2F]/80">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-bold text-[#00203F] font-mono">
                    LKR {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between py-2 text-[#2F2F2F]/80">
                  <span>Estimated Shipping</span>
                  <span className="font-bold text-[#00203F]">FREE Express</span>
                </div>
                <div className="flex justify-between py-2 text-[#2F2F2F]/80">
                  <span>Taxes & Marketplace Protection</span>
                  <span className="font-bold text-[#00203F]">Included</span>
                </div>
                <div className="flex justify-between pt-3 text-sm font-black text-[#00203F]">
                  <span>Total Amount</span>
                  <span className="font-mono text-base font-black text-[#00203F]">
                    LKR {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#00203F] py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-[#36ECDE] hover:text-[#00203F] transition-colors"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="bg-[#E6E9EC] p-3 text-[11px] text-[#2F2F2F]/70 space-y-1">
                <div className="flex items-center gap-1 font-semibold text-[#00203F]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#00203F]" />
                  <span>Multi-Vendor Split Fulfillment</span>
                </div>
                <p>
                  Items will be packaged and tracked securely from each vendor with independent dispatch numbers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
