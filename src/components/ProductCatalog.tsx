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
    { slug: 'amaran', name: 'Amaran' },
    { slug: 'aputure', name: 'Aputure' },
    { slug: 'atomos', name: 'Atomos' },
    { slug: 'audio-technica', name: 'Audio-Technica' },
    { slug: 'blackmagic', name: 'Blackmagic Design' },
    { slug: 'boya', name: 'Boya' },
    { slug: 'canon', name: 'Canon' },
    { slug: 'dji', name: 'DJI' },
    { slug: 'elgato', name: 'Elgato' },
    { slug: 'feelworld', name: 'Feelworld' },
    { slug: 'fujifilm', name: 'Fujifilm' },
    { slug: 'godox', name: 'Godox' },
    { slug: 'hollyland', name: 'Hollyland' },
    { slug: 'kf-concept', name: 'K&F Concept' },
    { slug: 'nanlite', name: 'Nanlite' },
    { slug: 'nikon', name: 'Nikon' },
    { slug: 'panasonic', name: 'Panasonic Lumix' },
    { slug: 'red', name: 'RED' },
    { slug: 'rode', name: 'Røde' },
    { slug: 'sandisk', name: 'SanDisk' },
    { slug: 'saramonic', name: 'Saramonic' },
    { slug: 'sennheiser', name: 'Sennheiser' },
    { slug: 'shure', name: 'Shure' },
    { slug: 'sigma', name: 'Sigma' },
    { slug: 'smallrig', name: 'SmallRig' },
    { slug: 'sony', name: 'Sony' },
    { slug: 'tamron', name: 'Tamron' },
    { slug: 'tilta', name: 'Tilta' },
    { slug: 'zhiyun', name: 'Zhiyun-Tech' },
    { slug: 'zoom', name: 'Zoom' },
  ],
  cameras: [
    { slug: 'sony', name: 'Sony' },
    { slug: 'canon', name: 'Canon' },
    { slug: 'nikon', name: 'Nikon' },
    { slug: 'fujifilm', name: 'Fujifilm' },
    { slug: 'panasonic', name: 'Panasonic Lumix' },
    { slug: 'blackmagic', name: 'Blackmagic Design' },
    { slug: 'red', name: 'RED' },
    { slug: 'sigma', name: 'Sigma' },
    { slug: 'tamron', name: 'Tamron' },
  ],
  'cameras-and-lenses': [
    { slug: 'sony', name: 'Sony' },
    { slug: 'canon', name: 'Canon' },
    { slug: 'nikon', name: 'Nikon' },
    { slug: 'fujifilm', name: 'Fujifilm' },
    { slug: 'panasonic', name: 'Panasonic Lumix' },
    { slug: 'blackmagic', name: 'Blackmagic Design' },
    { slug: 'red', name: 'RED' },
    { slug: 'sigma', name: 'Sigma' },
    { slug: 'tamron', name: 'Tamron' },
  ],
  audio: [
    { slug: 'rode', name: 'Røde' },
    { slug: 'dji', name: 'DJI' },
    { slug: 'hollyland', name: 'Hollyland' },
    { slug: 'boya', name: 'Boya' },
    { slug: 'saramonic', name: 'Saramonic' },
    { slug: 'sennheiser', name: 'Sennheiser' },
    { slug: 'shure', name: 'Shure' },
    { slug: 'sony', name: 'Sony' },
    { slug: 'zoom', name: 'Zoom' },
    { slug: 'audio-technica', name: 'Audio-Technica' },
  ],
  'audio-equipment': [
    { slug: 'rode', name: 'Røde' },
    { slug: 'dji', name: 'DJI' },
    { slug: 'hollyland', name: 'Hollyland' },
    { slug: 'boya', name: 'Boya' },
    { slug: 'saramonic', name: 'Saramonic' },
    { slug: 'sennheiser', name: 'Sennheiser' },
    { slug: 'shure', name: 'Shure' },
    { slug: 'sony', name: 'Sony' },
    { slug: 'zoom', name: 'Zoom' },
    { slug: 'audio-technica', name: 'Audio-Technica' },
  ],
  lighting: [
    { slug: 'godox', name: 'Godox' },
    { slug: 'aputure', name: 'Aputure' },
    { slug: 'nanlite', name: 'Nanlite' },
    { slug: 'amaran', name: 'Amaran' },
    { slug: 'smallrig', name: 'SmallRig' },
  ],
  'lighting-and-studio': [
    { slug: 'godox', name: 'Godox' },
    { slug: 'aputure', name: 'Aputure' },
    { slug: 'nanlite', name: 'Nanlite' },
    { slug: 'amaran', name: 'Amaran' },
    { slug: 'smallrig', name: 'SmallRig' },
  ],
  'video-production': [
    { slug: 'dji', name: 'DJI' },
    { slug: 'zhiyun', name: 'Zhiyun-Tech' },
    { slug: 'smallrig', name: 'SmallRig' },
    { slug: 'tilta', name: 'Tilta' },
    { slug: 'feelworld', name: 'Feelworld' },
    { slug: 'atomos', name: 'Atomos' },
    { slug: 'hollyland', name: 'Hollyland' },
  ],
  'studio-sets': [
    { slug: 'dji', name: 'DJI' },
    { slug: 'zhiyun', name: 'Zhiyun-Tech' },
    { slug: 'smallrig', name: 'SmallRig' },
    { slug: 'tilta', name: 'Tilta' },
    { slug: 'feelworld', name: 'Feelworld' },
    { slug: 'atomos', name: 'Atomos' },
    { slug: 'hollyland', name: 'Hollyland' },
  ],
  streaming: [
    { slug: 'elgato', name: 'Elgato' },
    { slug: 'blackmagic', name: 'Blackmagic Design' },
    { slug: 'hollyland', name: 'Hollyland' },
    { slug: 'rode', name: 'Røde' },
    { slug: 'boya', name: 'Boya' },
    { slug: 'shure', name: 'Shure' },
    { slug: 'sony', name: 'Sony' },
  ],
  'streaming-and-content': [
    { slug: 'elgato', name: 'Elgato' },
    { slug: 'blackmagic', name: 'Blackmagic Design' },
    { slug: 'hollyland', name: 'Hollyland' },
    { slug: 'rode', name: 'Røde' },
    { slug: 'boya', name: 'Boya' },
    { slug: 'shure', name: 'Shure' },
    { slug: 'sony', name: 'Sony' },
  ],
  accessories: [
    { slug: 'smallrig', name: 'SmallRig' },
    { slug: 'kf-concept', name: 'K&F Concept' },
    { slug: 'sandisk', name: 'SanDisk' },
    { slug: 'sony', name: 'Sony' },
    { slug: 'canon', name: 'Canon' },
    { slug: 'dji', name: 'DJI' },
    { slug: 'tilta', name: 'Tilta' },
    { slug: 'godox', name: 'Godox' },
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
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#00203F]/15 pb-4">
        <div>
          <h2 className="text-xl font-black tracking-tight text-[#00203F]">
            {title || 'EQUIPMENT MARKETPLACE'}
          </h2>
          <p className="text-xs text-[#2F2F2F]/70">
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
            className="md:hidden inline-flex items-center gap-1.5 border border-[#00203F]/20 bg-white px-3 py-1.5 text-xs font-semibold text-[#00203F]"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#2F2F2F]/70 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-[#00203F]/20 bg-white px-2.5 py-1.5 text-xs font-semibold text-[#00203F] focus:outline-none focus:border-[#00203F]"
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
          className={`${ mobileFilterOpen ?'block' : 'hidden'
          } md:block w-full md:w-60 lg:w-64 shrink-0 space-y-6 border border-[#00203F]/15 bg-white p-5 shadow-xs h-fit md:sticky md:top-20`}
        >
          <div className="flex items-center justify-between border-b border-[#00203F]/10 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#00203F]">
              Filter Gear
            </h3>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2F2F2F]/60 hover:text-[#00203F]"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Category Filter */}
          {showCategoryFilter && (
            <div>
              <label className="mb-2 block text-xs font-bold text-[#00203F]">
                Category
              </label>
              <div className="space-y-1.5 text-xs text-[#2F2F2F]">
                {[
                  { label: 'All Categories', value: 'all' },
                  { label: 'Cameras & Lenses', value: 'cameras' },
                  { label: 'Audio Equipment', value: 'audio' },
                  { label: 'Lighting & Studio', value: 'lighting' },
                  { label: 'Video Production', value: 'video-production' },
                  { label: 'Streaming & Gear', value: 'streaming' },
                  { label: 'Accessories', value: 'accessories' },
                ].map(cat => (
                  <label key={cat.value} className="flex items-center gap-2 cursor-pointer hover:text-[#00203F]">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat.value}
                      onChange={() => setSelectedCategory(cat.value)}
                      className="accent-[#00203F]"
                    />
                    <span>{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Condition Filter */}
          <div className={showCategoryFilter ? "border-t border-[#00203F]/10 pt-4" : ""}>
            <label className="mb-2 block text-xs font-bold text-[#00203F]">
              Equipment Condition
            </label>
            <div className="space-y-1.5 text-xs text-[#2F2F2F]">
              {[
                { label: 'Any Condition', value: 'all' },
                { label: 'Brand New', value: 'new' },
                { label: 'Used / Pre-Owned', value: 'used' },
                { label: 'Certified Refurbished', value: 'refurbished' },
              ].map(cond => (
                <label key={cond.value} className="flex items-center gap-2 cursor-pointer hover:text-[#00203F]">
                  <input
                    type="radio"
                    name="condition"
                    checked={selectedCondition === cond.value}
                    onChange={() => setSelectedCondition(cond.value)}
                    className="accent-[#00203F]"
                  />
                  <span>{cond.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand Filter (Radio Options) */}
          <div className="border-t border-[#00203F]/10 pt-4">
            <label className="mb-2 block text-xs font-bold text-[#00203F]">
              Brand
            </label>
            <div className="space-y-1.5 text-xs text-[#2F2F2F] max-h-64 overflow-y-auto pr-1">
              <label className="flex items-center gap-2 cursor-pointer hover:text-[#00203F]">
                <input
                  type="radio"
                  name="brand"
                  checked={selectedBrand === 'all'}
                  onChange={() => setSelectedBrand('all')}
                  className="accent-[#00203F]"
                />
                <span>All Brands</span>
              </label>
              {brands.map(b => (
                <label key={b.slug} className="flex items-center gap-2 cursor-pointer hover:text-[#00203F]">
                  <input
                    type="radio"
                    name="brand"
                    checked={selectedBrand === b.slug}
                    onChange={() => setSelectedBrand(b.slug)}
                    className="accent-[#00203F]"
                  />
                  <span>{b.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="border-t border-[#00203F]/10 pt-4">
            <div className="flex items-center justify-between text-xs font-bold text-[#00203F] mb-2">
              <span>Maximum Price</span>
              <span className="text-[#00203F] font-mono">LKR {maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={100}
              max={6000}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#00203F] cursor-pointer"
            />
            <div className="mt-1 flex justify-between text-[10px] text-[#2F2F2F]/60">
              <span>LKR 100</span>
              <span>LKR 6,000+</span>
            </div>
          </div>
        </aside>

        {/* Right Product Grid */}
        <div className="flex-1 min-w-0 w-full">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center border border-dashed border-[#00203F]/20 bg-white p-12 text-center">
              <p className="text-sm font-semibold text-[#00203F]">
                No equipment matches your current filters.
              </p>
              <p className="mt-1 text-xs text-[#2F2F2F]/60">
                Try widening your price range or clearing selected categories.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 bg-[#00203F] px-4 py-2 text-xs font-bold text-white hover:bg-[#36ECDE] hover:text-[#00203F] transition"
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
