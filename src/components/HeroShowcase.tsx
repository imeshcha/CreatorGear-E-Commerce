'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const FEATURED_ITEMS = [
  {
    id: 'prod-sony-fx3',
    slug: 'sony-fx3-cinema-camera',
    title: 'Sony FX3 Cinema Line Full-Frame',
    brand: 'Sony',
    category: 'Cinema Cameras',
    condition: 'New (B2C)',
    price: 3899.00,
    comparePrice: 4199.00,
    seller: 'CineGear Pro Store',
    verified: true,
    rating: 4.95,
    tag: 'Flagship Cinema',
    spec: '10.2MP BSI • 4K 120p • Dual Native ISO',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'prod-red-komodo',
    slug: 'red-komodo-6k-used',
    title: 'RED Komodo 6K Cinema Camera',
    brand: 'RED',
    category: 'Cinema Cameras',
    condition: 'Used (C2C)',
    price: 4450.00,
    comparePrice: 5995.00,
    seller: 'Alex Filmmaking',
    verified: true,
    rating: 5.0,
    tag: 'Pre-Owned Verified',
    spec: '6K Global Shutter • 142 Runtime Hours',
    image: 'https://images.unsplash.com/photo-1589872765807-4475903b4720?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'prod-rode-wireless-pro',
    slug: 'rode-wireless-pro-system',
    title: 'Røde Wireless PRO Dual System',
    brand: 'Røde',
    category: 'Field Audio',
    condition: 'New (B2C)',
    price: 399.00,
    comparePrice: 449.00,
    seller: 'CineGear Pro Store',
    verified: true,
    rating: 4.88,
    tag: '32-Bit Float',
    spec: 'Dual Transmitters • Timecode Sync Case',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'prod-aputure-600d',
    slug: 'aputure-ls-600d-pro-used',
    title: 'Aputure LS 600d Pro Daylight LED',
    brand: 'Aputure',
    category: 'Studio Lighting',
    condition: 'Used (C2C)',
    price: 1390.00,
    comparePrice: 1890.00,
    seller: 'Kasun Creative Tech',
    verified: true,
    rating: 4.9,
    tag: 'Cine Daylight',
    spec: '720W Draw • Bowens Mount • Rolling Case',
    image: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'prod-dji-rs3-pro',
    slug: 'dji-rs-3-pro-combo',
    title: 'DJI RS 3 Pro Gimbal Stabilizer',
    brand: 'DJI',
    category: 'Video Production',
    condition: 'Refurbished',
    price: 749.00,
    comparePrice: 869.00,
    seller: 'Alex Filmmaking',
    verified: true,
    rating: 4.8,
    tag: 'Carbon Fiber',
    spec: '4.5kg Payload • LiDAR Autofocus Ready',
    image: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'prod-sennheiser-mkh416',
    slug: 'sennheiser-mkh-416',
    title: 'Sennheiser MKH 416-P48 Shotgun',
    brand: 'Sennheiser',
    category: 'Field Audio',
    condition: 'New (B2C)',
    price: 999.00,
    comparePrice: 1099.00,
    seller: 'CineGear Pro Store',
    verified: true,
    rating: 5.0,
    tag: 'Broadcast Standard',
    spec: 'RF Condenser • Moisture Resistant Tube',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1000&q=80',
  },
];

export default function HeroShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, FEATURED_ITEMS.length - cardsPerView);

  const nextCard = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Subtle auto-advance every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextCard();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, maxIndex]);

  // Exact CSS transform offset calculation
  const getTransformStyle = () => {
    if (cardsPerView === 1) {
      return `translateX(calc(-${currentIndex} * (100% + 24px)))`;
    }
    if (cardsPerView === 2) {
      return `translateX(calc(-${currentIndex} * (50% + 12px)))`;
    }
    return `translateX(calc(-${currentIndex} * (33.333% + 8px)))`;
  };

  return (
    <section className="relative overflow-hidden bg-[#F4F4F4] pt-8 pb-10">
      {/* Top Metadata Header */}
      <div className="mx-auto flex flex-col items-center text-center px-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300/80 bg-white/80 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-neutral-500 shadow-2xs backdrop-blur-xs">
          <Sparkles className="h-3 w-3 text-neutral-800" />
          <span>Featured Marketplace Collection</span>
        </div>

        {/* Massive Headline */}
        <h1 className="mt-3 text-5xl font-black tracking-tighter text-neutral-900 sm:text-7xl lg:text-8xl">
          CREATOR GEAR
        </h1>

        <div className="mt-2 flex items-center gap-3 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
          <span>Fall 2026 Release</span>
          <span>•</span>
          <span>B2C & C2C Verified Marketplace</span>
          <span>•</span>
          <span>Zero Counterfeit Guarantee</span>
        </div>
      </div>

      {/* Moveable Featured Cards Carousel Container */}
      <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-neutral-300/80 bg-white p-6 shadow-xl sm:p-8">
          
          {/* Top Bar of the Container: Section Title & Slide Controls */}
          <div className="mb-6 flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900 sm:text-base">
                  Featured Equipment Showcase
                </h2>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Verified high-end gear moving card by card
              </p>
            </div>

            {/* Carousel Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevCard}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-700 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white shadow-xs"
                aria-label="Previous card"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={nextCard}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-700 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white shadow-xs"
                aria-label="Next card"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Moveable Cards Track */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out gap-6"
              style={{
                transform: getTransformStyle(),
              }}
            >
              {FEATURED_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 group flex flex-col justify-between rounded-2xl border border-neutral-200/90 bg-[#FAFAFA] p-4 transition-all duration-300 hover:border-neutral-900 hover:bg-white hover:shadow-xl"
                >
                  <div>
                    {/* Image with Tag & Condition */}
                    <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-neutral-100">
                      <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
                        <span className="bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                          {item.tag}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            item.condition.includes('New')
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {item.condition}
                        </span>
                      </div>

                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Metadata & Title */}
                    <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                      <span>{item.brand}</span>
                      <span>{item.category}</span>
                    </div>

                    <h3 className="mt-1 text-sm font-bold text-neutral-900 group-hover:text-neutral-700 line-clamp-1">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-[11px] text-neutral-500 line-clamp-1">
                      {item.spec}
                    </p>

                    {/* Seller details with verified badge */}
                    <div className="mt-2.5 flex items-center gap-1.5 text-xs text-neutral-600">
                      <span className="text-[10px] text-neutral-400">Seller:</span>
                      <span className="font-semibold text-neutral-800 text-[11px]">{item.seller}</span>
                      {item.verified && (
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      )}
                      <div className="ml-auto flex items-center gap-0.5 text-[11px] font-bold text-neutral-700">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span>{item.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Action Button */}
                  <div className="mt-4 pt-3 border-t border-neutral-200/60 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-black text-neutral-900 font-mono">
                          ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                        {item.comparePrice && (
                          <span className="text-xs text-neutral-400 line-through font-mono">
                            ${item.comparePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-400 font-medium">USD • Tax incl.</span>
                    </div>

                    <Link
                      href={`/product/${item.slug}`}
                      className="inline-flex items-center gap-1 rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-neutral-800 shadow-xs"
                    >
                      <span>View</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Step Indicator Dots */}
          <div className="mt-6 flex items-center justify-center gap-1.5">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? 'w-6 bg-neutral-900'
                    : 'w-1.5 bg-neutral-300 hover:bg-neutral-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
