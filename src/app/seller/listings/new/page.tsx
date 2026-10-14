'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { uploadProductImage } from '@/lib/supabase/storage';
import { INITIAL_CATEGORIES, INITIAL_BRANDS } from '@/data/initial-products';
import {
  Upload,
  Camera,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Loader2,
  ShieldCheck,
  ArrowLeft,
  DollarSign,
  Package,
} from 'lucide-react';
import Link from 'next/link';

export default function NewListingPage() {
  const router = useRouter();
  const { authUser, sellerProfile, loading: authLoading } = useAuth();

  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [brands, setBrands] = useState(INITIAL_BRANDS);

  // Form State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(INITIAL_CATEGORIES[0]?.id || '');
  const [brandId, setBrandId] = useState(INITIAL_BRANDS[0]?.id || '');
  const [price, setPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [condition, setCondition] = useState<'new' | 'used' | 'refurbished'>('used');
  const [conditionGrade, setConditionGrade] = useState<'like_new' | 'excellent' | 'good' | 'fair'>('excellent');
  const [usageDetails, setUsageDetails] = useState('');
  const [knownDefects, setKnownDefects] = useState('');
  const [includedAccessories, setIncludedAccessories] = useState('');
  const [warrantyDetails, setWarrantyDetails] = useState('30-Day Seller Warranty & Inspection Guarantee');
  const [warrantyProvider, setWarrantyProvider] = useState<'seller' | 'manufacturer' | 'none'>('seller');
  const [stockQuantity, setStockQuantity] = useState('1');
  const [returnPolicyDays, setReturnPolicyDays] = useState('7');
  const [description, setDescription] = useState('');

  // Attributes state
  const [attributes, setAttributes] = useState<{ name: string; value: string }[]>([
    { name: 'Lens Mount', value: 'Sony E-Mount' },
    { name: 'Sensor Format', value: 'Full-Frame (35.6 x 23.8 mm)' },
  ]);

  // Image files state
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const supabase = createClient();

  // Load categories and brands from Supabase if available
  useEffect(() => {
    async function fetchTaxonomy() {
      try {
        const { data: dbCats } = await supabase.from('categories').select('*').order('sort_order');
        if (dbCats && dbCats.length > 0) setCategories(dbCats);

        const { data: dbBrands } = await supabase.from('brands').select('*').order('name');
        if (dbBrands && dbBrands.length > 0) setBrands(dbBrands);
      } catch (err) {
        // Fallback to initial
      }
    }
    fetchTaxonomy();
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    // Check total count
    if (imageFiles.length + files.length > 8) {
      setErrorMsg('You can upload a maximum of 8 product photos.');
      return;
    }

    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);

    // Generate local previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
    setErrorMsg('');
  };

  const removeImage = (index: number) => {
    const updatedFiles = [...imageFiles];
    updatedFiles.splice(index, 1);
    setImageFiles(updatedFiles);

    const updatedPreviews = [...imagePreviews];
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);
  };

  const addAttribute = () => {
    setAttributes([...attributes, { name: '', value: '' }]);
  };

  const updateAttribute = (index: number, field: 'name' | 'value', val: string) => {
    const next = [...attributes];
    next[index][field] = val;
    setAttributes(next);
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser) {
      setErrorMsg('Please sign in to publish a gear listing.');
      return;
    }
    if (!name.trim()) {
      setErrorMsg('Please enter a product title.');
      return;
    }
    if (!price || Number(price) <= 0) {
      setErrorMsg('Please enter a valid listing price.');
      return;
    }

    setUploading(true);
    setErrorMsg('');

    try {
      // 1. Generate unique slug and SKU
      const slugBase = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      const uniqueSuffix = Math.random().toString(36).substring(2, 7);
      const slug = `${slugBase}-${uniqueSuffix}`;
      const sku = `GEAR-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;

      // 2. Insert product record into public.products
      const { data: newProd, error: prodErr } = await supabase
        .from('products')
        .insert({
          seller_id: authUser.id,
          name: name.trim(),
          slug,
          sku,
          description: description.trim() || `${name} in ${condition} condition.`,
          category_id: categoryId,
          brand_id: brandId || null,
          price: Number(price),
          compare_at_price: compareAtPrice ? Number(compareAtPrice) : null,
          currency: 'LKR',
          condition,
          condition_grade: condition === 'new' ? null : conditionGrade,
          usage_details: condition === 'new' ? 'Brand new factory sealed.' : usageDetails,
          known_defects: condition === 'new' ? 'None (Factory Sealed)' : (knownDefects || 'None'),
          included_accessories: includedAccessories || 'Standard accessories included.',
          warranty_details: warrantyDetails,
          warranty_provider: warrantyProvider,
          stock_quantity: Math.max(1, parseInt(stockQuantity) || 1),
          status: 'active',
          return_policy_days: parseInt(returnPolicyDays) || 7,
        })
        .select()
        .single();

      if (prodErr) {
        throw new Error(prodErr.message);
      }

      const createdProductId = newProd.id;

      // 3. Upload images to Supabase Storage and link in public.product_images
      if (imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          const uploadRes = await uploadProductImage(file, createdProductId);

          if (uploadRes.url) {
            await supabase.from('product_images').insert({
              product_id: createdProductId,
              storage_path: uploadRes.url,
              alt_text: `${name} view ${i + 1}`,
              sort_order: i,
              is_primary: i === 0,
            });
          }
        }
      }

      // 4. Save custom attributes into public.product_attributes
      const validAttrs = attributes.filter(a => a.name.trim() && a.value.trim());
      if (validAttrs.length > 0) {
        await supabase.from('product_attributes').insert(
          validAttrs.map(a => ({
            product_id: createdProductId,
            attribute_name: a.name.trim(),
            attribute_value: a.value.trim(),
          }))
        );
      }

      setSuccessMsg('Your gear listing has been published to the marketplace!');
      setTimeout(() => {
        router.push(`/product/${slug}`);
      }, 1500);
    } catch (err: any) {
      console.error('Failed to create listing:', err);
      setErrorMsg(err.message || 'Failed to save product listing to database.');
    } finally {
      setUploading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F4F4F4]">
        <Navbar />
        <div className="py-24 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-neutral-400" />
          <p className="mt-3 text-xs text-neutral-500">Checking seller credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Seller Account</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-neutral-900">
            LIST YOUR CREATOR EQUIPMENT
          </h1>
          <p className="mt-1.5 text-xs text-neutral-500">
            Upload photos directly to Supabase Storage and publish specs to the verified gear catalog.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-700 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Media Storage Upload */}
          <div className="border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                1. Equipment Photos (Supabase Media Storage)
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Upload clear high-resolution photos of your gear, including mount, LCD, and any cosmetic marks. First photo is primary.
              </p>
            </div>

            {/* Upload Zone */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 bg-neutral-50/60 p-8 text-center cursor-pointer hover:border-neutral-900 hover:bg-neutral-50 transition">
              <Upload className="h-8 w-8 text-neutral-400 mb-2" />
              <span className="text-xs font-bold text-neutral-800">
                Click to browse gear images or drag & drop
              </span>
              <span className="text-[10px] text-neutral-400 mt-1">
                JPG, PNG, WebP up to 10MB each (Maximum 8 photos)
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>

            {/* Preview Grid */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {imagePreviews.map((preview, idx) => (
                  <div key={idx} className="relative group overflow-hidden border border-neutral-200 bg-neutral-100 aspect-square">
                    <img
                      src={preview}
                      alt={`Upload preview ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {idx === 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-neutral-900 text-white text-[9px] font-bold px-2 py-0.5">
                        Primary Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1.5 right-1.5 bg-white/90 p-1 text-red-600 shadow hover:bg-red-600 hover:text-white transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Core Details */}
          <div className="border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
              2. Gear Identification & Pricing
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sony FX3 Cinema Line Full-Frame Camera Body"
                  className="w-full border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:bg-white focus:border-neutral-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:bg-white focus:border-neutral-900"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Brand Manufacturer *
                  </label>
                  <select
                    value={brandId}
                    onChange={(e) => setBrandId(e.target.value)}
                    className="w-full border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:bg-white focus:border-neutral-900"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Listing Price (LKR) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-[11px] text-neutral-400 font-bold font-mono">LKR</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="350000.00"
                      className="w-full border border-neutral-200 bg-neutral-50 pl-11 pr-3 py-2.5 text-xs font-mono font-bold text-neutral-900 focus:outline-none focus:bg-white focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Compare Retail Price (LKR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-[11px] text-neutral-400 font-bold font-mono">LKR</span>
                    <input
                      type="number"
                      step="0.01"
                      value={compareAtPrice}
                      onChange={(e) => setCompareAtPrice(e.target.value)}
                      placeholder="390000.00"
                      className="w-full border border-neutral-200 bg-neutral-50 pl-11 pr-3 py-2.5 text-xs font-mono text-neutral-900 focus:outline-none focus:bg-white focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Available Stock
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    className="w-full border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-xs font-mono text-neutral-900 focus:outline-none focus:bg-white focus:border-neutral-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Condition & Disclosures */}
          <div className="border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
              3. Condition Grade & Disclosures
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {(['new', 'used', 'refurbished'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCondition(c)}
                  className={`py-3 border text-xs font-bold uppercase tracking-wider transition ${ condition === c ?'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  {c === 'new' ? 'Brand New' : c}
                </button>
              ))}
            </div>

            {condition !== 'new' && (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Condition Grade
                  </label>
                  <select
                    value={conditionGrade}
                    onChange={(e: any) => setConditionGrade(e.target.value)}
                    className="w-full border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:bg-white focus:border-neutral-900"
                  >
                    <option value="like_new">Like New (Mint, zero cosmetic marks)</option>
                    <option value="excellent">Excellent (Light signs of studio use, immaculate optics)</option>
                    <option value="good">Good (Normal creator wear, fully functional)</option>
                    <option value="fair">Fair (Noticeable cosmetic marks, mechanically sound)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Operating History & Shutter Actuations
                  </label>
                  <input
                    type="text"
                    value={usageDetails}
                    onChange={(e) => setUsageDetails(e.target.value)}
                    placeholder="e.g. Shutter count: 4,120 actuations. Sensor and sensor glass pristine."
                    className="w-full border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:bg-white focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Known Defects or Wear Marks
                  </label>
                  <input
                    type="text"
                    value={knownDefects}
                    onChange={(e) => setKnownDefects(e.target.value)}
                    placeholder="e.g. Slight paint rub on tripod mount plate area; no scratches on glass."
                    className="w-full border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:bg-white focus:border-neutral-900"
                  />
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Included Accessories (In the Box)
                </label>
                <input
                  type="text"
                  value={includedAccessories}
                  onChange={(e) => setIncludedAccessories(e.target.value)}
                  placeholder="e.g. Original box, XLR top handle, 2x batteries, wall charger, front cap"
                  className="w-full border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:bg-white focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Full Technical Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide comprehensive details about the gear, past usage, and filming capabilities..."
                  className="w-full border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-900 focus:outline-none focus:bg-white focus:border-neutral-900"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Specifications & Attributes */}
          <div className="border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  4. Technical Specifications
                </h2>
                <p className="text-xs text-neutral-500">
                  Highlight key attributes like Mount, Sensor size, Bit-depth, or Resolution.
                </p>
              </div>

              <button
                type="button"
                onClick={addAttribute}
                className="inline-flex items-center gap-1 border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Spec</span>
              </button>
            </div>

            <div className="space-y-2">
              {attributes.map((attr, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={attr.name}
                    onChange={(e) => updateAttribute(idx, 'name', e.target.value)}
                    placeholder="Spec Name (e.g. Mount)"
                    className="w-1/2 border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:bg-white focus:border-neutral-900"
                  />
                  <input
                    type="text"
                    value={attr.value}
                    onChange={(e) => updateAttribute(idx, 'value', e.target.value)}
                    placeholder="Value (e.g. Sony E)"
                    className="w-1/2 border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:bg-white focus:border-neutral-900"
                  />
                  <button
                    type="button"
                    onClick={() => removeAttribute(idx)}
                    className="p-2 text-neutral-400 hover:text-red-600 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Link
              href="/account"
              className="border border-neutral-300 bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={uploading}
              className="inline-flex items-center gap-2 bg-neutral-900 px-8 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-neutral-800 transition disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading to Media Storage...</span>
                </>
              ) : (
                <>
                  <Package className="h-4 w-4" />
                  <span>Publish Gear Listing</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
