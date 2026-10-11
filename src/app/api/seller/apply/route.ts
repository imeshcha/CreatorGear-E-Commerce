import { NextResponse } from 'next/server';
import { z } from 'zod';

const ApplicationSchema = z.object({
  sellerType: z.enum(['individual', 'business']),
  legalName: z.string().min(2),
  storeName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  idDocumentNumber: z.string().optional(),
  businessRegistrationNumber: z.string().optional(),
  taxId: z.string().optional(),
  payoutBank: z.string(),
  payoutAccount: z.string().min(3),
  idDocumentUrl: z.string(),
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

    const appId = `APP-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    return NextResponse.json({
      success: true,
      applicationId: appId,
      verificationStatus: 'pending',
      message: 'Verification application successfully filed in compliance queue.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Error processing application' },
      { status: 500 }
    );
  }
}
