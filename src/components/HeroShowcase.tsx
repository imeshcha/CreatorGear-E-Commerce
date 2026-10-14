'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, ChevronLeft, ChevronRight, Star, Eye } from 'lucide-react';

const FEATURED_ITEMS = [
  {
    id: 'prod-sony-fx3',
    slug: 'sony-fx3-cinema-camera',
    title: 'Sony FX3 Cinema Line Full-Frame Camera',
    brand: 'Sony',
    category: 'Cinema Cameras',
    condition: 'Brand New',
    price: 3899.00,
    comparePrice: 4199.00,
    seller: 'CineGear Pro Store',
    verified: true,
    rating: 4.95,
    tag: 'Flagship Cinema',
    spec: '10.2MP BSI • 4K 120p All-Intra • Dual Base ISO • Active Fan Cooling',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'prod-red-komodo',
    slug: 'red-komodo-6k-used',
    title: 'RED Komodo 6K Cinema Camera (Black Edition)',
    brand: 'RED Digital Cinema',
    category: 'Cinema Cameras',
    condition: 'Pre-Owned (Verified)',
    price: 4450.00,
    comparePrice: 5995.00,
    seller: 'Alex Filmmaking',
    verified: true,
    rating: 5.0,
    tag: 'Global Shutter',
    spec: '19.9MP Super 35 • 6K 40fps REDCODE RAW • 142 Runtime Hours Only',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'prod-rode-wireless-pro',
    slug: 'rode-wireless-pro-system',
    title: 'Røde Wireless PRO Dual-Channel Mic System',
    brand: 'Røde Microphones',
    category: 'Field Audio',
    condition: 'Brand New',
    price: 399.00,
    comparePrice: 449.00,
    seller: 'CineGear Pro Store',
    verified: true,
    rating: 4.88,
    tag: '32-Bit Float',
    spec: '32-Bit Float On-Board Recording • 260m Range • SMPTE Timecode Sync',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'prod-aputure-600d',
    slug: 'aputure-ls-600d-pro-used',
    title: 'Aputure Light Storm LS 600d Pro Daylight LED',
    brand: 'Aputure',
    category: 'Studio Lighting',
    condition: 'Pre-Owned',
    price: 1390.00,
    comparePrice: 1890.00,
    seller: 'Kasun Creative Tech',
    verified: true,
    rating: 4.9,
    tag: 'Daylight Flagship',
    spec: '720W High Draw • 8,500+ lux at 3m • Bowens Mount • Weatherproof Case',
    image: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'prod-dji-rs3-pro',
    slug: 'dji-rs-3-pro-combo',
    title: 'DJI RS 3 Pro Gimbal Stabilizer Combo',
    brand: 'DJI',
    category: 'Video Production',
    condition: 'Certified Refurbished',
    price: 749.00,
    comparePrice: 869.00,
    seller: 'Alex Filmmaking',
    verified: true,
    rating: 4.8,
    tag: 'LiDAR Focus Ready',
    spec: '4.5kg Tested Payload • Automated Axis Locks • Carbon Fiber Arms',
    image: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'prod-sennheiser-mkh416',
    slug: 'sennheiser-mkh-416',
    title: 'Sennheiser MKH 416-P48 Moisture-Resistant Mic',
    brand: 'Sennheiser',
    category: 'Field Audio',
    condition: 'Brand New',
    price: 999.00,
    comparePrice: 1099.00,
    seller: 'CineGear Pro Store',
    verified: true,
    rating: 5.0,
    tag: 'Broadcast Standard',
    spec: 'Supercardioid RF Condenser • Extreme Humidity Immunity • Balanced XLR',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function HeroShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const wheelLock = useRef(false);

  const total = FEATURED_ITEMS.length;

  const nextCard = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevCard = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // 4-Second Automatic Switching with smooth animation
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextCard();
    }, 4000);
    return () => clearInterval(interval);
  }, [nextCard, isPaused]);

  // Mobile Touch Swipe Handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45) {
      nextCard();
    } else if (distance < -45) {
      prevCard();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Scroll / Wheel Gesture Handling
  const handleWheel = (e: React.WheelEvent) => {
    if (wheelLock.current) return;
    if (Math.abs(e.deltaX) > 25 || Math.abs(e.deltaY) > 50) {
      wheelLock.current = true;
      if (e.deltaX > 0 || e.deltaY > 0) {
        nextCard();
      } else {
        prevCard();
      }
      setTimeout(() => {
        wheelLock.current = false;
      }, 650);
    }
  };

  // 3D Depth Card Stacking Calculation
  const getCardStyle = (index: number) => {
    let diff = (index - currentIndex) % total;
    if (diff < -Math.floor(total / 2)) diff += total;
    if (diff > Math.floor(total / 2)) diff -= total;

    // Center Active Card (Main View)
    if (diff === 0) {
      return {
        transform: 'translateX(0%) scale(1) translateZ(0)',
        zIndex: 30,
        opacity: 1,
        pointerEvents: 'auto' as const,
      };
    }

    // Previous Product (Left Card)
    if (diff === -1) {
      return {
        transform: 'translateX(-30%) scale(0.9) translateZ(-40px)',
        zIndex: 20,
        opacity: 0.65,
        pointerEvents: 'auto' as const,
        cursor: 'pointer',
      };
    }

    // Next Product (Right Card)
    if (diff === 1) {
      return {
        transform: 'translateX(30%) scale(0.9) translateZ(-40px)',
        zIndex: 20,
        opacity: 0.65,
        pointerEvents: 'auto' as const,
        cursor: 'pointer',
      };
    }

    // Hidden / Behind Cards
    return {
      transform: `translateX(${diff > 0 ? '60%' : '-60%'}) scale(0.75) translateZ(-80px)`,
      zIndex: 10,
      opacity: 0,
      pointerEvents: 'none' as const,
    };
  };

  return (
    <section className="relative overflow-hidden bg-[#00203F] pt-8 pb-16 select-none border-b border-[#00203F]/20">
      {/* High-Resolution Cinematic Film Studio Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url('/images/hero-bg.jpg')` }}
      />
      {/* Cinematic Studio Lighting Overlays */}
      <div className="absolute inset-0 z-0 bg-[#00203F]/65 backdrop-blur-[0.5px]" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#00203F]/85 via-transparent to-[#00203F]/90" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#00203F]/80 via-transparent to-[#00203F]/80" />

      {/* 3D Depth-Stacked Carousel Stage with generous side margins */}
      <div
        className="relative z-10 mx-auto max-w-7xl px-6 sm:px-12 md:px-16 lg:px-24"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        {/* Left Arrow Navigation Button */}
        <button
          type="button"
          onClick={prevCard}
          className="hidden sm:flex absolute -left-2 md:left-2 top-1/2 -translate-y-1/2 z-40 bg-[#00203F]/85 text-white p-3 border border-white/20 hover:bg-[#36ECDE] hover:text-[#00203F] transition-all shadow-xl"
          aria-label="Previous Featured Gear"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Right Arrow Navigation Button */}
        <button
          type="button"
          onClick={nextCard}
          className="hidden sm:flex absolute -right-2 md:right-2 top-1/2 -translate-y-1/2 z-40 bg-[#00203F]/85 text-white p-3 border border-white/20 hover:bg-[#36ECDE] hover:text-[#00203F] transition-all shadow-xl"
          aria-label="Next Featured Gear"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* 3D Stage Viewport with Increased Height */}
        <div className="relative min-h-[660px] sm:h-[640px] lg:h-[620px] w-full flex items-center justify-center overflow-visible perspective-[1200px]">
          {FEATURED_ITEMS.map((item, idx) => {
            const isCenter = idx === currentIndex;
            const style = getCardStyle(idx);

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (!isCenter) setCurrentIndex(idx);
                }}
                style={style}
                className="absolute w-[92%] sm:w-[84%] lg:w-[78%] max-w-4xl bg-white border border-[#00203F]/15 text-[#00203F] p-7 sm:p-9 lg:p-10 shadow-xl transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
              >
                {/* 1. TOP TITLE: Product Name on line 1, Condition Badge on next line */}
                <div className="mb-5 space-y-2 px-1">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#00203F] line-clamp-1">
                    {item.title}
                  </h2>

                  {/* Next line: Condition badge */}
                  <div>
                    <span className="inline-block bg-[#36ECDE]/20 border border-[#36ECDE] px-3.5 py-1 text-[11px] font-bold text-[#00203F] uppercase tracking-wider">
                      {item.condition}
                    </span>
                  </div>
                </div>

                {/* 2. MAIN CONTENT: Left Image Box + Right Details Area */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Left Product Image Box (Taller View) */}
                  <div className="md:col-span-7 relative aspect-video md:aspect-auto md:h-96 lg:h-[410px] overflow-hidden bg-[#E6E9EC] border border-[#00203F]/10 shadow-xs group">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Clean Overlay Badges */}
                    <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 bg-[#00203F]/90 px-3.5 py-1 text-[11px] font-bold text-[#36ECDE] backdrop-blur-md border border-[#00203F]">
                      <ShieldCheck className="h-4 w-4 text-[#36ECDE]" />
                      <span>{item.brand} Official</span>
                    </div>

                    <div className="absolute bottom-3.5 right-3.5 bg-[#2F2F2F]/90 px-3 py-1 text-[11px] font-mono text-[#E6E9EC] backdrop-blur-md border border-[#2F2F2F]">
                      {item.category}
                    </div>
                  </div>

                  {/* Right Details & Buttons (Seamless text directly on card, no inner background box) */}
                  <div className="md:col-span-5 flex flex-col justify-between py-2 px-1 sm:px-3">
                    <div>
                      {/* Price Section */}
                      <div className="border-b border-[#00203F]/10 pb-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#2F2F2F]/60 block">
                          Listing Price
                        </span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-2xl sm:text-3xl font-black text-[#00203F] font-mono">
                            LKR {item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                          {item.comparePrice && (
                            <span className="text-xs sm:text-sm text-[#2F2F2F]/50 line-through font-mono">
                              LKR {item.comparePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#00203F] font-bold block mt-1">
                          ✓ Escrow Verified • Tax Included
                        </span>
                      </div>

                      {/* Specs */}
                      <div className="py-3 text-xs text-[#2F2F2F]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F2F2F]/60 block mb-1">
                          Specifications:
                        </span>
                        <p className="line-clamp-2 text-[11px] leading-relaxed text-[#2F2F2F] font-medium">
                          {item.spec}
                        </p>
                      </div>

                      {/* Seller Tag */}
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-[#00203F]/10">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-[#2F2F2F]/60">Seller:</span>
                          <span className="font-semibold text-[#00203F] text-[11px]">{item.seller}</span>
                          {item.verified && (
                            <ShieldCheck className="h-3.5 w-3.5 text-[#00203F] inline" />
                          )}
                        </div>
                        <div className="flex items-center gap-0.5 text-[11px] font-bold text-[#00203F]">
                          <Star className="h-3 w-3 fill-[#36ECDE] text-[#00203F]" />
                          <span>{item.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-[#00203F]/10 flex items-center gap-2">
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#00203F] py-3 px-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#36ECDE] hover:text-[#00203F] shadow-sm transition"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Gear</span>
                      </Link>

                      <Link
                        href={`/product/${item.slug}`}
                        className="inline-flex items-center justify-center border border-[#00203F]/30 bg-white p-3 text-[#00203F] hover:bg-[#E6E9EC] hover:text-[#00203F] shadow-2xs transition"
                        title="Direct Purchase"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>


        {/* Bottom Step Indicator Dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {FEATURED_ITEMS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 transition-all duration-500 ${
                currentIndex === idx
                  ? 'w-8 bg-[#36ECDE] shadow-xs'
                  : 'w-2 bg-white/40 hover:bg-white/80'
              }`}
              aria-label={`Go to featured card ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
