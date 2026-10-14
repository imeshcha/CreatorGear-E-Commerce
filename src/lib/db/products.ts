import { Product } from '@/types';
import { createClient } from '@/lib/supabase/client';

export interface ProductFilterOptions {
  categorySlug?: string;
  brandSlug?: string;
  condition?: string;
  maxPrice?: number;
  minPrice?: number;
  search?: string;
  sortBy?: 'recommended' | 'price_asc' | 'price_desc' | 'newest' | 'rating';
  dealsOnly?: boolean;
}

export function matchesCategorySlug(productCatSlug?: string, targetSlug?: string): boolean {
  if (!targetSlug || targetSlug === 'all') return true;
  if (!productCatSlug) return false;
  if (productCatSlug === targetSlug) return true;

  const aliases: Record<string, string[]> = {
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

  const list = aliases[targetSlug] || [targetSlug];
  return list.includes(productCatSlug);
}

export async function getProducts(options: ProductFilterOptions = {}): Promise<Product[]> {
  try {
    const supabase = createClient();
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        brand:brands(*),
        images:product_images(*),
        attributes:product_attributes(*)
      `)
      .eq('status', 'active');

    if (options.condition && options.condition !== 'all') {
      query = query.eq('condition', options.condition);
    }
    if (options.maxPrice) {
      query = query.lte('price', options.maxPrice);
    }
    if (options.minPrice) {
      query = query.gte('price', options.minPrice);
    }

    const [productsRes, sellersRes] = await Promise.all([
      query,
      supabase.from('seller_profiles').select('*')
    ]);

    if (!productsRes.error && productsRes.data && productsRes.data.length > 0) {
      const sellerMap = new Map((sellersRes.data || []).map(s => [s.id, s]));
      let filtered = productsRes.data.map(p => ({
        ...p,
        seller: sellerMap.get(p.seller_id) || null,
        attributes: (p.attributes || []).map((a: any) => ({
          name: a.name || a.attribute_name || '',
          value: a.value || a.attribute_value || '',
        })),
      })) as Product[];

      if (options.categorySlug && options.categorySlug !== 'all') {
        filtered = filtered.filter(p => matchesCategorySlug(p.category?.slug, options.categorySlug));
      }
      if (options.brandSlug && options.brandSlug !== 'all') {
        filtered = filtered.filter(p => p.brand?.slug === options.brandSlug);
      }
      if (options.dealsOnly) {
        filtered = filtered.filter(p => p.compare_at_price && p.compare_at_price > p.price);
      }
      if (options.search) {
        const s = options.search.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(s) || 
          p.description.toLowerCase().includes(s) ||
          p.sku.toLowerCase().includes(s) ||
          (p.attributes && p.attributes.some(a => a.value?.toLowerCase().includes(s)))
        );
      }
      return sortProducts(filtered, options.sortBy);
    }
    return [];
  } catch (err) {
    console.error('Error querying products from Supabase:', err);
    return [];
  }
}

function sortProducts(products: Product[], sortBy?: string): Product[] {
  switch (sortBy) {
    case 'price_asc':
      return [...products].sort((a, b) => a.price - b.price);
    case 'price_desc':
      return [...products].sort((a, b) => b.price - a.price);
    case 'newest':
      return [...products].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    case 'rating':
      return [...products].sort((a, b) => b.rating - a.rating);
    case 'recommended':
    default:
      return products;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        brand:brands(*),
        images:product_images(*),
        attributes:product_attributes(*)
      `)
      .eq('slug', slug)
      .single();

    if (!error && data) {
      const { data: seller } = await supabase
        .from('seller_profiles')
        .select('*')
        .eq('id', data.seller_id)
        .single();

      return {
        ...data,
        seller: seller || null,
        attributes: (data.attributes || []).map((a: any) => ({
          name: a.name || a.attribute_name || '',
          value: a.value || a.attribute_value || '',
        })),
      } as Product;
    }
    return null;
  } catch (err) {
    console.error('Error querying product by slug from Supabase:', err);
    return null;
  }
}
