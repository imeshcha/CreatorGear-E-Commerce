import { ethers } from 'ethers';
import { CryptoVerificationResult } from '@/types';

const DEFAULT_RPC_URL = process.env.CRYPTO_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com';
const PLATFORM_RECEIVING_ADDRESS = (process.env.NEXT_PUBLIC_CRYPTO_RECEIVING_ADDRESS || '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5').toLowerCase();

/**
 * Verifies on-chain transaction directly through an Ethereum / EVM JSON-RPC provider.
 * Validates:
 * 1. Transaction exists and is mined
 * 2. Status is 1 (success, not reverted)
 * 3. Destination address matches platform receiving wallet
 * 4. Value meets or exceeds expected crypto amount
 * 5. Minimum confirmation count is satisfied
 */
export async function verifyBlockchainTransaction(
  txHash: string,
  expectedAmountEth: number,
  requiredConfirmations: number = 1,
  customRpcUrl?: string
): Promise<CryptoVerificationResult> {
  const rpcUrl = customRpcUrl || DEFAULT_RPC_URL;

  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    // Fetch transaction data and receipt
    const tx = await provider.getTransaction(txHash);
    if (!tx) {
      return {
        verified: false,
        txHash,
        fromAddress: '',
        toAddress: '',
        receivedAmount: '0',
        confirmationCount: 0,
        network: 'sepolia',
        error: 'Transaction hash not found on network. Please wait a few seconds for propagation.',
      };
    }

    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt) {
      return {
        verified: false,
        txHash,
        fromAddress: tx.from,
        toAddress: tx.to || '',
        receivedAmount: ethers.formatEther(tx.value),
        confirmationCount: 0,
        network: 'sepolia',
        error: 'Transaction is still pending in mempool. Waiting for block confirmation.',
      };
    }

    if (receipt.status !== 1) {
      return {
        verified: false,
        txHash,
        fromAddress: tx.from,
        toAddress: tx.to || '',
        receivedAmount: ethers.formatEther(tx.value),
        confirmationCount: 0,
        network: 'sepolia',
        error: 'Transaction failed or was reverted by the EVM on-chain.',
      };
    }

    // Verify receiving address
    const recipient = (tx.to || '').toLowerCase();
    if (recipient !== PLATFORM_RECEIVING_ADDRESS) {
      return {
        verified: false,
        txHash,
        fromAddress: tx.from,
        toAddress: recipient,
        receivedAmount: ethers.formatEther(tx.value),
        confirmationCount: 0,
        network: 'sepolia',
        error: `Transaction was sent to address ${recipient}, but expected platform wallet ${PLATFORM_RECEIVING_ADDRESS}.`,
      };
    }

    // Verify amount
    const valueReceived = parseFloat(ethers.formatEther(tx.value));
    if (valueReceived < expectedAmountEth * 0.99) { // allow 1% slippage/rounding tolerance
      return {
        verified: false,
        txHash,
        fromAddress: tx.from,
        toAddress: recipient,
        receivedAmount: valueReceived.toString(),
        confirmationCount: 0,
        network: 'sepolia',
        error: `Insufficient payment: Received ${valueReceived} ETH, expected ${expectedAmountEth} ETH.`,
      };
    }

    const currentBlock = await provider.getBlockNumber();
    const confirmations = currentBlock - receipt.blockNumber + 1;

    if (confirmations < requiredConfirmations) {
      return {
        verified: false,
        txHash,
        fromAddress: tx.from,
        toAddress: recipient,
        receivedAmount: valueReceived.toString(),
        confirmationCount: confirmations,
        network: 'sepolia',
        error: `Confirmations count (${confirmations}) is below required (${requiredConfirmations}). Please wait.`,
      };
    }

    return {
      verified: true,
      txHash,
      fromAddress: tx.from,
      toAddress: recipient,
      receivedAmount: valueReceived.toString(),
      confirmationCount: confirmations,
      network: 'sepolia',
    };
  } catch (error: any) {
    return {
      verified: false,
      txHash,
      fromAddress: '',
      toAddress: '',
      receivedAmount: '0',
      confirmationCount: 0,
      network: 'sepolia',
      error: error?.message || 'Error communicating with blockchain RPC node.',
    };
  }
}
