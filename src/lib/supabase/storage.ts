import { createClient } from './client';

export const BUCKET_PRODUCT_IMAGES = 'product-images';
export const BUCKET_VERIFICATION_DOCS = 'verification-documents';

/**
 * Uploads a product photo to the public Supabase storage bucket via the server API endpoint
 * (bypasses direct client-side RLS constraints with service role key)
 */
export async function uploadProductImage(
  file: File,
  productId: string
): Promise<{ url: string; path: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', BUCKET_PRODUCT_IMAGES);
    formData.append('folder', productId);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      return { url: '', path: '', error: data.error || 'Upload failed' };
    }

    return { url: data.url, path: data.path };
  } catch (err: any) {
    // Fallback to client SDK if fetch fails
    try {
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
    } catch (clientErr: any) {
      return { url: '', path: '', error: clientErr.message || err.message };
    }
  }
}

/**
 * Uploads a sensitive KYC or business proof document to the private Supabase storage bucket
 */
export async function uploadVerificationDocument(
  file: File,
  userId: string
): Promise<{ path: string; url?: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', BUCKET_VERIFICATION_DOCS);
    formData.append('folder', userId);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      return { path: '', error: data.error || 'Upload failed' };
    }

    return { path: data.path, url: data.url };
  } catch (err: any) {
    // Fallback to client SDK
    try {
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
    } catch (clientErr: any) {
      return { path: '', error: clientErr.message || err.message };
    }
  }
}
