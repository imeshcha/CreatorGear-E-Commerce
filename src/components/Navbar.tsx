'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { Search, ShoppingBag, User, LogIn, ChevronDown, Heart } from 'lucide-react';
import { CATEGORY_DROPDOWN_DATA } from '@/data/navigation-categories';
import CategoryDropdown from '@/components/CategoryDropdown';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { totalWishlist } = useWishlist();
  const { authUser, userProfile } = useAuth();
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

  const navItems = [
    { id: 'cameras', label: 'Cameras', href: '/category/cameras', isActive: isCameras },
    { id: 'audio', label: 'Audio', href: '/category/audio', isActive: isAudio },
    { id: 'lighting', label: 'Lighting', href: '/category/lighting', isActive: isLighting },
    { id: 'studio-sets', label: 'Studio Sets', href: '/category/studio-sets', isActive: isStudio },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#00203F]/15 bg-[#E6E9EC]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1760px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Left: Minimal Logo & Primary Navigation Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-1.5 group">
            <span className="text-xl font-black tracking-tighter text-[#00203F] group-hover:text-[#2F2F2F] transition-colors">
              GEAR.
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#00203F] bg-[#36ECDE] border border-[#00203F]/20 px-1.5 py-0.5">
              CREATOR
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium tracking-tight text-[#2F2F2F]">
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
                      ? 'text-[#00203F] font-bold border-b-2 border-[#36ECDE] pb-0.5'
                      : activeDropdown === item.id
                      ? 'text-[#00203F] font-semibold'
                      : 'hover:text-[#00203F]'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronDown
                    className={`h-3 w-3 transition-transform duration-200 ${
                      activeDropdown === item.id ? 'rotate-180 text-[#00203F]' : 'text-[#2F2F2F]/50'
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
          </nav>
        </div>

        {/* Center: Search Bar */}
        <form onSubmit={handleSearch} className="hidden sm:flex relative flex-1 max-w-xs mx-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lenses, mics, rigs..."
            className="w-full border border-[#00203F]/20 bg-white py-1.5 pl-9 pr-4 text-xs text-[#00203F] placeholder-[#2F2F2F]/50 focus:border-[#00203F] focus:bg-white focus:outline-none transition-all shadow-sm"
          />
          <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-[#00203F]/60" />
        </form>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {authUser ? (
            <Link
              href="/account"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#00203F] hover:text-[#2F2F2F] px-1.5 py-1 transition group"
              title="My Account"
            >
              <div className="rounded-circle flex h-7 w-7 items-center justify-center bg-[#00203F] text-[#36ECDE] shrink-0 border border-[#00203F]/20 shadow-xs overflow-hidden">
                {userProfile?.avatar_url ? (
                  <img
                    src={userProfile.avatar_url}
                    alt={userProfile.full_name || 'Profile'}
                    className="rounded-circle h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-3.5 w-3.5" />
                )}
              </div>
              <span className="hidden sm:inline max-w-[110px] truncate text-[#00203F] font-semibold">
                {userProfile?.full_name || authUser.email?.split('@')[0]}
              </span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 border border-[#00203F]/30 bg-white px-3 py-1.5 text-xs font-semibold text-[#00203F] hover:bg-[#E6E9EC] transition shadow-xs"
            >
              <LogIn className="h-3.5 w-3.5 text-[#00203F]" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Favorites (Icon Only) */}
          <Link
            href="/wishlist"
            className="relative inline-flex items-center justify-center gap-1.5 border border-[#00203F]/20 bg-white px-2.5 py-1.5 text-xs font-semibold text-[#00203F] hover:bg-[#E6E9EC] transition shadow-2xs"
            title="Saved Favorites"
            aria-label="Favorites"
          >
            <Heart className={`h-4 w-4 ${totalWishlist > 0 ? 'fill-[#00203F] text-[#00203F]' : 'text-[#00203F]'}`} />
            {totalWishlist > 0 && (
              <span className="bg-[#00203F] text-[#36ECDE] px-1.5 py-0.2 text-[10px] font-black">
                {totalWishlist}
              </span>
            )}
          </Link>

          {/* Cart (Icon Only) */}
          <Link
            href="/cart"
            className="relative inline-flex items-center justify-center gap-1.5 bg-[#00203F] px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-[#2F2F2F] transition shadow-sm"
            title="Shopping Cart"
            aria-label="Cart"
          >
            <ShoppingBag className="h-4 w-4 text-[#36ECDE]" />
            {totalItems > 0 && (
              <span className="bg-[#36ECDE] text-[#00203F] px-1.5 py-0.2 text-[10px] font-black">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
