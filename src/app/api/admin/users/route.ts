import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase/admin';

export interface AdminUserListItem {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone_number?: string;
  role: 'customer' | 'seller' | 'admin';
  status: 'active' | 'suspended' | 'banned';
  created_at: string;
  last_sign_in_at?: string;
  provider: string;
  seller_profile?: {
    store_name: string;
    slug: string;
    seller_type: 'individual' | 'business';
    is_verified: boolean;
    rating: number;
    review_count: number;
    completed_orders: number;
  } | null;
}

export async function GET() {
  try {
    const supabase = getAdminSupabase();

    // 1. Fetch all users from Supabase Auth (includes Google OAuth and Email users)
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
      console.error('Error fetching auth users:', authError);
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    // 2. Fetch all public users with their seller profiles
    const { data: dbUsers, error: dbError } = await supabase
      .from('users')
      .select('*, seller_profiles(*)');

    if (dbError) {
      console.error('Error fetching public users:', dbError);
    }

    const dbUserMap = new Map<string, any>((dbUsers || []).map((u: any) => [u.id, u]));

    // 3. Merge Auth users with DB users
    const users: AdminUserListItem[] = [];
    const missingDbUsers: any[] = [];

    for (const authUser of authData.users) {
      const dbUser = dbUserMap.get(authUser.id);
      const email = authUser.email || dbUser?.email || 'No email';
      const fullName =
        dbUser?.full_name ||
        authUser.user_metadata?.full_name ||
        authUser.user_metadata?.name ||
        email.split('@')[0] ||
        'Creator';
      const avatarUrl = dbUser?.avatar_url || authUser.user_metadata?.avatar_url;
      const role = dbUser?.role || (authUser.user_metadata?.role as any) || 'customer';
      const status = dbUser?.status || 'active';
      const provider = authUser.app_metadata?.provider || 'email';

      // If user is in Auth but not in public.users, queue for auto-sync
      if (!dbUser && authUser.id && email) {
        missingDbUsers.push({
          id: authUser.id,
          email,
          full_name: fullName,
          avatar_url: avatarUrl || null,
          role,
          status,
        });
      }

      const sellerRaw = dbUser?.seller_profiles;
      const sellerProfile = sellerRaw
        ? {
            store_name: sellerRaw.store_name,
            slug: sellerRaw.slug,
            seller_type: sellerRaw.seller_type,
            is_verified: Boolean(sellerRaw.is_verified),
            rating: Number(sellerRaw.rating || 5.0),
            review_count: Number(sellerRaw.review_count || 0),
            completed_orders: Number(sellerRaw.completed_orders || 0),
          }
        : null;

      users.push({
        id: authUser.id,
        email,
        full_name: fullName,
        avatar_url: avatarUrl,
        phone_number: dbUser?.phone_number || authUser.phone,
        role: sellerProfile ? 'seller' : role,
        status,
        created_at: authUser.created_at,
        last_sign_in_at: authUser.last_sign_in_at || undefined,
        provider,
        seller_profile: sellerProfile,
      });
    }

    // Auto-sync missing users in the background
    if (missingDbUsers.length > 0) {
      supabase.from('users').upsert(missingDbUsers).then(() => {});
    }

    // Sort by newest registered
    users.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Calculate summary statistics
    const stats = {
      totalUsers: users.length,
      customers: users.filter((u) => u.role === 'customer').length,
      sellers: users.filter((u) => u.role === 'seller').length,
      verifiedSellers: users.filter((u) => u.seller_profile?.is_verified).length,
      admins: users.filter((u) => u.role === 'admin').length,
      googleUsers: users.filter((u) => u.provider === 'google').length,
    };

    return NextResponse.json({ users, stats });
  } catch (err: any) {
    console.error('Error in GET /api/admin/users:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
