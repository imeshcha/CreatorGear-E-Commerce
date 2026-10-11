'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

const BRANDS = [
  { name: 'SONY', category: 'Cinema & Mirrorless' },
  { name: 'RED', category: 'Digital Cinema' },
  { name: 'CANON', category: 'EOS Optics & Cinema' },
  { name: 'RØDE', category: 'Studio & Field Audio' },
  { name: 'DJI', category: 'Stabilization & Aerial' },
  { name: 'APUTURE', category: 'Cine LED Lighting' },
  { name: 'SENNHEISER', category: 'Pro Broadcast Mic' },
  { name: 'BLACKMAGIC', category: 'DaVinci & Pocket Cinema' },
];

export default function HeroShowcase() {
  return (
    <section className="relative overflow-hidden bg-[#F4F4F4] pt-8 pb-14">
      {/* Top Metadata Badge */}
      <div className="mx-auto flex flex-col items-center text-center px-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300/80 bg-white/70 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-neutral-500 shadow-2xs backdrop-blur-xs">
          <Sparkles className="h-3 w-3 text-neutral-800" />
          <span>Featured Marketplace Collection</span>
        </div>

        {/* Massive Extra-Bold Headline */}
        <h1 className="mt-4 text-5xl font-black tracking-tighter text-neutral-900 sm:text-7xl lg:text-8xl">
          CREATOR GEAR
        </h1>

        {/* Sub-Header Metadata Badge */}
        <div className="mt-2 flex items-center gap-3 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
          <span>Fall 2026 Release</span>
          <span>•</span>
          <span>B2C & C2C Verified Marketplace</span>
          <span>•</span>
          <span>Zero Counterfeit Guarantee</span>
        </div>
      </div>

      {/* Main Visual Showcase Container */}
      <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-neutral-300/80 bg-white p-6 shadow-xl sm:p-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Brand Column */}
            <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-3">
              {BRANDS.slice(0, 4).map((b) => (
                <Link
                  key={b.name}
                  href={`/?search=${b.name}`}
                  className="group rounded-xl border border-neutral-200 bg-[#F9F9F9] p-3.5 transition-all hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
                >
                  <div className="text-sm font-black tracking-wider text-neutral-900 group-hover:text-white">
                    {b.name}
                  </div>
                  <div className="text-[10px] text-neutral-400 group-hover:text-neutral-300">
                    {b.category}
                  </div>
                </Link>
              ))}
            </div>

            {/* Central Hero Camera Card (Dual Layer Composition) */}
            <div className="lg:col-span-6 relative flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 sm:p-8 text-white overflow-hidden shadow-2xl">
              {/* Studio Grid Overlay */}
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)`,
                  backgroundSize: '24px 24px'
                }}
              />

              <div className="relative z-10 w-full flex justify-between items-center text-[10px] uppercase tracking-widest text-neutral-400">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <ShieldCheck className="h-3.5 w-3.5" /> Direct Verified Inventory
                </span>
                <span className="bg-white/10 px-2 py-0.5 rounded text-white font-mono">
                  4K 120P RAW
                </span>
              </div>

              {/* Full-color Flagship Hero Cinema Product */}
              <div className="relative my-6 aspect-video w-full max-w-md overflow-hidden rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=85"
                  alt="Sony FX3 Flagship Cinema Camera"
                  className="h-full w-full object-cover rounded-xl shadow-2xl transition-transform duration-700 hover:scale-105"
                />
              </div>

              <div className="relative z-10 text-center">
                <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Sony FX3 Cinema Line Full-Frame
                </h2>
                <p className="mt-1 text-xs text-neutral-300 max-w-sm mx-auto">
                  10.2MP Back-Illuminated Sensor, Active Cooling Fan & Dual Base ISO. In stock with verified dealer warranty.
                </p>

                <div className="mt-5 flex items-center justify-center gap-3">
                  <Link
                    href="/product/sony-fx3-cinema-camera"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-bold text-neutral-950 hover:bg-neutral-100 transition shadow-lg"
                  >
                    <span>View Specifications</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <Link
                    href="/?condition=used"
                    className="inline-flex items-center gap-1.5 rounded-full border border-neutral-700 bg-white/5 px-4 py-2 text-xs font-semibold text-neutral-200 hover:bg-white/10 transition"
                  >
                    <span>Browse Pre-Owned</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Brand Column */}
            <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-3">
              {BRANDS.slice(4, 8).map((b) => (
                <Link
                  key={b.name}
                  href={`/?search=${b.name}`}
                  className="group rounded-xl border border-neutral-200 bg-[#F9F9F9] p-3.5 transition-all hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
                >
                  <div className="text-sm font-black tracking-wider text-neutral-900 group-hover:text-white">
                    {b.name}
                  </div>
                  <div className="text-[10px] text-neutral-400 group-hover:text-neutral-300">
                    {b.category}
                  </div>
                </Link>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
