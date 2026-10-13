'use client';

import React from 'react';
import Link from 'next/link';
import {
  Camera,
  Video,
  Eye,
  Sliders,
  Radio,
  Mic,
  SlidersHorizontal,
  Headphones,
  Sun,
  Zap,
  CircleDot,
  Layers,
  Compass,
  Box,
  Monitor,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { MegaMenuCategory } from '@/data/navigation-categories';

interface MegaMenuProps {
  data: MegaMenuCategory;
  isOpen: boolean;
  onClose: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Camera,
  Video,
  Eye,
  Sliders,
  Radio,
  Mic,
  SlidersHorizontal,
  Headphones,
  Sun,
  Zap,
  CircleDot,
  Layers,
  Compass,
  Box,
  Monitor,
};

export default function MegaMenu({ data, isOpen, onClose }: MegaMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      className="absolute top-full left-0 right-0 w-full border-b border-neutral-200/90 bg-white/95 backdrop-blur-md shadow-2xl transition-all duration-200 ease-out z-50"
      onMouseEnter={() => {}}
    >
      <div className="mx-auto max-w-[1760px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Top Tagline */}
        <div className="mb-6 flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-900 text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="h-3 w-3 text-amber-400" />
              {data.label}
            </span>
            <p className="text-xs text-neutral-500 font-medium">
              {data.tagline}
            </p>
          </div>
          <Link
            href={data.href}
            onClick={onClose}
            className="inline-flex items-center gap-1 text-xs font-bold text-neutral-900 hover:text-neutral-600 transition-colors"
          >
            <span>View All {data.label} Equipment</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.columns.map((column, colIdx) => {
            const IconComponent = ICON_MAP[column.icon] || Camera;
            return (
              <div key={colIdx} className="space-y-3">
                {/* Column Header */}
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800">
                    <IconComponent className="h-3.5 w-3.5" />
                  </div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-900">
                    {column.title}
                  </h4>
                </div>

                {/* Subcategory Links */}
                <ul className="space-y-1.5 pt-1">
                  {column.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="group flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-all"
                      >
                        <span className="font-medium group-hover:translate-x-0.5 transition-transform">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[9px] font-bold text-neutral-500 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Column View All Link */}
                <div className="pt-1">
                  <Link
                    href={column.viewAllHref}
                    onClick={onClose}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-400 hover:text-neutral-900 transition-colors pl-2.5"
                  >
                    <span>Browse all {column.title.toLowerCase()}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust Guarantee Strip */}
        <div className="mt-8 pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500 font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>
              All listings include independent inspection grading, escrow protection, and 7-day inspection return guarantees.
            </span>
          </div>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>PayHere Verified</span>
            <span>•</span>
            <span>COD Available</span>
            <span>•</span>
            <span>Sri Lanka Islandwide Tracked Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
}
