import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase/admin';
import { verifyAdminRequest } from '@/lib/auth/admin';

export async function POST(request: Request) {
  try {
    const authResult = await verifyAdminRequest(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { applicationId, status, notes } = await request.json();

    if (!applicationId || !status) {
      return NextResponse.json({ error: 'applicationId and status required' }, { status: 400 });
    }

    const supabase = getAdminSupabase();

    // 1. Fetch application to get user_id
    const { data: application, error: fetchErr } = await supabase
      .from('seller_verification_applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (fetchErr || !application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // 2. Update application status
    const reviewerIdentifier = authResult.email || 'Admin';
    const { error: updateErr } = await supabase
      .from('seller_verification_applications')
      .update({
        verification_status: status,
        review_notes: notes || 'Reviewed by admin compliance',
        reviewed_by: reviewerIdentifier,
        reviewed_date: new Date().toISOString(),
      })
      .eq('id', applicationId);

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    // 3. If approved, award verified badge to seller_profile
    if (status === 'approved' && application.user_id) {
      await supabase
        .from('seller_profiles')
        .update({
          is_verified: true,
        })
        .eq('id', application.user_id);
    } else if ((status === 'rejected' || status === 'suspended') && application.user_id) {
      await supabase
        .from('seller_profiles')
        .update({
          is_verified: false,
        })
        .eq('id', application.user_id);
    }

    return NextResponse.json({
      success: true,
      applicationId,
      status,
      message: `Application #${applicationId} updated to ${status}.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
