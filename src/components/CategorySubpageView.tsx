'use client';

import React, { useState, useEffect, useMemo, useTransition } from 'react';
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
  PackageOpen,
} from 'lucide-react';
import { Product } from '@/types';
import { CATEGORY_DROPDOWN_DATA, CategoryDropdownItem } from '@/data/navigation-categories';
import { matchProductToSubpage } from '@/lib/category-subpages';
import ProductCatalog from './ProductCatalog';

interface CategorySubpageViewProps {
  categorySlug: string;
  canonicalSlug: string;
  categoryName: string;
  categoryTagline: string;
  initialSubId?: string;
  allProducts: Product[];
  initialCondition?: string;
  initialSearch?: string;
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

export default function CategorySubpageView({
  categorySlug,
  canonicalSlug,
  categoryName,
  categoryTagline,
  initialSubId,
  allProducts,
  initialCondition,
  initialSearch,
}: CategorySubpageViewProps) {
  const [, startTransition] = useTransition();

  // Resolve subcategories data from category slug or canonical slug
  const categoryData =
    CATEGORY_DROPDOWN_DATA[categorySlug] ||
    CATEGORY_DROPDOWN_DATA[canonicalSlug] || {
      id: categorySlug,
      label: categoryName,
      href: `/category/${categorySlug}`,
      viewAllLabel: `All ${categoryName}`,
      items: [] as CategoryDropdownItem[],
    };

  const subcategories = categoryData.items || [];
  const defaultSubId = subcategories[0]?.id || '';

  // Active subpage state (defaults to 1st subpage, e.g. Photography for Cameras)
  const [activeSubId, setActiveSubId] = useState<string>(() => {
    if (initialSubId && subcategories.some((d) => d.id.toLowerCase() === initialSubId.toLowerCase())) {
      return initialSubId.toLowerCase();
    }
    return defaultSubId;
  });

  // Keep state in sync with browser Back / Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const sub = params.get('sub')?.toLowerCase();
      if (sub && subcategories.some((d) => d.id.toLowerCase() === sub)) {
        setActiveSubId(sub);
      } else if (defaultSubId) {
        setActiveSubId(defaultSubId);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [subcategories, defaultSubId]);

  // If initial URL had no ?sub=, synchronize URL to reflect the default active subpage
  useEffect(() => {
    if (typeof window !== 'undefined' && defaultSubId) {
      const params = new URLSearchParams(window.location.search);
      if (!params.get('sub')) {
        params.set('sub', defaultSubId);
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({ subId: defaultSubId }, '', newUrl);
      }
    }
  }, [defaultSubId]);

  // Handle client-side DOM routing between subpages
  const handleSubpageChange = (subId: string) => {
    if (subId.toLowerCase() === activeSubId.toLowerCase()) return;

    startTransition(() => {
      setActiveSubId(subId);
    });

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      params.set('sub', subId);
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.pushState({ subId }, '', newUrl);
    }
  };

  // Find active subcategory definition
  const activeSubcategory =
    subcategories.find((d) => d.id.toLowerCase() === activeSubId.toLowerCase()) ||
    subcategories[0];

  // Filter products for the active subpage
  const subpageProducts = useMemo(() => {
    if (!activeSubcategory) return allProducts;
    return allProducts.filter((p) => matchProductToSubpage(activeSubcategory.id, p));
  }, [allProducts, activeSubcategory]);

  return (
    <div>
      {/* Subcategories Navigation Section (DOM Router) */}
      <section className="border-b border-[#00203F]/15 bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center gap-2 mb-6">
            <span className="h-4 w-1 bg-[#36ECDE]" />
            <h2 className="text-xs font-black uppercase tracking-wider text-[#00203F]">
              Explore {categoryName}
            </h2>
            <span className="text-[11px] font-semibold text-[#2F2F2F]/50 hidden sm:inline">
              • Select a subcategory to browse gear
            </span>
          </div>

          {/* Subpages Grid / DOM Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" role="tablist">
            {subcategories.map((item) => {
              const IconComponent = ICON_MAP[item.icon] || Camera;
              const isActive = activeSubcategory && item.id.toLowerCase() === activeSubcategory.id.toLowerCase();

              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleSubpageChange(item.id)}
                  role="tab"
                  aria-selected={isActive}
                  className={`group relative flex items-center justify-between p-4 border text-left transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'border-[#00203F] bg-[#00203F] text-white shadow-md ring-1 ring-[#36ECDE]/40'
                      : 'border-[#00203F]/15 bg-white text-[#2F2F2F] hover:border-[#00203F] hover:bg-[#E6E9EC]/50 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`flex h-11 w-11 items-center justify-center shrink-0 transition-all ${
                        isActive
                          ? 'bg-[#36ECDE] text-[#00203F] shadow-xs'
                          : 'bg-[#E6E9EC] text-[#00203F] group-hover:bg-[#00203F] group-hover:text-[#36ECDE]'
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-black uppercase tracking-wide truncate ${
                            isActive ? 'text-white' : 'text-[#00203F]'
                          }`}
                        >
                          {item.title}
                        </span>
                        {isActive && (
                          <span className="bg-[#36ECDE] text-[#00203F] text-[9px] font-black uppercase px-1.5 py-0.2 tracking-wider shrink-0">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-[11px] truncate mt-0.5 ${
                          isActive ? 'text-white/80' : 'text-[#2F2F2F]/70'
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center shrink-0 ml-2">
                    <ChevronRight
                      className={`h-4 w-4 transition-all duration-200 ${
                        isActive
                          ? 'text-[#36ECDE] translate-x-1'
                          : 'text-[#2F2F2F]/30 group-hover:text-[#00203F] group-hover:translate-x-1'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Catalog Grid for Active Subpage */}
      {subpageProducts.length === 0 ? (
        <div className="mx-auto max-w-[1760px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center border border-dashed border-[#00203F]/25 bg-white p-12 text-center shadow-xs">
            <div className="flex h-14 w-14 items-center justify-center bg-[#E6E9EC] text-[#00203F] mb-4">
              <PackageOpen className="h-7 w-7 text-[#00203F]" />
            </div>
            <h3 className="text-base font-black uppercase tracking-wide text-[#00203F]">
              No Listings in {activeSubcategory?.title || 'This Category'} Currently
            </h3>
            <p className="mt-2 text-xs text-[#2F2F2F]/70 max-w-md">
              There are no verified equipment listings currently active in this specialized subcategory.
              Browse other categories above or list your gear now.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {subcategories
                .filter((d) => d.id !== activeSubcategory?.id)
                .slice(0, 3)
                .map((d) => (
                  <button
                    key={d.id}
                    onClick={() => handleSubpageChange(d.id)}
                    className="border border-[#00203F]/30 bg-[#E6E9EC] px-3.5 py-1.5 text-xs font-bold text-[#00203F] hover:bg-[#00203F] hover:text-[#36ECDE] transition-colors"
                  >
                    View {d.title}
                  </button>
                ))}
            </div>
          </div>
        </div>
      ) : (
        <ProductCatalog
          key={`${canonicalSlug}-${activeSubcategory?.id || 'all'}`}
          initialProducts={subpageProducts}
          initialCategory={canonicalSlug}
          initialCondition={initialCondition || 'all'}
          initialSearch={initialSearch || ''}
          title={`${categoryName.toUpperCase()} — ${activeSubcategory?.title.toUpperCase() || 'CATALOG'}`}
          description={activeSubcategory?.description || categoryTagline}
          showCategoryFilter={false}
        />
      )}
    </div>
  );
}
