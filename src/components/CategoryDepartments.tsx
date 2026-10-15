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
  FilterX,
} from 'lucide-react';
import { CATEGORY_DROPDOWN_DATA } from '@/data/navigation-categories';

interface CategoryDepartmentsProps {
  categorySlug: string;
  categoryName: string;
  activeSearch?: string;
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

export default function CategoryDepartments({
  categorySlug,
  categoryName,
  activeSearch,
}: CategoryDepartmentsProps) {
  const data = CATEGORY_DROPDOWN_DATA[categorySlug];
  if (!data || !data.items || data.items.length === 0) return null;

  return (
    <section className="border-b border-[#00203F]/15 bg-white py-8 sm:py-10">
      <div className="mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="h-4 w-1 bg-[#36ECDE]" />
            <h2 className="text-xs font-black uppercase tracking-wider text-[#00203F]">
              Explore {categoryName} Departments
            </h2>
            <span className="text-[11px] font-semibold text-[#2F2F2F]/50 hidden sm:inline">
              • Specialized gear subcategories
            </span>
          </div>

          {activeSearch && (
            <Link
              href={`/category/${categorySlug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00203F] hover:text-[#36ECDE] bg-[#E6E9EC] px-3 py-1.5 border border-[#00203F]/15 transition-all self-start sm:self-auto"
            >
              <FilterX className="h-3.5 w-3.5" />
              <span>Clear Department Filter ({activeSearch})</span>
            </Link>
          )}
        </div>

        {/* Subcategories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.items.map((item, idx) => {
            const IconComponent = ICON_MAP[item.icon] || Camera;
            // Check if this subcategory's search query matches activeSearch
            const isFilterActive =
              activeSearch &&
              item.href.toLowerCase().includes(`search=${activeSearch.toLowerCase()}`);

            return (
              <Link
                key={idx}
                href={item.href}
                className={`group relative flex items-center justify-between p-4 border transition-all duration-200 ${
                  isFilterActive
                    ? 'border-[#00203F] bg-[#36ECDE]/15 shadow-sm ring-1 ring-[#00203F]'
                    : 'border-[#00203F]/15 bg-white hover:border-[#00203F] hover:bg-[#E6E9EC]/40 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`flex h-11 w-11 items-center justify-center shrink-0 transition-all ${
                      isFilterActive
                        ? 'bg-[#00203F] text-[#36ECDE]'
                        : 'bg-[#E6E9EC] text-[#00203F] group-hover:bg-[#00203F] group-hover:text-[#36ECDE]'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black uppercase tracking-wide text-[#00203F] truncate">
                        {item.title}
                      </span>
                      {isFilterActive && (
                        <span className="h-1.5 w-1.5 bg-[#00203F] shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#2F2F2F]/70 truncate mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center shrink-0 ml-2">
                  <ChevronRight
                    className={`h-4 w-4 transition-all duration-200 ${
                      isFilterActive
                        ? 'text-[#00203F] translate-x-0.5'
                        : 'text-[#2F2F2F]/30 group-hover:text-[#00203F] group-hover:translate-x-1'
                    }`}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
