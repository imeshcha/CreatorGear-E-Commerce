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
      <div className="min-h-screen bg-[#F4F4F4]">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-24 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-xs">
            <span className="text-2xl">🎒</span>
          </div>
          <h1 className="mt-4 text-2xl font-black text-neutral-900">Your Cart is Empty</h1>
          <p className="mt-2 text-xs text-neutral-500">
            Browse our verified inventory for cinema cameras, audio, and studio lighting.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Discover Creator Gear</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black tracking-tight text-neutral-900 sm:text-3xl">
            SHOPPING CART ({totalItems})
          </h1>
          <p className="text-xs text-neutral-500">
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
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={img}
                      alt={product.name}
                      className="h-20 w-20 shrink-0 rounded-xl object-cover bg-neutral-100"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        {product.condition} {product.condition_grade ? `• ${product.condition_grade}` : ''}
                      </span>
                      <h3 className="text-sm font-bold text-neutral-900 line-clamp-1">
                        <Link href={`/product/${product.slug}`} className="hover:underline">
                          {product.name}
                        </Link>
                      </h3>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500">
                        <span>Sold by:</span>
                        <span className="font-semibold text-neutral-800">
                          {product.seller?.store_name || 'Marketplace Vendor'}
                        </span>
                        {product.seller?.is_verified && (
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 inline" />
                        )}
                      </div>
                      <div className="mt-1 text-xs font-mono font-bold text-neutral-900">
                        LKR {product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-neutral-300 rounded-lg bg-neutral-50">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="p-1.5 text-neutral-600 hover:text-neutral-900"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 text-xs font-bold text-neutral-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        disabled={quantity >= product.stock_quantity}
                        className="p-1.5 text-neutral-600 hover:text-neutral-900 disabled:opacity-30"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Total for item */}
                    <div className="text-right">
                      <span className="text-sm font-black text-neutral-900 font-mono">
                        LKR {(product.price * quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id)}
                      className="text-neutral-400 hover:text-red-500 transition"
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
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Order Summary
              </h2>

              <div className="space-y-2 text-xs divide-y divide-neutral-100">
                <div className="flex justify-between py-2 text-neutral-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-bold text-neutral-900 font-mono">
                    LKR {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between py-2 text-neutral-600">
                  <span>Estimated Shipping</span>
                  <span className="font-bold text-emerald-600">FREE Express</span>
                </div>
                <div className="flex justify-between py-2 text-neutral-600">
                  <span>Taxes & Marketplace Protection</span>
                  <span className="font-bold text-neutral-900">Included</span>
                </div>
                <div className="flex justify-between pt-3 text-sm font-black text-neutral-900">
                  <span>Total Amount</span>
                  <span className="font-mono text-base font-black">
                    LKR {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-neutral-800 transition"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="rounded-xl bg-neutral-50 p-3 text-[11px] text-neutral-500 space-y-1">
                <div className="flex items-center gap-1 font-semibold text-neutral-700">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
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
