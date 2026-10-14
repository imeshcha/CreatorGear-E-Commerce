import React, { Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ProductCatalog from '@/components/ProductCatalog';
import { getProducts } from '@/lib/db/products';
import { ShieldCheck, Truck, RefreshCw, Lock, ChevronRight, Tag, Percent } from 'lucide-react';

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
    <div className="min-h-screen bg-[#E6E9EC] text-[#2F2F2F] selection:bg-[#00203F] selection:text-[#36ECDE]">
      <Navbar />

      {/* Deals Header Banner with cinematic warm studio background */}
      <section className="relative border-b border-[#00203F]/20 bg-[#00203F] py-12 sm:py-16 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/images/hero-bg.jpg')` }}
        />
        
        {/* Dark Vignette & Neutral Tint Overlays (No blue-wash, crisp natural studio tone) */}
        <div className="absolute inset-0 z-0 bg-black/65" />
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/90 via-black/60 to-black/85" />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

        <div className="relative z-10 mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-white/70 mb-5">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-white/40" />
            <span className="text-[#36ECDE] font-bold tracking-wide">Special Deals</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mb-2.5 bg-[#36ECDE] text-[#00203F] text-[10px] font-black uppercase tracking-wider">
                Limited Time Offers
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase drop-shadow-md">
                Creator Gear Deals
              </h1>
              <p className="mt-3 text-sm sm:text-base text-white/85 max-w-2xl leading-relaxed drop-shadow">
                Browse verified price drops and exclusive package discounts on cameras, microphones, LED lights, and studio production rigs.
              </p>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-white">
              <span className="inline-flex items-center gap-1.5 bg-[#36ECDE]/20 backdrop-blur-md px-3.5 py-2 border border-[#36ECDE]/50 text-[#36ECDE] font-bold shadow-sm">
                <Percent className="h-4 w-4 text-[#36ECDE]" />
                <span>Verified Price Cuts</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3.5 py-2 border border-white/20 text-white shadow-sm">
                <ShieldCheck className="h-4 w-4 text-[#36ECDE]" />
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
      <section className="border-t border-[#00203F]/15 bg-white py-12">
        <div className="mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-start gap-3">
              <div className="bg-[#E6E9EC] p-2.5 text-[#00203F]">
                <ShieldCheck className="h-5 w-5 text-[#00203F]" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#00203F]">
                  Verified Seller Identity
                </h4>
                <p className="mt-1 text-[11px] text-[#2F2F2F]/70">
                  Strict compliance review for verified stores and individual creators.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-[#E6E9EC] p-2.5 text-[#00203F]">
                <Lock className="h-5 w-5 text-[#00203F]" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#00203F]">
                  Multi-Channel Escrow
                </h4>
                <p className="mt-1 text-[11px] text-[#2F2F2F]/70">
                  PayHere cards, direct on-chain crypto, and COD courier tracking.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-[#E6E9EC] p-2.5 text-[#00203F]">
                <Truck className="h-5 w-5 text-[#00203F]" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#00203F]">
                  Tracked Fulfillment
                </h4>
                <p className="mt-1 text-[11px] text-[#2F2F2F]/70">
                  Independent dispatch tracking and real-time courier checkpoints.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-[#E6E9EC] p-2.5 text-[#00203F]">
                <RefreshCw className="h-5 w-5 text-[#00203F]" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#00203F]">
                  Inspection Protection
                </h4>
                <p className="mt-1 text-[11px] text-[#2F2F2F]/70">
                  Return policy and escrow held until you verify package condition.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#00203F]/15 bg-[#E6E9EC] py-10 text-xs text-[#2F2F2F]/70">
        <div className="mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-[#00203F] tracking-tighter text-base">GEAR.</span>
            <span>© 2026 CreatorGear Marketplace Inc. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 font-medium text-[#2F2F2F]">
            <Link href="/seller/apply" className="font-bold text-[#00203F] hover:text-[#36ECDE] transition-colors">
              Sell on CreatorGear
            </Link>
            <a href="#" className="hover:text-[#00203F]">Terms of Service</a>
            <a href="#" className="hover:text-[#00203F]">Privacy Policy</a>
            <a href="#" className="hover:text-[#00203F]">Escrow Security</a>
            <a href="#" className="hover:text-[#00203F]">Seller Agreement</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
