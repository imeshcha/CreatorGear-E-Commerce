import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from('seller_verification_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ applications: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
