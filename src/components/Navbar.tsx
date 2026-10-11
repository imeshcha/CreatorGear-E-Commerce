'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Search, ShoppingBag, ShieldCheck, User, PlusCircle, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const { totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-[#F4F4F4]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Left: Minimal Logo & Primary Navigation Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-1.5 group">
            <span className="text-xl font-black tracking-tighter text-neutral-900 group-hover:text-neutral-600 transition-colors">
              GEAR.
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 border border-neutral-300 rounded px-1 py-0.5">
              CREATOR
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium tracking-tight text-neutral-600">
            <Link href="/?category=cameras" className="hover:text-neutral-900 transition-colors">
              Cameras
            </Link>
            <Link href="/?category=audio" className="hover:text-neutral-900 transition-colors">
              Audio
            </Link>
            <Link href="/?category=lighting" className="hover:text-neutral-900 transition-colors">
              Lighting
            </Link>
            <Link href="/?category=video-production" className="hover:text-neutral-900 transition-colors">
              Studio Sets
            </Link>
            <Link href="/?condition=used" className="hover:text-neutral-900 transition-colors flex items-center gap-1">
              <span>Pre-Owned (C2C)</span>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                Verified
              </span>
            </Link>
            <Link href="/?deals=true" className="hover:text-neutral-900 text-emerald-600 font-semibold transition-colors">
              Deals
            </Link>
          </nav>
        </div>

        {/* Center: Search Bar */}
        <form onSubmit={handleSearch} className="hidden sm:flex relative flex-1 max-w-xs mx-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lenses, mics, rigs..."
            className="w-full rounded-full border border-neutral-300 bg-white/80 py-1.5 pl-9 pr-4 text-xs text-neutral-800 placeholder-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none transition-all shadow-sm"
          />
          <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-neutral-400" />
        </form>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/seller/apply"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 hover:border-neutral-400 transition shadow-xs"
          >
            <PlusCircle className="h-3.5 w-3.5 text-neutral-600" />
            <span>Sell Gear</span>
          </Link>

          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-neutral-900 px-2 py-1 transition"
            title="Admin Verification & Moderation Dashboard"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Admin</span>
          </Link>

          <Link
            href="/account"
            className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600 hover:text-neutral-900 px-2 py-1 transition"
          >
            <User className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Account</span>
          </Link>

          <Link
            href="/cart"
            className="relative inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 transition shadow-sm"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Cart</span>
            <span className="ml-0.5 rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] font-bold">
              {totalItems}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
