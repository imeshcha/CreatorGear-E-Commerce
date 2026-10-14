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
    <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 border border-[#00203F]/20 bg-white p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
      <div className="space-y-1">
        {data.items.map((item, idx) => {
          const IconComponent = ICON_MAP[item.icon] || Camera;
          return (
            <Link
              key={idx}
              href={item.href}
              onClick={onClose}
              className="group flex items-center justify-between p-2.5 hover:bg-[#E6E9EC] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center bg-[#E6E9EC] text-[#00203F] group-hover:bg-[#36ECDE] group-hover:text-[#00203F] transition-all shrink-0">
                  <IconComponent className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#00203F] transition-colors">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-[#2F2F2F]/70 line-clamp-1">
                    {item.description}
                  </div>
                </div>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-[#2F2F2F]/40 group-hover:text-[#00203F] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
