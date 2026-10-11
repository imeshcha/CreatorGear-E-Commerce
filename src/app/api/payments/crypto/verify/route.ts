import { NextResponse } from 'next/server';
import { verifyBlockchainTransaction } from '@/lib/payments/crypto';

export async function POST(request: Request) {
  try {
    const { orderId, txHash, expectedAmountEth, network } = await request.json();

    if (!txHash || !txHash.startsWith('0x') || txHash.length !== 66) {
      return NextResponse.json(
        { error: 'Invalid transaction hash format. Expected 66-character hex string starting with 0x.' },
        { status: 400 }
      );
    }

    // Call real RPC verification
    const result = await verifyBlockchainTransaction(
      txHash,
      expectedAmountEth || 0.001,
      1 // Require at least 1 confirmation
    );

    if (!result.verified) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          details: result,
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'On-chain transaction confirmed and validated against platform wallet.',
      verification: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'RPC communication error' },
      { status: 500 }
    );
  }
}
