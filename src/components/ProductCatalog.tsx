'use client';

import React, { useState, useMemo } from 'react';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

interface ProductCatalogProps {
  initialProducts: Product[];
  initialCategory?: string;
  initialCondition?: string;
  initialSearch?: string;
  title?: string;
  description?: string;
  dealsOnly?: boolean;
  showCategoryFilter?: boolean;
}

const CATEGORY_ALIASES: Record<string, string[]> = {
  cameras: ['cameras', 'cameras-and-lenses'],
  'cameras-and-lenses': ['cameras', 'cameras-and-lenses'],
  audio: ['audio', 'audio-equipment'],
  'audio-equipment': ['audio', 'audio-equipment'],
  lighting: ['lighting', 'lighting-and-studio'],
  'lighting-and-studio': ['lighting', 'lighting-and-studio'],
  'video-production': ['video-production', 'studio-sets'],
  'studio-sets': ['video-production', 'studio-sets'],
  streaming: ['streaming', 'streaming-and-content'],
  'streaming-and-content': ['streaming', 'streaming-and-content'],
  accessories: ['accessories'],
};

const DEFAULT_CATEGORY_BRANDS: Record<string, { slug: string; name: string }[]> = {
  all: [
    { slug: 'aputure', name: 'Aputure' },
    { slug: 'blackmagic', name: 'Blackmagic Design' },
    { slug: 'canon', name: 'Canon' },
    { slug: 'dji', name: 'DJI' },
    { slug: 'red', name: 'RED' },
    { slug: 'rode', name: 'Røde' },
    { slug: 'sennheiser', name: 'Sennheiser' },
    { slug: 'sony', name: 'Sony' },
  ],
  cameras: [
    { slug: 'sony', name: 'Sony' },
    { slug: 'red', name: 'RED' },
    { slug: 'canon', name: 'Canon' },
    { slug: 'blackmagic', name: 'Blackmagic Design' },
  ],
  'cameras-and-lenses': [
    { slug: 'sony', name: 'Sony' },
    { slug: 'red', name: 'RED' },
    { slug: 'canon', name: 'Canon' },
    { slug: 'blackmagic', name: 'Blackmagic Design' },
  ],
  audio: [
    { slug: 'rode', name: 'Røde' },
    { slug: 'sennheiser', name: 'Sennheiser' },
    { slug: 'sony', name: 'Sony' },
  ],
  'audio-equipment': [
    { slug: 'rode', name: 'Røde' },
    { slug: 'sennheiser', name: 'Sennheiser' },
    { slug: 'sony', name: 'Sony' },
  ],
  lighting: [
    { slug: 'aputure', name: 'Aputure' },
    { slug: 'nanlite', name: 'Nanlite' },
    { slug: 'amaran', name: 'Amaran' },
    { slug: 'godox', name: 'Godox' },
  ],
  'lighting-and-studio': [
    { slug: 'aputure', name: 'Aputure' },
    { slug: 'nanlite', name: 'Nanlite' },
    { slug: 'amaran', name: 'Amaran' },
    { slug: 'godox', name: 'Godox' },
  ],
  'video-production': [
    { slug: 'dji', name: 'DJI' },
    { slug: 'tilta', name: 'Tilta' },
    { slug: 'smallhd', name: 'SmallHD' },
    { slug: 'sony', name: 'Sony' },
  ],
  'studio-sets': [
    { slug: 'dji', name: 'DJI' },
    { slug: 'tilta', name: 'Tilta' },
    { slug: 'smallhd', name: 'SmallHD' },
    { slug: 'sony', name: 'Sony' },
  ],
  streaming: [
    { slug: 'elgato', name: 'Elgato' },
    { slug: 'blackmagic', name: 'Blackmagic Design' },
    { slug: 'rode', name: 'Røde' },
    { slug: 'sony', name: 'Sony' },
  ],
  'streaming-and-content': [
    { slug: 'elgato', name: 'Elgato' },
    { slug: 'blackmagic', name: 'Blackmagic Design' },
    { slug: 'rode', name: 'Røde' },
    { slug: 'sony', name: 'Sony' },
  ],
  accessories: [
    { slug: 'sony', name: 'Sony' },
    { slug: 'canon', name: 'Canon' },
    { slug: 'dji', name: 'DJI' },
    { slug: 'sandisk', name: 'SanDisk' },
  ],
};

function matchesCategory(productSlug?: string, targetSlug?: string): boolean {
  if (!targetSlug || targetSlug === 'all') return true;
  if (!productSlug) return false;
  if (productSlug === targetSlug) return true;
  const list = CATEGORY_ALIASES[targetSlug] || [targetSlug];
  return list.includes(productSlug);
}

export default function ProductCatalog({
  initialProducts,
  initialCategory = 'all',
  initialCondition = 'all',
  initialSearch = '',
  title,
  description,
  dealsOnly = false,
  showCategoryFilter = true,
}: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedCondition, setSelectedCondition] = useState<string>(initialCondition);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(6000);
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [search, setSearch] = useState<string>(initialSearch);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state if props change
  React.useEffect(() => {
    setSelectedCategory(initialCategory);
    setSelectedCondition(initialCondition);
    setSearch(initialSearch);
  }, [initialCategory, initialCondition, initialSearch]);

  // Extract available brands - seeded with category defaults so Brand filter is always available
  const brands = useMemo(() => {
    const map = new Map<string, string>();
    const defaults = DEFAULT_CATEGORY_BRANDS[selectedCategory] || DEFAULT_CATEGORY_BRANDS.all;
    defaults.forEach(b => map.set(b.slug, b.name));

    initialProducts.forEach(p => {
      if (p.brand) {
        map.set(p.brand.slug, p.brand.name);
      }
    });

    return Array.from(map.entries())
      .map(([slug, name]) => ({ slug, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [initialProducts, selectedCategory]);

  // Faceted client filter
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (dealsOnly) {
      result = result.filter(p => p.compare_at_price && p.compare_at_price > p.price);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.brand?.name.toLowerCase().includes(q) ||
          p.category?.name.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter(p => matchesCategory(p.category?.slug, selectedCategory));
    }

    if (selectedCondition !== 'all') {
      result = result.filter(p => p.condition === selectedCondition);
    }

    if (selectedBrand !== 'all') {
      result = result.filter(p => p.brand?.slug === selectedBrand);
    }

    result = result.filter(p => p.price <= maxPrice);

    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return result;
  }, [initialProducts, search, selectedCategory, selectedCondition, selectedBrand, maxPrice, sortBy, dealsOnly]);

  const resetFilters = () => {
    setSelectedCategory(initialCategory);
    setSelectedCondition(initialCondition);
    setSelectedBrand('all');
    setMaxPrice(6000);
    setSortBy('recommended');
    setSearch('');
  };

  return (
    <div className="mx-auto max-w-[1760px] px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Filter Bar Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h2 className="text-xl font-black tracking-tight text-neutral-900">
            {title || 'EQUIPMENT MARKETPLACE'}
          </h2>
          <p className="text-xs text-neutral-500">
            {description ? (
              <span>{description} • Showing {filteredProducts.length} listings</span>
            ) : (
              <span>Showing {filteredProducts.length} verified listings</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-neutral-800 focus:outline-none focus:border-neutral-900"
            >
              <option value="recommended">Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest Additions</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start gap-7">
        {/* Left Filter Sidebar matching PDF Page 14 */}
        <aside
          className={`${
            mobileFilterOpen ? 'block' : 'hidden'
          } md:block w-full md:w-60 lg:w-64 shrink-0 space-y-6 rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs h-fit md:sticky md:top-20`}
        >
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Filter Gear
            </h3>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-500 hover:text-neutral-900"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Category Filter */}
          {showCategoryFilter && (
            <div>
              <label className="mb-2 block text-xs font-bold text-neutral-800">
                Category
              </label>
              <div className="space-y-1.5 text-xs text-neutral-600">
                {[
                  { label: 'All Categories', value: 'all' },
                  { label: 'Cameras & Lenses', value: 'cameras' },
                  { label: 'Audio Equipment', value: 'audio' },
                  { label: 'Lighting & Studio', value: 'lighting' },
                  { label: 'Video Production', value: 'video-production' },
                  { label: 'Streaming & Gear', value: 'streaming' },
                  { label: 'Accessories', value: 'accessories' },
                ].map(cat => (
                  <label key={cat.value} className="flex items-center gap-2 cursor-pointer hover:text-neutral-900">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat.value}
                      onChange={() => setSelectedCategory(cat.value)}
                      className="accent-neutral-900"
                    />
                    <span>{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Condition Filter */}
          <div className={showCategoryFilter ? "border-t border-neutral-100 pt-4" : ""}>
            <label className="mb-2 block text-xs font-bold text-neutral-800">
              Equipment Condition
            </label>
            <div className="space-y-1.5 text-xs text-neutral-600">
              {[
                { label: 'Any Condition', value: 'all' },
                { label: 'Brand New', value: 'new' },
                { label: 'Used / Pre-Owned', value: 'used' },
                { label: 'Certified Refurbished', value: 'refurbished' },
              ].map(cond => (
                <label key={cond.value} className="flex items-center gap-2 cursor-pointer hover:text-neutral-900">
                  <input
                    type="radio"
                    name="condition"
                    checked={selectedCondition === cond.value}
                    onChange={() => setSelectedCondition(cond.value)}
                    className="accent-neutral-900"
                  />
                  <span>{cond.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand Filter (Radio Options) */}
          <div className="border-t border-neutral-100 pt-4">
            <label className="mb-2 block text-xs font-bold text-neutral-800">
              Brand
            </label>
            <div className="space-y-1.5 text-xs text-neutral-600">
              <label className="flex items-center gap-2 cursor-pointer hover:text-neutral-900">
                <input
                  type="radio"
                  name="brand"
                  checked={selectedBrand === 'all'}
                  onChange={() => setSelectedBrand('all')}
                  className="accent-neutral-900"
                />
                <span>All Brands</span>
              </label>
              {brands.map(b => (
                <label key={b.slug} className="flex items-center gap-2 cursor-pointer hover:text-neutral-900">
                  <input
                    type="radio"
                    name="brand"
                    checked={selectedBrand === b.slug}
                    onChange={() => setSelectedBrand(b.slug)}
                    className="accent-neutral-900"
                  />
                  <span>{b.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="border-t border-neutral-100 pt-4">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-800 mb-2">
              <span>Maximum Price</span>
              <span className="text-neutral-900 font-mono">LKR {maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={100}
              max={6000}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-neutral-900 cursor-pointer"
            />
            <div className="mt-1 flex justify-between text-[10px] text-neutral-400">
              <span>LKR 100</span>
              <span>LKR 6,000+</span>
            </div>
          </div>
        </aside>

        {/* Right Product Grid */}
        <div className="flex-1 min-w-0 w-full">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center">
              <p className="text-sm font-semibold text-neutral-800">
                No equipment matches your current filters.
              </p>
              <p className="mt-1 text-xs text-neutral-400">
                Try widening your price range or clearing selected categories.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 rounded-full bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
