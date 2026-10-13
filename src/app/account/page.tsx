'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import {
  User as UserIcon,
  ShoppingBag,
  ShieldCheck,
  TrendingUp,
  Package,
  PlusCircle,
  LogIn,
  Loader2,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function AccountPage() {
  const { authUser, userProfile, sellerProfile, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'buyer' | 'seller'>('buyer');

  const [realOrders, setRealOrders] = useState<any[]>([]);
  const [realLedger, setRealLedger] = useState<any[]>([]);
  const [realListings, setRealListings] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function loadAccountData() {
      if (!authUser) return;
      setLoadingData(true);

      try {
        // Query real orders for this authenticated customer
        const { data: orders } = await supabase
          .from('orders')
          .select('*, items:order_items(*)')
          .eq('customer_id', authUser.id)
          .order('created_at', { ascending: false });

        if (orders) {
          setRealOrders(orders);
        }

        // Query real ledger and listings if seller
        if (sellerProfile) {
          const { data: ledger } = await supabase
            .from('seller_ledger')
            .select('*')
            .eq('seller_id', authUser.id)
            .order('created_at', { ascending: false });

          if (ledger) {
            setRealLedger(ledger);
          }

          const { data: listings } = await supabase
            .from('products')
            .select('*, images:product_images(*)')
            .eq('seller_id', authUser.id)
            .order('created_at', { ascending: false });

          if (listings) {
            setRealListings(listings);
          }
        }
      } catch (err) {
        console.error('Error fetching account database records:', err);
      } finally {
        setLoadingData(false);
      }
    }

    loadAccountData();
  }, [authUser, sellerProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F4F4]">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-24 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-neutral-400" />
          <p className="mt-3 text-xs font-semibold text-neutral-500">Loading your account...</p>
        </div>
      </div>
    );
  }

  // If not logged in
  if (!authUser) {
    return (
      <div className="min-h-screen bg-[#F4F4F4]">
        <Navbar />
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-xs border border-neutral-200">
            <UserIcon className="h-7 w-7 text-neutral-600" />
          </div>
          <h1 className="mt-4 text-2xl font-black text-neutral-900">
            Sign In Required
          </h1>
          <p className="mt-2 text-xs text-neutral-500">
            Please sign in to view your real order history, saved addresses, and seller dashboard.
          </p>

          <div className="mt-6 flex flex-col gap-2.5">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-neutral-800 transition"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In to CreatorGear</span>
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white py-3 text-xs font-bold uppercase tracking-wider text-neutral-800 hover:bg-neutral-50 transition"
            >
              <span>Create New Account</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const userInitials = (userProfile?.full_name || authUser.email || 'U')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <Navbar />

      <main className="mx-auto max-w-[1760px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Real User Header */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-900 text-white text-lg font-bold">
              {userInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-neutral-900">
                  {userProfile?.full_name || 'Creator'}
                </h1>
                {sellerProfile?.is_verified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    <ShieldCheck className="h-3 w-3 text-emerald-600" />
                    Verified Seller
                  </span>
                ) : sellerProfile ? (
                  <span className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                    Seller (Pending Verification)
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600">
                    Customer Account
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500">
                {authUser.email} • Single account for buying & selling
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!sellerProfile && (
              <Link
                href="/seller/apply"
                className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition shadow-2xs"
              >
                <PlusCircle className="h-3.5 w-3.5 text-neutral-600" />
                <span>Apply as Seller</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => signOut()}
              className="rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Switcher: Buyer vs Seller */}
        <div className="flex border-b border-neutral-200 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('buyer')}
            className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'buyer'
                ? 'border-b-2 border-neutral-900 text-neutral-900'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Buyer Activity & Orders</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('seller')}
            className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'seller'
                ? 'border-b-2 border-neutral-900 text-neutral-900'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span>Seller Dashboard & Ledger</span>
          </button>
        </div>

        {/* Tab 1: Buyer Activity */}
        {activeTab === 'buyer' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">
                Your Placed Orders
              </h2>

              {loadingData ? (
                <div className="py-12 text-center text-xs text-neutral-400">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin mb-2" />
                  Loading your orders from database...
                </div>
              ) : realOrders.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <Package className="mx-auto h-10 w-10 text-neutral-300" />
                  <p className="text-xs font-semibold text-neutral-700">
                    No orders have been placed yet under {authUser.email}.
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    Explore cinema cameras, audio, and studio lighting to make your first purchase.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-5 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition"
                  >
                    <span>Browse Equipment</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100 text-xs">
                  {realOrders.map((ord) => (
                    <div key={ord.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-neutral-900">{ord.id}</span>
                          <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.2 text-[10px] font-bold uppercase">
                            {ord.order_status}
                          </span>
                        </div>
                        <p className="mt-1 font-semibold text-neutral-800">
                          {ord.items?.length || 1} gear item(s) ordered
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          Placed on {new Date(ord.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-mono font-bold text-neutral-900 text-sm">
                          LKR {Number(ord.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Seller Dashboard & Financial Ledger */}
        {activeTab === 'seller' && (
          <div className="space-y-6">
            {!sellerProfile ? (
              <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center space-y-4 shadow-xs">
                <ShieldCheck className="mx-auto h-12 w-12 text-neutral-300" />
                <h3 className="text-base font-bold text-neutral-900">
                  Seller Profile Not Activated
                </h3>
                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                  You are currently registered as a customer. You can sell gear using this same account by completing the seller verification onboarding.
                </p>
                <Link
                  href="/seller/apply"
                  className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Start Seller Verification</span>
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                      Store Name
                    </span>
                    <span className="mt-1 text-xl font-black text-neutral-900 block">
                      {sellerProfile.store_name}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold">
                      {sellerProfile.is_verified ? '✓ Verified Badge Active' : 'Verification In Review'}
                    </span>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                      Commission Rate
                    </span>
                    <span className="mt-1 text-2xl font-black text-neutral-900 font-mono block">
                      {sellerProfile.commission_rate}%
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      Standard platform fee
                    </span>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                      Completed Orders
                    </span>
                    <span className="mt-1 text-2xl font-black text-neutral-900 font-mono block">
                      {sellerProfile.completed_orders || 0}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      Rating: ★ {sellerProfile.rating || 5.0}
                    </span>
                  </div>
                </div>

                {/* Seller Equipment Listings */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                        Your Equipment Listings ({realListings.length})
                      </h3>
                      <p className="text-[11px] text-neutral-400">
                        Live equipment published under your verified vendor store.
                      </p>
                    </div>

                    <Link
                      href="/seller/listings/new"
                      className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition shadow-xs"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span>Create Gear Listing</span>
                    </Link>
                  </div>

                  {realListings.length === 0 ? (
                    <div className="py-8 text-center text-xs text-neutral-400 border border-dashed border-neutral-200 rounded-xl">
                      No gear listings published yet. Click &quot;Create Gear Listing&quot; to upload equipment photos to Supabase Storage and publish specs.
                    </div>
                  ) : (
                    <div className="divide-y divide-neutral-100 text-xs">
                      {realListings.map((item) => (
                        <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0 flex items-center justify-center">
                              {item.images && item.images[0]?.storage_path ? (
                                <img
                                  src={item.images[0].storage_path}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Package className="h-5 w-5 text-neutral-400" />
                              )}
                            </div>
                            <div>
                              <Link
                                href={`/product/${item.slug}`}
                                className="font-bold text-neutral-900 hover:underline block"
                              >
                                {item.name}
                              </Link>
                              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-neutral-500">
                                <span className="font-mono">{item.sku}</span>
                                <span>•</span>
                                <span className="capitalize">{item.condition}</span>
                                <span>•</span>
                                <span className="text-emerald-700 font-semibold">{item.status}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-mono font-bold text-neutral-900 text-sm block">
                              LKR {Number(item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-[10px] text-neutral-400">
                              Qty: {item.stock_quantity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Real Seller Financial Ledger */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">
                    Seller Financial Ledger (seller_ledger)
                  </h3>

                  {realLedger.length === 0 ? (
                    <div className="py-8 text-center text-xs text-neutral-400">
                      No ledger entries recorded yet. Transactions will appear here automatically upon completed customer sales.
                    </div>
                  ) : (
                    <div className="divide-y divide-neutral-100 text-xs">
                      {realLedger.map((entry) => (
                        <div key={entry.id} className="py-3 flex justify-between items-center">
                          <div>
                            <span className="font-bold text-neutral-900 block capitalize">
                              {entry.entry_type.replace('_', ' ')}
                            </span>
                            <span className="text-[10px] text-neutral-400">
                              Ref: {entry.reference_id || entry.id}
                            </span>
                          </div>
                          <span
                            className={`font-mono font-bold ${
                              entry.amount >= 0 ? 'text-emerald-600' : 'text-red-500'
                            }`}
                          >
                            LKR {Math.abs(entry.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
