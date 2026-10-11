'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, Zap } from 'lucide-react';

export default function HeroLanding() {
  const scrollToFeatured = () => {
    const el = document.getElementById('featured-showcase');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-65px)] flex flex-col justify-between bg-[#F4F4F4] border-b border-neutral-200/80 px-4 sm:px-6 lg:px-8 py-8 lg:py-12 overflow-hidden">
      {/* Background subtle radial texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(0,0,0,0.03) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT COLUMN: Massive Typography & Platform Details */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Small Top Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white/90 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-neutral-600 shadow-2xs backdrop-blur-xs w-fit mb-4">
              <Sparkles className="h-3.5 w-3.5 text-neutral-900" />
              <span>Fall 2026 Release • Verified Marketplace</span>
            </div>

            {/* Massive Headline (CREATOR GEAR) */}
            <div className="select-none">
              <h1 className="text-6xl sm:text-7xl md:text-8xl xl:text-9xl font-black tracking-tighter text-neutral-900 leading-[0.88]">
                CREATOR
              </h1>
              <h1 className="text-6xl sm:text-7xl md:text-8xl xl:text-9xl font-black tracking-tighter text-neutral-900 leading-[0.88] mt-1 sm:mt-2">
                GEAR
              </h1>
            </div>

            {/* Distinct Underline / Accent Divider (Matching sketch) */}
            <div className="my-6 h-1 w-32 sm:w-44 bg-neutral-900 rounded-full" />

            {/* More Details About Platform */}
            <div className="space-y-4 max-w-xl">
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
                The high-performance marketplace engineered for content creators, filmmakers, photographers, and audio engineers. Discover verified cinema cameras, pro lighting, and studio gear with multi-channel escrow protection and guaranteed condition transparency.
              </p>

              {/* Key Platform Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2 text-neutral-800 font-semibold">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Verified Sellers Only</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-800 font-semibold">
                  <Zap className="h-4 w-4 text-neutral-900 shrink-0" />
                  <span>Escrow Safe Payouts</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-800 font-semibold col-span-2 sm:col-span-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>7-Day Return Policy</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={scrollToFeatured}
                  className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 shadow-md transition group"
                >
                  <span>Explore Featured Gear</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <Link
                  href="/seller/apply"
                  className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-900 hover:bg-neutral-50 shadow-2xs transition"
                >
                  <span>Sell Your Equipment</span>
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Luxury Flagship Visual Container */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg aspect-4/3 sm:aspect-square lg:aspect-4/3 rounded-3xl overflow-hidden border border-neutral-300 bg-white p-3 shadow-xl">
              
              {/* Image Frame */}
              <div className="relative h-full w-full rounded-2xl overflow-hidden bg-neutral-950 group">
                <img
                  src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1400&q=85"
                  alt="Flagship Cinema Camera Studio Showcase"
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />

                {/* Ambient Top Tag */}
                <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-neutral-950/80 px-3.5 py-1 text-[11px] font-bold text-white backdrop-blur-md border border-white/10">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Cinema Line • In Stock</span>
                </div>

                {/* Bottom Spec Pill */}
                <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-neutral-950/85 backdrop-blur-md p-3 border border-white/10 text-white flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-black tracking-tight">Sony FX3 Cinema Rig</h3>
                    <p className="text-[10px] text-neutral-400">Full-Frame 4K 120p • Dual Native ISO</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    $3,899
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <div className="relative mx-auto flex flex-col items-center justify-center pt-4">
        <button
          type="button"
          onClick={scrollToFeatured}
          className="flex flex-col items-center gap-1.5 text-neutral-400 hover:text-neutral-900 transition text-[11px] font-semibold tracking-wider uppercase group"
        >
          <span>Scroll To Explore Gear</span>
          <ArrowDown className="h-3.5 w-3.5 group-hover:translate-y-1 transition-transform animate-bounce" />
        </button>
      </div>
    </section>
  );
}
