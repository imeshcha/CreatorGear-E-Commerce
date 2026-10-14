import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminSupabase } from '@/lib/supabase/admin';

const ApplicationSchema = z.object({
  userId: z.string().optional(),
  sellerType: z.enum(['individual', 'business']),
  legalName: z.string().min(2),
  storeName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  idDocumentNumber: z.string().optional(),
  businessRegistrationNumber: z.string().optional(),
  taxId: z.string().optional(),
  payoutBank: z.string().optional(),
  payoutAccount: z.string().optional(),
  idDocumentUrl: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = ApplicationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid verification details', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const {
      userId: passedUserId,
      sellerType,
      legalName,
      storeName,
      email,
      phone,
      businessRegistrationNumber,
      taxId,
      idDocumentUrl,
    } = validation.data;

    const supabase = getAdminSupabase();

    // 1. Resolve user ID
    let resolvedUserId = passedUserId;
    if (!resolvedUserId) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        resolvedUserId = existingUser.id;
      } else {
        const { data: authData } = await supabase.auth.admin.createUser({
          email,
          password: 'SellerTempPassword@123!',
          email_confirm: true,
          user_metadata: { full_name: legalName },
        });

        if (authData?.user) {
          resolvedUserId = authData.user.id;
          await supabase.from('users').upsert({
            id: resolvedUserId,
            email,
            full_name: legalName,
            phone_number: phone,
            role: 'seller',
            status: 'active',
          });
        }
      }
    }

    if (!resolvedUserId) {
      return NextResponse.json(
        { error: 'Unable to resolve seller user account.' },
        { status: 400 }
      );
    }

    // 2. Ensure seller profile exists with is_verified = false
    const slug = storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    await supabase.from('seller_profiles').upsert({
      id: resolvedUserId,
      store_name: storeName,
      slug: slug || `seller-${Date.now()}`,
      seller_type: sellerType,
      business_registration_number: businessRegistrationNumber || null,
      tax_id: taxId || null,
      is_verified: false,
      rating: 5.0,
      review_count: 0,
      completed_orders: 0,
    }, { onConflict: 'id' });

    // 3. Insert real verification application into Supabase
    const { data: application, error: appErr } = await supabase
      .from('seller_verification_applications')
      .insert({
        user_id: resolvedUserId,
        seller_type: sellerType,
        legal_name: legalName,
        phone_number: phone,
        business_name: storeName,
        business_registration_number: businessRegistrationNumber || null,
        tax_id: taxId || null,
        id_document_url: idDocumentUrl || 'docs/verification-pending.pdf',
        verification_status: 'pending',
      })
      .select()
      .single();

    if (appErr) {
      console.error('Error inserting verification application:', appErr);
      return NextResponse.json({ error: appErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      applicationId: application.id,
      verificationStatus: application.verification_status,
      message: 'Verification application successfully filed in compliance queue.',
    });
  } catch (err: any) {
    console.error('Error handling seller application:', err);
    return NextResponse.json(
      { error: err?.message || 'Error processing application' },
      { status: 500 }
    );
  }
}
