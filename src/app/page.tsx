import React, { Suspense } from 'react';
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
    <div className="min-h-screen bg-[#F4F4F4] text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Navigation */}
      <Navbar />

      {/* Luxury Hero Visual Showcase from PDF Page 21-22 */}
      <HeroShowcase />

      {/* Faceted Marketplace Catalog & Filters with Suspense */}
      <Suspense fallback={
        <div className="mx-auto max-w-7xl px-4 py-16 text-center text-xs font-semibold text-neutral-500">
          Loading verified marketplace equipment...
        </div>
      }>
        <CatalogSection searchParams={searchParams} />
      </Suspense>

      {/* Trust & Guarantees Strip */}
      <section className="border-t border-neutral-200/80 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-neutral-100 p-2.5 text-neutral-900">
                <ShieldCheck className="h-5 w-5" />
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
                <Lock className="h-5 w-5" />
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
                <Truck className="h-5 w-5" />
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
                <RefreshCw className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Condition Transparency
                </h4>
                <p className="mt-1 text-[11px] text-neutral-500">
                  Accurate grades, shutter counts, actual item photos, and defect disclosures.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="border-t border-neutral-200 bg-[#F4F4F4] py-10 text-xs text-neutral-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
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
