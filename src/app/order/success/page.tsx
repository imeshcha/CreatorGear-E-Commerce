'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { CheckCircle2, Package, ShieldCheck, ArrowRight, ExternalLink, Truck } from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') || `ORD-${Date.now()}`;
  const method = searchParams.get('method') || 'payhere';
  const txHash = searchParams.get('tx');

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="rounded-3xl border border-neutral-200 bg-white p-8 sm:p-12 shadow-sm text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Order Confirmed & Escrow Initialized
          </span>
          <h1 className="mt-3 text-2xl font-black tracking-tight text-neutral-900 sm:text-3xl">
            Thank You For Your Order!
          </h1>
          <p className="mt-2 text-xs font-mono font-bold text-neutral-500">
            Order Reference: <span className="text-neutral-900">{orderId}</span>
          </p>
        </div>

        {/* Payment Verification Status Details */}
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-left space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
            Payment & Settlement Verification
          </h2>

          {method === 'cod' && (
            <div className="flex items-start gap-3 text-xs text-neutral-700">
              <Truck className="h-5 w-5 text-neutral-900 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-neutral-900">Cash on Delivery (COD) Registered</p>
                <p className="text-neutral-500 mt-0.5">
                  Your parcel has been routed to our certified logistics partner (PromptXpress). The delivery courier will collect the exact invoice amount upon parcel handover.
                </p>
              </div>
            </div>
          )}

          {method === 'crypto' && (
            <div className="space-y-2 text-xs text-neutral-700">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-neutral-900">Cryptocurrency Transaction Verified On-Chain</p>
                  <p className="text-neutral-500 mt-0.5">
                    Our backend verified the block confirmation via direct JSON-RPC node query. Funds are safely reconciled into platform escrow.
                  </p>
                </div>
              </div>
              {txHash && (
                <div className="mt-2 font-mono text-[11px] bg-white p-2.5 rounded-lg border border-neutral-200 flex items-center justify-between break-all">
                  <span className="text-neutral-600 truncate mr-2">{txHash}</span>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 shrink-0 flex items-center gap-1 font-sans text-xs font-semibold"
                  >
                    <span>Explorer</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          )}

          {method === 'payhere' && (
            <div className="flex items-start gap-3 text-xs text-neutral-700">
              <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-neutral-900">PayHere Payment Capture Verified</p>
                <p className="text-neutral-500 mt-0.5">
                  Signed server-to-server notification authenticated with merchant secret hash. Order is now queued for multi-vendor dispatch.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Multi-Vendor Fulfillment Note */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-left text-xs text-blue-900 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <Package className="h-4 w-4" /> Multi-Vendor Seller Dispatch
          </p>
          <p className="text-[11px] text-blue-800">
            Each individual seller (and brand) in your cart has been notified to inspect and package your equipment. You will receive real-time courier tracking updates.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition shadow-md"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <Navbar />
      <Suspense fallback={<div className="p-12 text-center text-xs">Loading order status...</div>}>
        <OrderSuccessContent />
      </Suspense>
    </div>
  );
}
