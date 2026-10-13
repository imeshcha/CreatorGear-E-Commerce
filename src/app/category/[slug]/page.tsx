import React, { Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ProductCatalog from '@/components/ProductCatalog';
import { getProducts } from '@/lib/db/products';
import { ShieldCheck, Truck, RefreshCw, Lock, ChevronRight, Sparkles } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

interface CategoryInfo {
  name: string;
  badge: string;
  tagline: string;
  description: string;
  canonicalSlug: string;
}

const CATEGORY_MAP: Record<string, CategoryInfo> = {
  cameras: {
    name: 'Cameras & Lenses',
    badge: 'Cinema & Mirrorless',
    tagline: 'High-end cinema systems, full-frame cameras & anamorphic glass',
    description: 'Explore verified cinema lines, mirrorless bodies, cine lenses, and anamorphic glass from Sony, RED, Canon, and Blackmagic.',
    canonicalSlug: 'cameras',
  },
  'cameras-and-lenses': {
    name: 'Cameras & Lenses',
    badge: 'Cinema & Mirrorless',
    tagline: 'High-end cinema systems, full-frame cameras & anamorphic glass',
    description: 'Explore verified cinema lines, mirrorless bodies, cine lenses, and anamorphic glass from Sony, RED, Canon, and Blackmagic.',
    canonicalSlug: 'cameras',
  },
  audio: {
    name: 'Audio Equipment',
    badge: 'Broadcast & Field Audio',
    tagline: '32-bit float recorders, wireless mics & shotgun systems',
    description: 'Industry-standard wireless microphone kits, directional shotguns, multi-track audio recorders, and studio monitoring from Røde, Sennheiser, and Zoom.',
    canonicalSlug: 'audio',
  },
  'audio-equipment': {
    name: 'Audio Equipment',
    badge: 'Broadcast & Field Audio',
    tagline: '32-bit float recorders, wireless mics & shotgun systems',
    description: 'Industry-standard wireless microphone kits, directional shotguns, multi-track audio recorders, and studio monitoring from Røde, Sennheiser, and Zoom.',
    canonicalSlug: 'audio',
  },
  lighting: {
    name: 'Lighting & Studio',
    badge: 'Continuous & LED Studio',
    tagline: 'High-output Bowens mount LEDs, softboxes & RGB fixtures',
    description: 'Daylight & bi-color point-source LED lights, wireless DMX controllers, parabolic softboxes, and light shapers from Aputure, Nanlite, and Amaran.',
    canonicalSlug: 'lighting',
  },
  'lighting-and-studio': {
    name: 'Lighting & Studio',
    badge: 'Continuous & LED Studio',
    tagline: 'High-output Bowens mount LEDs, softboxes & RGB fixtures',
    description: 'Daylight & bi-color point-source LED lights, wireless DMX controllers, parabolic softboxes, and light shapers from Aputure, Nanlite, and Amaran.',
    canonicalSlug: 'lighting',
  },
  'video-production': {
    name: 'Studio Sets & Video Production',
    badge: 'Rigs, Gimbals & Monitoring',
    tagline: 'Pro 3-axis stabilizers, wireless video links & field monitors',
    description: 'Carbon fiber gimbals, motorized sliders, production monitors, teleprompters, and studio grip from DJI, SmallHD, and Tilta.',
    canonicalSlug: 'video-production',
  },
  'studio-sets': {
    name: 'Studio Sets & Video Production',
    badge: 'Rigs, Gimbals & Monitoring',
    tagline: 'Pro 3-axis stabilizers, wireless video links & field monitors',
    description: 'Carbon fiber gimbals, motorized sliders, production monitors, teleprompters, and studio grip from DJI, SmallHD, and Tilta.',
    canonicalSlug: 'video-production',
  },
  streaming: {
    name: 'Streaming & Content Creation',
    badge: 'Live Streaming & Workstations',
    tagline: 'Capture cards, stream controllers & green screen kits',
    description: 'Low-latency 4K capture interfaces, mechanical macro controllers, studio webcams, and portable backdrop systems for creators.',
    canonicalSlug: 'streaming',
  },
  'streaming-and-content': {
    name: 'Streaming & Content Creation',
    badge: 'Live Streaming & Workstations',
    tagline: 'Capture cards, stream controllers & green screen kits',
    description: 'Low-latency 4K capture interfaces, mechanical macro controllers, studio webcams, and portable backdrop systems for creators.',
    canonicalSlug: 'streaming',
  },
  accessories: {
    name: 'Gear Accessories & Power',
    badge: 'Storage & Power Systems',
    tagline: 'V-mount batteries, CFexpress cards & rugged pelican cases',
    description: 'High-capacity V-Mount batteries, high-speed CFexpress Type A & B memory cards, multi-bay chargers, and hard travel cases.',
    canonicalSlug: 'accessories',
  },
};

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const condition = typeof resolvedSearchParams.condition === 'string' ? resolvedSearchParams.condition : undefined;
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined;

  const info = CATEGORY_MAP[slug] || {
    name: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    badge: 'Verified Gear',
    tagline: 'Creator equipment inspected for quality and performance',
    description: `Browse verified ${slug.replace(/-/g, ' ')} listings with secure escrow protection.`,
    canonicalSlug: slug,
  };

  const products = await getProducts({
    categorySlug: info.canonicalSlug,
    condition,
    search,
  });

  return (
    <div className="min-h-screen bg-[#F4F4F4] text-neutral-900 selection:bg-neutral-900 selection:text-white">
      <Navbar />

      {/* Clean Category Hero Banner (No 3D featured showcase, direct to category context) */}
      <section className="border-b border-neutral-200/80 bg-white py-10 sm:py-12">
        <div className="mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-neutral-400 mb-4">
            <Link href="/" className="hover:text-neutral-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-neutral-500 font-medium">Categories</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-neutral-900 font-bold">{info.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 text-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider mb-3">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>{info.badge}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 uppercase">
                {info.name}
              </h1>
              <p className="mt-2 text-sm text-neutral-600 max-w-2xl">
                {info.description}
              </p>
            </div>

            {/* Quick Guarantees Pill */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-neutral-600">
              <span className="inline-flex items-center gap-1 rounded-lg bg-neutral-100 px-3 py-1.5 border border-neutral-200">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Verified Inspection</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg bg-neutral-100 px-3 py-1.5 border border-neutral-200">
                <Lock className="h-3.5 w-3.5 text-neutral-700" />
                <span>Escrow Protected</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Filter System & Product Grid */}
      <Suspense
        fallback={
          <div className="mx-auto max-w-[1760px] px-4 py-16 text-center text-xs font-semibold text-neutral-500">
            Loading {info.name} equipment...
          </div>
        }
      >
        <ProductCatalog
          key={info.canonicalSlug}
          initialProducts={products}
          initialCategory={info.canonicalSlug}
          initialCondition={condition || 'all'}
          initialSearch={search || ''}
          title={`${info.name.toUpperCase()} CATALOG`}
          description={info.tagline}
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

      {/* Minimal Footer */}
      <footer className="border-t border-neutral-200 bg-[#F4F4F4] py-10 text-xs text-neutral-500">
        <div className="mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-neutral-900 tracking-tighter text-base">GEAR.</span>
            <span>© 2026 CreatorGear Marketplace Inc. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 font-medium text-neutral-600">
            <Link href="/seller/apply" className="font-bold text-neutral-900 hover:text-neutral-600 transition-colors">
              Sell on CreatorGear
            </Link>
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
