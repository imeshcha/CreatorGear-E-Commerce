'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Search, ShoppingBag, User, LogIn, LogOut, ChevronDown } from 'lucide-react';
import { CATEGORY_DROPDOWN_DATA } from '@/data/navigation-categories';
import CategoryDropdown from '@/components/CategoryDropdown';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { authUser, userProfile, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/');
    }
  };

  const handleMouseEnter = (menuKey: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveDropdown(menuKey);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const handleMenuClose = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveDropdown(null);
  };

  useEffect(() => {
    handleMenuClose();
  }, [pathname]);

  const isCameras = pathname === '/category/cameras' || pathname === '/category/cameras-and-lenses';
  const isAudio = pathname === '/category/audio' || pathname === '/category/audio-equipment';
  const isLighting = pathname === '/category/lighting' || pathname === '/category/lighting-and-studio';
  const isStudio = pathname === '/category/studio-sets' || pathname === '/category/video-production';
  const isDeals = pathname === '/deals';

  const navItems = [
    { id: 'cameras', label: 'Cameras', href: '/category/cameras', isActive: isCameras },
    { id: 'audio', label: 'Audio', href: '/category/audio', isActive: isAudio },
    { id: 'lighting', label: 'Lighting', href: '/category/lighting', isActive: isLighting },
    { id: 'studio-sets', label: 'Studio Sets', href: '/category/studio-sets', isActive: isStudio },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-[#F4F4F4]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1760px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
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
            {navItems.map((item) => (
              <div
                key={item.id}
                className="relative py-1"
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={item.href}
                  className={`inline-flex items-center gap-1 transition-colors ${
                    item.isActive
                      ? 'text-neutral-900 font-bold border-b-2 border-neutral-900 pb-0.5'
                      : activeDropdown === item.id
                      ? 'text-neutral-900 font-semibold'
                      : 'hover:text-neutral-900'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronDown
                    className={`h-3 w-3 transition-transform duration-200 ${
                      activeDropdown === item.id ? 'rotate-180 text-neutral-900' : 'text-neutral-400'
                    }`}
                  />
                </Link>

                {/* Clean dropdown list showing only the 4 main sections */}
                {activeDropdown === item.id && CATEGORY_DROPDOWN_DATA[item.id] && (
                  <CategoryDropdown
                    data={CATEGORY_DROPDOWN_DATA[item.id]}
                    isOpen={true}
                    onClose={handleMenuClose}
                  />
                )}
              </div>
            ))}

            <Link
              href="/deals"
              className={`transition-colors py-1 ${
                isDeals
                  ? 'text-emerald-700 font-bold border-b-2 border-emerald-600'
                  : 'text-emerald-600 font-semibold hover:text-emerald-700'
              }`}
            >
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
          {authUser ? (
            <div className="flex items-center gap-2">
              <Link
                href="/account"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-800 hover:text-neutral-900 px-2 py-1 transition"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white">
                  {(userProfile?.full_name || authUser.email || 'U')[0].toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">
                  {userProfile?.full_name || authUser.email?.split('@')[0]}
                </span>
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                className="text-neutral-400 hover:text-neutral-900 p-1 transition"
                title="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition shadow-xs"
            >
              <LogIn className="h-3.5 w-3.5 text-neutral-600" />
              <span>Sign In</span>
            </Link>
          )}

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
