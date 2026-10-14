import React, { Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import HeroShowcase from '@/components/HeroShowcase';
import ProductCatalog from '@/components/ProductCatalog';
import { getProducts } from '@/lib/db/products';
import { ShieldCheck, Truck, RefreshCw, Lock } from 'lucide-react';

interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function CatalogSection({ searchParams }: HomePageProps) {
  const resolvedParams = await searchParams;
  const category = typeof resolvedParams.category === 'string' ? resolvedParams.category : undefined;
  const condition = typeof resolvedParams.condition === 'string' ? resolvedParams.condition : undefined;
  const search = typeof resolvedParams.search === 'string' ? resolvedParams.search : undefined;

  const products = await getProducts({
    categorySlug: category,
    condition,
    search,
  });

  return (
    <ProductCatalog
      initialProducts={products}
      initialCategory={category || 'all'}
      initialCondition={condition || 'all'}
      initialSearch={search || ''}
    />
  );
}

export default function HomePage({ searchParams }: HomePageProps) {
  return (
    <div className="min-h-screen bg-[#E6E9EC] text-[#00203F] selection:bg-[#00203F] selection:text-[#36ECDE]">
      {/* Navigation */}
      <Navbar />

      {/* Luxury Hero Visual Showcase from PDF Page 21-22 */}
      <HeroShowcase />

      {/* Faceted Marketplace Catalog & Filters with Suspense */}
      <Suspense fallback={
        <div className="mx-auto max-w-[1760px] px-4 py-16 text-center text-xs font-semibold text-[#2F2F2F]/60">
          Loading verified marketplace equipment...
        </div>
      }>
        <CatalogSection searchParams={searchParams} />
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
                  Condition Transparency
                </h4>
                <p className="mt-1 text-[11px] text-[#2F2F2F]/70">
                  Accurate grades, shutter counts, actual item photos, and defect disclosures.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
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
