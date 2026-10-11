'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import {
  User,
  ShoppingBag,
  ShieldCheck,
  TrendingUp,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  DollarSign,
} from 'lucide-react';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'buyer' | 'seller'>('buyer');

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* User Identity Header */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-900 text-white text-xl font-bold">
              AR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-neutral-900">Alex Robertson</h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  Verified Creator Seller
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Member since 2026 • alex.filmmaker@cinema.io • Single account for buying & selling
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/seller/apply"
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Verification Status</span>
            </Link>
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

        {/* Tab 1: Buyer Orders */}
        {activeTab === 'buyer' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">
                Recent Equipment Orders
              </h2>

              <div className="divide-y divide-neutral-100 text-xs">
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-neutral-900">ORD-2026-8819</span>
                      <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.2 text-[10px] font-bold">
                        Delivered
                      </span>
                    </div>
                    <p className="mt-1 font-semibold text-neutral-800">
                      Røde Wireless PRO Dual-Channel System
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      Sold by CineGear Pro Store • Paid via PayHere Card Gateway
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-neutral-900 text-sm">$399.00 USD</span>
                    <p className="text-[10px] text-neutral-400">Courier: PromptXpress PX-992144</p>
                  </div>
                </div>

                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-neutral-900">ORD-2026-7104</span>
                      <span className="rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.2 text-[10px] font-bold">
                        In Transit
                      </span>
                    </div>
                    <p className="mt-1 font-semibold text-neutral-800">
                      Sony FX3 Cinema Line Camera
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      Paid via Sepolia Crypto (0.892 ETH) • Verified on-chain
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-neutral-900 text-sm">$3,899.00 USD</span>
                    <p className="text-[10px] text-neutral-400">Courier: PromptXpress PX-771822</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Seller Dashboard & Financial Ledger (PDF Pages 6, 7 & 19) */}
        {activeTab === 'seller' && (
          <div className="space-y-6">
            {/* Financial Ledger Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Available Payout Balance
                </span>
                <span className="mt-1 text-2xl font-black text-neutral-900 font-mono block">
                  $4,094.00 USD
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">
                  ✓ Reconciled after 8% commission deduction
                </span>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Total Completed Sales
                </span>
                <span className="mt-1 text-2xl font-black text-neutral-900 font-mono block">
                  34 Orders
                </span>
                <span className="text-[10px] text-neutral-500">
                  Gross: $38,420.00 USD
                </span>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Active Listings Stock
                </span>
                <span className="mt-1 text-2xl font-black text-neutral-900 font-mono block">
                  2 Items
                </span>
                <span className="text-[10px] text-neutral-500">
                  1 Used RED Komodo, 1 DJI RS 3 Pro
                </span>
              </div>
            </div>

            {/* Seller Ledger Entries Table */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  Seller Financial Ledger (seller_ledger)
                </h2>
                <span className="text-[10px] font-semibold text-neutral-400">
                  Automated commission and settlement tracking
                </span>
              </div>

              <div className="divide-y divide-neutral-100 text-xs">
                <div className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-neutral-900 block">Order Sale Credit (RED Komodo 6K)</span>
                    <span className="text-[10px] text-neutral-400">Ref: ORD-2026-6180 • Entry: sale_credit</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-600">+$4,450.00 USD</span>
                </div>

                <div className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-neutral-900 block">Platform Commission Fee (8%)</span>
                    <span className="text-[10px] text-neutral-400">Auto-deduction • Entry: commission_debit</span>
                  </div>
                  <span className="font-mono font-bold text-red-500">-$356.00 USD</span>
                </div>

                <div className="py-3 flex justify-between items-center bg-neutral-50 px-3 rounded-lg">
                  <span className="font-bold text-neutral-800">Net Settled Balance to Seller</span>
                  <span className="font-mono font-black text-neutral-900">+$4,094.00 USD</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
