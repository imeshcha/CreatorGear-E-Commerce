import React, { Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ProductCatalog from '@/components/ProductCatalog';
import { getProducts } from '@/lib/db/products';
import { ShieldCheck, Truck, RefreshCw, Lock, ChevronRight, Tag, Flame, Percent } from 'lucide-react';

interface DealsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const metadata = {
  title: 'Exclusive Creator Deals & Equipment Discounts | CreatorGear',
  description: 'Limited-time price drops on verified cinema cameras, pro audio mics, studio lighting, and video production sets.',
};

export default async function DealsPage({ searchParams }: DealsPageProps) {
  const resolvedSearchParams = await searchParams;
  const condition = typeof resolvedSearchParams.condition === 'string' ? resolvedSearchParams.condition : undefined;
  const category = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : undefined;
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined;

  const products = await getProducts({
    dealsOnly: true,
    categorySlug: category,
    condition,
    search,
  });

  return (
    <div className="min-h-screen bg-[#F4F4F4] text-neutral-900 selection:bg-neutral-900 selection:text-white">
      <Navbar />

      {/* Clean Deals Header Banner (No 3D featured showcase, direct to deals context) */}
      <section className="border-b border-neutral-200/80 bg-white py-10 sm:py-12">
        <div className="mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-neutral-400 mb-4">
            <Link href="/" className="hover:text-neutral-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-emerald-700 font-bold">Special Deals</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 text-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider mb-3">
                <Flame className="h-3.5 w-3.5 text-amber-300" />
                <span>Limited-Time Offers</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 uppercase">
                Creator Gear Deals
              </h1>
              <p className="mt-2 text-sm text-neutral-600 max-w-2xl">
                Browse verified price drops and exclusive package discounts on cameras, microphones, LED lights, and studio production rigs.
              </p>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-neutral-600">
              <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 border border-emerald-200 text-emerald-800">
                <Percent className="h-3.5 w-3.5 text-emerald-600" />
                <span>Verified Price Cuts</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg bg-neutral-100 px-3 py-1.5 border border-neutral-200">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Full Inspection Escrow</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Filter System & Product Grid */}
      <Suspense
        fallback={
          <div className="mx-auto max-w-[1760px] px-4 py-16 text-center text-xs font-semibold text-neutral-500">
            Loading discounted creator equipment...
          </div>
        }
      >
        <ProductCatalog
          key="deals-catalog"
          initialProducts={products}
          initialCategory={category || 'all'}
          initialCondition={condition || 'all'}
          initialSearch={search || ''}
          dealsOnly={true}
          title="VERIFIED DEALS & PRICE DROPS"
          description="Special offers backed by escrow protection and condition guarantees."
        />
      </Suspense>

      {/* Trust & Guarantees Strip */}
      <section className="border-t border-neutral-200/80 bg-white py-12">
        <div className="mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-neutral-100 p-2.5 text-neutral-900">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Verified Seller Identity
                </h4>
                <p className="mt-1 text-[11px] text-neutral-500">
                  Strict compliance review for verified stores and individual creators.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-neutral-100 p-2.5 text-neutral-900">
                <Lock className="h-5 w-5 text-neutral-900" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Multi-Channel Escrow
                </h4>
                <p className="mt-1 text-[11px] text-neutral-500">
                  PayHere cards, direct on-chain crypto, and COD courier tracking.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-neutral-100 p-2.5 text-neutral-900">
                <Truck className="h-5 w-5 text-neutral-900" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Tracked Fulfillment
                </h4>
                <p className="mt-1 text-[11px] text-neutral-500">
                  Independent dispatch tracking and real-time courier checkpoints.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-neutral-100 p-2.5 text-neutral-900">
                <RefreshCw className="h-5 w-5 text-neutral-900" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Inspection Protection
                </h4>
                <p className="mt-1 text-[11px] text-neutral-500">
                  Return policy and escrow held until you verify package condition.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-[#F4F4F4] py-10 text-xs text-neutral-500">
        <div className="mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-neutral-900 tracking-tighter text-base">GEAR.</span>
            <span>© 2026 CreatorGear Marketplace Inc. All rights reserved.</span>
          </div>
          <div className="flex gap-6 font-medium text-neutral-600">
            <a href="#" className="hover:text-neutral-900">Terms of Service</a>
            <a href="#" className="hover:text-neutral-900">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-900">Escrow Security</a>
            <a href="#" className="hover:text-neutral-900">Seller Agreement</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
