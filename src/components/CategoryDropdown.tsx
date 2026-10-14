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
  ChevronRight,
} from 'lucide-react';
import { NavigationCategory } from '@/data/navigation-categories';

interface CategoryDropdownProps {
  data: NavigationCategory;
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

export default function CategoryDropdown({ data, isOpen, onClose }: CategoryDropdownProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 rounded-2xl border border-neutral-200/90 bg-white p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
      <div className="space-y-1">
        {data.items.map((item, idx) => {
          const IconComponent = ICON_MAP[item.icon] || Camera;
          return (
            <Link
              key={idx}
              href={item.href}
              onClick={onClose}
              className="group flex items-center justify-between rounded-xl p-2.5 hover:bg-neutral-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800 group-hover:bg-white group-hover:shadow-xs transition-all shrink-0">
                  <IconComponent className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-900 group-hover:text-neutral-900 transition-colors">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-neutral-500 line-clamp-1">
                    {item.description}
                  </div>
                </div>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
