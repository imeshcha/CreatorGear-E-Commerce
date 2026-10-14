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
      <div className="border border-[#00203F]/15 bg-white p-8 sm:p-12 shadow-sm text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center bg-[#36ECDE]/20 text-[#00203F] border border-[#36ECDE]/50">
          <CheckCircle2 className="h-10 w-10 text-[#00203F]" />
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#00203F] bg-[#36ECDE]/20 px-3 py-1 border border-[#36ECDE]/50">
            Order Confirmed & Escrow Initialized
          </span>
          <h1 className="mt-3 text-2xl font-black tracking-tight text-[#00203F] sm:text-3xl">
            Thank You For Your Order!
          </h1>
          <p className="mt-2 text-xs font-mono font-bold text-[#2F2F2F]/60">
            Order Reference: <span className="text-[#00203F]">{orderId}</span>
          </p>
        </div>

        {/* Payment Verification Status Details */}
        <div className="border border-[#00203F]/15 bg-[#E6E9EC]/30 p-6 text-left space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#00203F]">
            Payment & Settlement Verification
          </h2>

          {method === 'cod' && (
            <div className="flex items-start gap-3 text-xs text-[#2F2F2F]">
              <Truck className="h-5 w-5 text-[#00203F] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#00203F]">Cash on Delivery (COD) Registered</p>
                <p className="text-[#2F2F2F]/70 mt-0.5">
                  Your parcel has been routed to our certified logistics partner (PromptXpress). The delivery courier will collect the exact invoice amount upon parcel handover.
                </p>
              </div>
            </div>
          )}

          {method === 'crypto' && (
            <div className="space-y-2 text-xs text-[#2F2F2F]">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-[#00203F] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#00203F]">Cryptocurrency Transaction Verified On-Chain</p>
                  <p className="text-[#2F2F2F]/70 mt-0.5">
                    Our backend verified the block confirmation via direct JSON-RPC node query. Funds are safely reconciled into platform escrow.
                  </p>
                </div>
              </div>
              {txHash && (
                <div className="mt-2 font-mono text-[11px] bg-white p-2.5 border border-[#00203F]/15 flex items-center justify-between break-all">
                  <span className="text-[#2F2F2F]/70 truncate mr-2">{txHash}</span>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00203F] hover:text-[#36ECDE] shrink-0 flex items-center gap-1 font-sans text-xs font-semibold"
                  >
                    <span>Explorer</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          )}

          {method === 'payhere' && (
            <div className="flex items-start gap-3 text-xs text-[#2F2F2F]">
              <ShieldCheck className="h-5 w-5 text-[#00203F] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#00203F]">PayHere Payment Capture Verified</p>
                <p className="text-[#2F2F2F]/70 mt-0.5">
                  Signed server-to-server notification authenticated with merchant secret hash. Order is now queued for multi-vendor dispatch.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Multi-Vendor Fulfillment Note */}
        <div className="border border-[#00203F]/20 bg-[#36ECDE]/10 p-4 text-left text-xs text-[#00203F] space-y-1">
          <p className="font-bold flex items-center gap-1.5 text-[#00203F]">
            <Package className="h-4 w-4" /> Multi-Vendor Seller Dispatch
          </p>
          <p className="text-[11px] text-[#2F2F2F]/80">
            Each individual seller (and brand) in your cart has been notified to inspect and package your equipment. You will receive real-time courier tracking updates.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#00203F] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#36ECDE] hover:text-[#00203F] transition shadow-md"
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
    <div className="min-h-screen bg-[#E6E9EC]">
      <Navbar />
      <Suspense fallback={<div className="p-12 text-center text-xs">Loading order status...</div>}>
        <OrderSuccessContent />
      </Suspense>
    </div>
  );
}
