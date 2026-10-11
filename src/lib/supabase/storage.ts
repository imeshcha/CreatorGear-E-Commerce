import { createClient } from './client';

export const BUCKET_PRODUCT_IMAGES = 'product-images';
export const BUCKET_VERIFICATION_DOCS = 'verification-documents';

/**
 * Uploads a product photo to the public Supabase storage bucket
 */
export async function uploadProductImage(file: File, productId: string): Promise<{ url: string; path: string; error?: string }> {
  const supabase = createClient();
  const fileExt = file.name.split('.').pop();
  const fileName = `${productId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_PRODUCT_IMAGES)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    return { url: '', path: '', error: error.message };
  }

  const { data: publicData } = supabase.storage
    .from(BUCKET_PRODUCT_IMAGES)
    .getPublicUrl(data.path);

  return { url: publicData.publicUrl, path: data.path };
}

/**
 * Uploads a sensitive KYC or business proof document to the private Supabase storage bucket
 */
export async function uploadVerificationDocument(file: File, userId: string): Promise<{ path: string; error?: string }> {
  const supabase = createClient();
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}-kyc.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_VERIFICATION_DOCS)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    return { path: '', error: error.message };
  }

  return { path: data.path };
}
