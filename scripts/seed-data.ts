import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { INITIAL_PRODUCTS, INITIAL_SELLERS, INITIAL_BRANDS } from '../src/data/initial-products';

// Parse .env.local manually
try {
  const envPath = path.resolve('.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        process.env[key] = val;
      }
    }
  }
} catch (e) {
  console.warn('Could not read .env.local', e);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://evfpyidulnbewerkrnqy.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is required to seed database.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function seed() {
  console.log('--- 1. Fetching Categories and Brands ---');
  const { data: dbCategories, error: catErr } = await supabase.from('categories').select('*');
  if (catErr) throw catErr;
  console.log(`Loaded ${dbCategories.length} categories from Supabase.`);

  const { data: dbBrands, error: brandErr } = await supabase.from('brands').select('*');
  if (brandErr) throw brandErr;
  console.log(`Loaded ${dbBrands.length} brands from Supabase.`);

  // Create brand lookup map
  const brandMap = new Map<string, string>();
  for (const b of dbBrands) {
    brandMap.set(b.slug, b.id);
  }

  // Ensure all initial brands exist
  for (const b of INITIAL_BRANDS) {
    if (!brandMap.has(b.slug)) {
      const { data: newBrand, error } = await supabase
        .from('brands')
        .insert({ name: b.name, slug: b.slug, website: `https://${b.slug}.com` })
        .select()
        .single();
      if (!error && newBrand) {
        brandMap.set(b.slug, newBrand.id);
        console.log(`Created brand: ${b.name}`);
      }
    }
  }

  // Create category lookup map
  const catMap = new Map<string, string>();
  for (const c of dbCategories) {
    catMap.set(c.slug, c.id);
    if (c.slug === 'cameras-and-lenses') catMap.set('cameras', c.id);
    if (c.slug === 'audio-equipment') catMap.set('audio', c.id);
    if (c.slug === 'lighting-and-studio') catMap.set('lighting', c.id);
    if (c.slug === 'streaming-and-content') catMap.set('streaming', c.id);
  }

  console.log('\n--- 2. Provisioning Sellers in Supabase ---');
  const sellerIdMap = new Map<string, string>();

  for (const seller of INITIAL_SELLERS) {
    const email = `${seller.slug}@creatorgear.io`;
    const password = 'Password@123!';

    // Check if auth user exists
    const { data: listData } = await supabase.auth.admin.listUsers();
    let user = listData?.users.find(u => u.email === email);

    if (!user) {
      console.log(`Creating Auth user for seller: ${email}`);
      const { data: createData, error: createErr } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: seller.store_name },
      });
      if (createErr) {
        console.error(`Error creating auth user ${email}:`, createErr.message);
        continue;
      }
      user = createData.user;
    }

    if (!user) continue;

    const userId = user.id;
    sellerIdMap.set(seller.id, userId);

    // Upsert into public.users
    await supabase.from('users').upsert({
      id: userId,
      email: email,
      full_name: seller.store_name,
      role: 'seller',
      status: 'active',
    });

    // Upsert into public.seller_profiles
    const { error: profileErr } = await supabase.from('seller_profiles').upsert({
      id: userId,
      store_name: seller.store_name,
      slug: seller.slug,
      seller_type: seller.seller_type,
      bio: seller.bio,
      is_verified: seller.is_verified,
      rating: seller.rating,
      review_count: seller.review_count,
      completed_orders: seller.completed_orders,
      commission_rate: seller.commission_rate,
      business_registration_number: seller.business_registration_number || null,
    });

    if (profileErr) {
      console.error(`Error upserting seller profile ${seller.store_name}:`, profileErr.message);
    } else {
      console.log(`Seeded seller profile: ${seller.store_name} (ID: ${userId})`);
    }
  }

  console.log('\n--- 3. Seeding Products into Supabase ---');
  // First clear any existing test products if needed or upsert
  for (const p of INITIAL_PRODUCTS) {
    const sellerUuid = sellerIdMap.get(p.seller_id);
    if (!sellerUuid) {
      console.warn(`Could not find seller UUID for ${p.seller_id} on product ${p.name}`);
      continue;
    }

    const categoryId = catMap.get(p.category?.slug || '') || dbCategories[0].id;
    const brandId = p.brand ? brandMap.get(p.brand.slug) : null;

    // Check if product exists by slug
    const { data: existingProd } = await supabase
      .from('products')
      .select('id')
      .eq('slug', p.slug)
      .single();

    let productId = existingProd?.id;

    if (!productId) {
      const { data: newProd, error: prodErr } = await supabase
        .from('products')
        .insert({
          seller_id: sellerUuid,
          name: p.name,
          slug: p.slug,
          sku: p.sku,
          description: p.description,
          category_id: categoryId,
          brand_id: brandId,
          price: p.price,
          compare_at_price: p.compare_at_price || null,
          currency: 'USD',
          condition: p.condition,
          condition_grade: p.condition_grade || null,
          known_defects: p.known_defects || null,
          usage_details: p.usage_details || null,
          included_accessories: p.included_accessories || null,
          warranty_details: p.warranty_details || null,
          warranty_provider: p.warranty_provider || 'none',
          stock_quantity: p.stock_quantity,
          status: 'active',
          rating: p.rating,
          review_count: p.review_count,
        })
        .select()
        .single();

      if (prodErr) {
        console.error(`Error inserting product ${p.name}:`, prodErr.message);
        continue;
      }
      productId = newProd.id;
      console.log(`Created product: ${p.name} (ID: ${productId})`);
    } else {
      console.log(`Product already exists: ${p.name} (ID: ${productId})`);
    }

    // Insert images
    if (productId && p.images && p.images.length > 0) {
      await supabase.from('product_images').delete().eq('product_id', productId);
      const imgRows = p.images.map((img, idx) => ({
        product_id: productId,
        storage_path: img.storage_path,
        alt_text: img.alt_text || `${p.name} image ${idx + 1}`,
        sort_order: img.sort_order || idx,
        is_primary: img.is_primary ?? (idx === 0),
      }));
      await supabase.from('product_images').insert(imgRows);
    }

    // Insert attributes
    if (productId && p.attributes && p.attributes.length > 0) {
      await supabase.from('product_attributes').delete().eq('product_id', productId);
      const attrRows = p.attributes.map(attr => ({
        product_id: productId,
        attribute_name: attr.name,
        attribute_value: attr.value,
      }));
      await supabase.from('product_attributes').insert(attrRows);
    }
  }

  console.log('\n--- Seeding Completed Successfully! ---');
}

seed().catch(err => {
  console.error('Seed script failed:', err);
  process.exit(1);
});
