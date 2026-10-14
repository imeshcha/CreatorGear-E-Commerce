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
      <div className="min-h-screen bg-[#E6E9EC]">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-24 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#00203F]" />
          <p className="mt-3 text-xs font-semibold text-[#2F2F2F]/70">Loading your account...</p>
        </div>
      </div>
    );
  }

  // If not logged in
  if (!authUser) {
    return (
      <div className="min-h-screen bg-[#E6E9EC]">
        <Navbar />
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center bg-white shadow-xs border border-[#00203F]/15">
            <UserIcon className="h-7 w-7 text-[#00203F]" />
          </div>
          <h1 className="mt-4 text-2xl font-black text-[#00203F]">
            Sign In Required
          </h1>
          <p className="mt-2 text-xs text-[#2F2F2F]/70">
            Please sign in to view your real order history, saved addresses, and seller dashboard.
          </p>

          <div className="mt-6 flex flex-col gap-2.5">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-[#00203F] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-[#36ECDE] hover:text-[#00203F] transition-colors"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In to CreatorGear</span>
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center justify-center border border-[#00203F]/20 bg-white py-3 text-xs font-bold uppercase tracking-wider text-[#00203F] hover:bg-[#E6E9EC] transition-colors"
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
    <div className="min-h-screen bg-[#E6E9EC]">
      <Navbar />

      <main className="mx-auto max-w-[1760px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Real User Header */}
        <div className="border border-[#00203F]/15 bg-white p-6 sm:p-8 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center bg-[#00203F] text-[#36ECDE] text-lg font-bold">
              {userInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-[#00203F]">
                  {userProfile?.full_name || 'Creator'}
                </h1>
                {sellerProfile?.is_verified ? (
                  <span className="inline-flex items-center gap-1 bg-[#36ECDE]/20 border border-[#36ECDE]/40 px-2 py-0.5 text-[10px] font-bold text-[#00203F]">
                    <ShieldCheck className="h-3 w-3 text-[#00203F]" />
                    Verified Seller
                  </span>
                ) : sellerProfile ? (
                  <span className="inline-flex items-center bg-[#E6E9EC] border border-[#00203F]/15 px-2 py-0.5 text-[10px] font-bold text-[#00203F]">
                    Seller (Pending Verification)
                  </span>
                ) : (
                  <span className="inline-flex items-center bg-[#E6E9EC] px-2 py-0.5 text-[10px] font-semibold text-[#2F2F2F]/70">
                    Customer Account
                  </span>
                )}
              </div>
              <p className="text-xs text-[#2F2F2F]/60">
                {authUser.email} • Single account for buying & selling
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!sellerProfile && (
              <Link
                href="/seller/apply"
                className="inline-flex items-center gap-1.5 border border-[#00203F]/20 bg-white px-4 py-2 text-xs font-semibold text-[#00203F] hover:bg-[#E6E9EC] transition shadow-2xs"
              >
                <PlusCircle className="h-3.5 w-3.5 text-[#00203F]" />
                <span>Apply as Seller</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => signOut()}
              className="border border-[#00203F]/15 bg-[#E6E9EC] px-4 py-2 text-xs font-semibold text-[#00203F] hover:bg-[#00203F] hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Switcher: Buyer vs Seller */}
        <div className="flex border-b border-[#00203F]/15 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('buyer')}
            className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'buyer'
                ? 'border-b-2 border-[#00203F] text-[#00203F]'
                : 'text-[#2F2F2F]/50 hover:text-[#00203F]'
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
                ? 'border-b-2 border-[#00203F] text-[#00203F]'
                : 'text-[#2F2F2F]/50 hover:text-[#00203F]'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span>Seller Dashboard & Ledger</span>
          </button>
        </div>

        {/* Tab 1: Buyer Activity */}
        {activeTab === 'buyer' && (
          <div className="space-y-4">
            <div className="border border-[#00203F]/15 bg-white p-6 shadow-xs">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#00203F] mb-4">
                Your Placed Orders
              </h2>

              {loadingData ? (
                <div className="py-12 text-center text-xs text-[#2F2F2F]/60">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin mb-2 text-[#00203F]" />
                  Loading your orders from database...
                </div>
              ) : realOrders.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <Package className="mx-auto h-10 w-10 text-[#00203F]/30" />
                  <p className="text-xs font-semibold text-[#00203F]">
                    No orders have been placed yet under {authUser.email}.
                  </p>
                  <p className="text-[11px] text-[#2F2F2F]/60">
                    Explore cinema cameras, audio, and studio lighting to make your first purchase.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 bg-[#00203F] px-5 py-2 text-xs font-bold text-white hover:bg-[#36ECDE] hover:text-[#00203F] transition-colors"
                  >
                    <span>Browse Equipment</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-[#00203F]/10 text-xs">
                  {realOrders.map((ord) => (
                    <div key={ord.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#00203F]">{ord.id}</span>
                          <span className="bg-[#36ECDE]/20 text-[#00203F] border border-[#36ECDE]/40 px-2 py-0.5 text-[10px] font-bold uppercase">
                            {ord.order_status}
                          </span>
                        </div>
                        <p className="mt-1 font-semibold text-[#2F2F2F]">
                          {ord.items?.length || 1} gear item(s) ordered
                        </p>
                        <p className="text-[11px] text-[#2F2F2F]/60">
                          Placed on {new Date(ord.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-mono font-bold text-[#00203F] text-sm">
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
              <div className="border border-[#00203F]/15 bg-white p-12 text-center space-y-4 shadow-xs">
                <ShieldCheck className="mx-auto h-12 w-12 text-[#00203F]/30" />
                <h3 className="text-base font-bold text-[#00203F]">
                  Seller Profile Not Activated
                </h3>
                <p className="text-xs text-[#2F2F2F]/70 max-w-md mx-auto">
                  You are currently registered as a customer. You can sell gear using this same account by completing the seller verification onboarding.
                </p>
                <Link
                  href="/seller/apply"
                  className="inline-flex items-center gap-2 bg-[#00203F] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#36ECDE] hover:text-[#00203F] transition-colors"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Start Seller Verification</span>
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="border border-[#00203F]/15 bg-white p-5 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F2F2F]/60 block">
                      Store Name
                    </span>
                    <span className="mt-1 text-xl font-black text-[#00203F] block">
                      {sellerProfile.store_name}
                    </span>
                    <span className="text-[10px] text-[#00203F] font-bold">
                      {sellerProfile.is_verified ? '✓ Verified Badge Active' : 'Verification In Review'}
                    </span>
                  </div>

                  <div className="border border-[#00203F]/15 bg-white p-5 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F2F2F]/60 block">
                      Commission Rate
                    </span>
                    <span className="mt-1 text-2xl font-black text-[#00203F] font-mono block">
                      {sellerProfile.commission_rate}%
                    </span>
                    <span className="text-[10px] text-[#2F2F2F]/60">
                      Standard platform fee
                    </span>
                  </div>

                  <div className="border border-[#00203F]/15 bg-white p-5 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F2F2F]/60 block">
                      Completed Orders
                    </span>
                    <span className="mt-1 text-2xl font-black text-[#00203F] font-mono block">
                      {sellerProfile.completed_orders || 0}
                    </span>
                    <span className="text-[10px] text-[#2F2F2F]/60">
                      Rating: ★ {sellerProfile.rating || 5.0}
                    </span>
                  </div>
                </div>

                {/* Seller Equipment Listings */}
                <div className="border border-[#00203F]/15 bg-white p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#00203F]">
                        Your Equipment Listings ({realListings.length})
                      </h3>
                      <p className="text-[11px] text-[#2F2F2F]/60">
                        Live equipment published under your verified vendor store.
                      </p>
                    </div>

                    <Link
                      href="/seller/listings/new"
                      className="inline-flex items-center gap-1.5 bg-[#00203F] px-4 py-2 text-xs font-bold text-white hover:bg-[#36ECDE] hover:text-[#00203F] transition-colors shadow-xs"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span>Create Gear Listing</span>
                    </Link>
                  </div>

                  {realListings.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#2F2F2F]/60 border border-dashed border-[#00203F]/20">
                      No gear listings published yet. Click &quot;Create Gear Listing&quot; to upload equipment photos to Supabase Storage and publish specs.
                    </div>
                  ) : (
                    <div className="divide-y divide-[#00203F]/10 text-xs">
                      {realListings.map((item) => (
                        <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 bg-[#E6E9EC] border border-[#00203F]/15 overflow-hidden shrink-0 flex items-center justify-center">
                              {item.images && item.images[0]?.storage_path ? (
                                <img
                                  src={item.images[0].storage_path}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Package className="h-5 w-5 text-[#00203F]/40" />
                              )}
                            </div>
                            <div>
                              <Link
                                href={`/product/${item.slug}`}
                                className="font-bold text-[#00203F] hover:underline block"
                              >
                                {item.name}
                              </Link>
                              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#2F2F2F]/60">
                                <span className="font-mono">{item.sku}</span>
                                <span>•</span>
                                <span className="capitalize">{item.condition}</span>
                                <span>•</span>
                                <span className="text-[#00203F] font-bold">{item.status}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-mono font-bold text-[#00203F] text-sm block">
                              LKR {Number(item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-[10px] text-[#2F2F2F]/60">
                              Qty: {item.stock_quantity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Real Seller Financial Ledger */}
                <div className="border border-[#00203F]/15 bg-white p-6 shadow-xs">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#00203F] mb-4">
                    Seller Financial Ledger (seller_ledger)
                  </h3>

                  {realLedger.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#2F2F2F]/60">
                      No ledger entries recorded yet. Transactions will appear here automatically upon completed customer sales.
                    </div>
                  ) : (
                    <div className="divide-y divide-[#00203F]/10 text-xs">
                      {realLedger.map((entry) => (
                        <div key={entry.id} className="py-3 flex justify-between items-center">
                          <div>
                            <span className="font-bold text-[#00203F] block capitalize">
                              {entry.entry_type.replace('_', ' ')}
                            </span>
                            <span className="text-[10px] text-[#2F2F2F]/60">
                              Ref: {entry.reference_id || entry.id}
                            </span>
                          </div>
                          <span
                            className={`font-mono font-bold ${
                              entry.amount >= 0 ? 'text-[#00203F]' : 'text-red-600'
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
