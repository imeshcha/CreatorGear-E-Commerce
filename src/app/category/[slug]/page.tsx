import React, { Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ProductCatalog from '@/components/ProductCatalog';
import { getProducts } from '@/lib/db/products';
import { ShieldCheck, Truck, RefreshCw, Lock, ChevronRight } from 'lucide-react';

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
  backgroundImage: string;
}

const CATEGORY_MAP: Record<string, CategoryInfo> = {
  cameras: {
    name: 'Cameras & Lenses',
    badge: 'Cinema & Mirrorless',
    tagline: 'High-end cinema systems, full-frame cameras & anamorphic glass',
    description: 'Explore verified cinema lines, mirrorless bodies, cine lenses, and anamorphic glass from Sony, RED, Canon, and Blackmagic.',
    canonicalSlug: 'cameras',
    backgroundImage: '/images/cat-cameras-bg.jpg',
  },
  'cameras-and-lenses': {
    name: 'Cameras & Lenses',
    badge: 'Cinema & Mirrorless',
    tagline: 'High-end cinema systems, full-frame cameras & anamorphic glass',
    description: 'Explore verified cinema lines, mirrorless bodies, cine lenses, and anamorphic glass from Sony, RED, Canon, and Blackmagic.',
    canonicalSlug: 'cameras',
    backgroundImage: '/images/cat-cameras-bg.jpg',
  },
  audio: {
    name: 'Audio Equipment',
    badge: 'Broadcast & Field Audio',
    tagline: '32-bit float recorders, wireless mics & shotgun systems',
    description: 'Industry-standard wireless microphone kits, directional shotguns, multi-track audio recorders, and studio monitoring from Røde, Sennheiser, and Zoom.',
    canonicalSlug: 'audio',
    backgroundImage: '/images/cat-audio-bg.jpg',
  },
  'audio-equipment': {
    name: 'Audio Equipment',
    badge: 'Broadcast & Field Audio',
    tagline: '32-bit float recorders, wireless mics & shotgun systems',
    description: 'Industry-standard wireless microphone kits, directional shotguns, multi-track audio recorders, and studio monitoring from Røde, Sennheiser, and Zoom.',
    canonicalSlug: 'audio',
    backgroundImage: '/images/cat-audio-bg.jpg',
  },
  lighting: {
    name: 'Lighting & Studio',
    badge: 'Continuous & LED Studio',
    tagline: 'High-output Bowens mount LEDs, softboxes & RGB fixtures',
    description: 'Daylight & bi-color point-source LED lights, wireless DMX controllers, parabolic softboxes, and light shapers from Aputure, Nanlite, and Amaran.',
    canonicalSlug: 'lighting',
    backgroundImage: '/images/cat-lighting-bg.jpg',
  },
  'lighting-and-studio': {
    name: 'Lighting & Studio',
    badge: 'Continuous & LED Studio',
    tagline: 'High-output Bowens mount LEDs, softboxes & RGB fixtures',
    description: 'Daylight & bi-color point-source LED lights, wireless DMX controllers, parabolic softboxes, and light shapers from Aputure, Nanlite, and Amaran.',
    canonicalSlug: 'lighting',
    backgroundImage: '/images/cat-lighting-bg.jpg',
  },
  'video-production': {
    name: 'Studio Sets & Video Production',
    badge: 'Rigs, Gimbals & Monitoring',
    tagline: 'Pro 3-axis stabilizers, wireless video links & field monitors',
    description: 'Carbon fiber gimbals, motorized sliders, production monitors, teleprompters, and studio grip from DJI, SmallHD, and Tilta.',
    canonicalSlug: 'video-production',
    backgroundImage: '/images/cat-studio-sets-bg.jpg',
  },
  'studio-sets': {
    name: 'Studio Sets & Video Production',
    badge: 'Rigs, Gimbals & Monitoring',
    tagline: 'Pro 3-axis stabilizers, wireless video links & field monitors',
    description: 'Carbon fiber gimbals, motorized sliders, production monitors, teleprompters, and studio grip from DJI, SmallHD, and Tilta.',
    canonicalSlug: 'video-production',
    backgroundImage: '/images/cat-studio-sets-bg.jpg',
  },
  streaming: {
    name: 'Streaming & Content Creation',
    badge: 'Live Streaming & Workstations',
    tagline: 'Capture cards, stream controllers & green screen kits',
    description: 'Low-latency 4K capture interfaces, mechanical macro controllers, studio webcams, and portable backdrop systems for creators.',
    canonicalSlug: 'streaming',
    backgroundImage: '/images/cat-streaming-bg.jpg',
  },
  'streaming-and-content': {
    name: 'Streaming & Content Creation',
    badge: 'Live Streaming & Workstations',
    tagline: 'Capture cards, stream controllers & green screen kits',
    description: 'Low-latency 4K capture interfaces, mechanical macro controllers, studio webcams, and portable backdrop systems for creators.',
    canonicalSlug: 'streaming',
    backgroundImage: '/images/cat-streaming-bg.jpg',
  },
  accessories: {
    name: 'Gear Accessories & Power',
    badge: 'Storage & Power Systems',
    tagline: 'V-mount batteries, CFexpress cards & rugged pelican cases',
    description: 'High-capacity V-Mount batteries, high-speed CFexpress Type A & B memory cards, multi-bay chargers, and hard travel cases.',
    canonicalSlug: 'accessories',
    backgroundImage: '/images/cat-accessories-bg.jpg',
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
    backgroundImage: '/images/hero-bg.jpg',
  };

  const products = await getProducts({
    categorySlug: info.canonicalSlug,
    condition,
    search,
  });

  return (
    <div className="min-h-screen bg-[#E6E9EC] text-[#2F2F2F] selection:bg-[#00203F] selection:text-[#36ECDE]">
      <Navbar />

      {/* Category Hero Banner with category-specific cinematic background (Zero overlays, 100% pure photographic colors) */}
      <section className="relative border-b border-black/20 bg-black py-12 sm:py-16 overflow-hidden">
        {/* Category Photo Background - completely uninhibited, zero overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${info.backgroundImage}')` }}
        />

        <div className="relative z-10 mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-white/90 mb-5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-white/60" />
            <span className="text-white/80 font-medium">Categories</span>
            <ChevronRight className="h-3 w-3 text-white/60" />
            <span className="text-[#36ECDE] font-bold tracking-wide">{info.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mb-2.5 bg-[#36ECDE] text-[#00203F] text-[10px] font-black uppercase tracking-wider shadow-md">
                {info.badge}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                {info.name}
              </h1>
              <p className="mt-3 text-sm sm:text-base text-white font-medium max-w-2xl leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                {info.description}
              </p>
            </div>

            {/* Quick Guarantees Pill */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-white">
              <span className="inline-flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-3.5 py-2 border border-white/30 shadow-lg">
                <ShieldCheck className="h-4 w-4 text-[#36ECDE]" />
                <span>Verified Inspection</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-3.5 py-2 border border-white/30 shadow-lg">
                <Lock className="h-4 w-4 text-[#36ECDE]" />
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
          showCategoryFilter={false}
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
