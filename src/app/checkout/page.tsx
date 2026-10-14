'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  CreditCard,
  Banknote,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, totalItems, clearCart } = useCart();
  const { authUser, userProfile } = useAuth();

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
  });

  React.useEffect(() => {
    if (authUser || userProfile) {
      setFormData(prev => ({
        ...prev,
        customerName: prev.customerName || userProfile?.full_name || '',
        customerEmail: prev.customerEmail || authUser?.email || '',
      }));
    }
  }, [authUser, userProfile]);

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'payhere' | 'crypto'>('payhere');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Crypto workflow states
  const [cryptoOrderData, setCryptoOrderData] = useState<any>(null);
  const [txHashInput, setTxHashInput] = useState('');
  const [verifyingTx, setVerifyingTx] = useState(false);
  const [cryptoError, setCryptoError] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(false);

  // PayHere auto-submitting form state
  const [payHerePayload, setPayHerePayload] = useState<any>(null);

  if (items.length === 0 && !cryptoOrderData) {
    return (
      <div className="min-h-screen bg-[#E6E9EC]">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <h1 className="text-2xl font-black text-[#00203F]">Your Cart is Empty</h1>
          <p className="mt-2 text-xs text-[#2F2F2F]/70">Add equipment to your cart before proceeding to checkout.</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          paymentMethod,
          items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      if (paymentMethod === 'cod') {
        clearCart();
        router.push(`/order/success?order_id=${data.orderId}&method=cod`);
        return;
      }

      if (paymentMethod === 'payhere') {
        // Trigger PayHere form submission
        setPayHerePayload(data.payHereParams);
        return;
      }

      if (paymentMethod === 'crypto') {
        setCryptoOrderData(data);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while creating order.');
    } finally {
      setSubmitting(false);
    }
  };

  // Real on-chain crypto verification handler
  const handleVerifyCryptoTx = async () => {
    if (!txHashInput.trim()) return;
    setVerifyingTx(true);
    setCryptoError('');

    try {
      const res = await fetch('/api/payments/crypto/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: cryptoOrderData.orderId,
          txHash: txHashInput.trim(),
          expectedAmountEth: cryptoOrderData.cryptoPayment.expectedAmountEth,
          network: cryptoOrderData.cryptoPayment.network,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Transaction verification unsuccessful.');
      }

      clearCart();
      router.push(`/order/success?order_id=${cryptoOrderData.orderId}&method=crypto&tx=${encodeURIComponent(txHashInput.trim())}`);
    } catch (err: any) {
      setCryptoError(err.message);
    } finally {
      setVerifyingTx(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E6E9EC]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black tracking-tight text-[#00203F] sm:text-3xl">
            CHECKOUT & SETTLEMENT
          </h1>
          <p className="text-xs text-[#2F2F2F]/70">
            Escrow-backed multi-vendor payment processing with server-side signature validation
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
            {errorMsg}
          </div>
        )}

        {/* If PayHere is ready to redirect */}
        {payHerePayload && (
          <div className="mb-8 border border-[#00203F]/15 bg-white p-6 shadow-xs text-center space-y-4">
            <h2 className="text-base font-bold text-[#00203F]">
              PayHere Secure Gateway Ready
            </h2>
            <p className="text-xs text-[#2F2F2F]/70">
              Order <span className="font-mono font-bold text-[#00203F]">{payHerePayload.order_id}</span> has been signed with merchant secret hash.
            </p>

            <form action={payHerePayload.actionUrl} method="POST">
              <input type="hidden" name="merchant_id" value={payHerePayload.merchant_id} />
              <input type="hidden" name="return_url" value={payHerePayload.return_url} />
              <input type="hidden" name="cancel_url" value={payHerePayload.cancel_url} />
              <input type="hidden" name="notify_url" value={payHerePayload.notify_url} />
              <input type="hidden" name="order_id" value={payHerePayload.order_id} />
              <input type="hidden" name="items" value={payHerePayload.items} />
              <input type="hidden" name="currency" value={payHerePayload.currency} />
              <input type="hidden" name="amount" value={payHerePayload.amount} />
              <input type="hidden" name="first_name" value={payHerePayload.first_name} />
              <input type="hidden" name="last_name" value={payHerePayload.last_name} />
              <input type="hidden" name="email" value={payHerePayload.email} />
              <input type="hidden" name="phone" value={payHerePayload.phone} />
              <input type="hidden" name="address" value={payHerePayload.address} />
              <input type="hidden" name="city" value={payHerePayload.city} />
              <input type="hidden" name="country" value={payHerePayload.country} />
              <input type="hidden" name="hash" value={payHerePayload.hash} />

              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-[#00203F] px-8 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#36ECDE] hover:text-[#00203F] shadow-xs transition-colors"
              >
                <span>Proceed to PayHere Hosted Checkout</span>
                <ExternalLink className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}

        {/* If Crypto Payment is Active */}
        {cryptoOrderData && (
          <div className="mb-8 border border-[#00203F]/15 bg-white p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#00203F]/10 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#2F2F2F]/60">
                  Direct On-Chain Payment
                </span>
                <h2 className="text-lg font-black text-[#00203F]">
                  Send {cryptoOrderData.cryptoPayment.expectedAmountEth} ETH ({cryptoOrderData.cryptoPayment.network.toUpperCase()})
                </h2>
              </div>
              <span className="bg-[#36ECDE]/20 px-3 py-1 text-xs font-bold text-[#00203F] border border-[#36ECDE]/40 font-mono">
                Order #{cryptoOrderData.orderId}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Details */}
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[#2F2F2F]/70 block mb-1">Platform Receiving Wallet Address:</span>
                  <div className="flex items-center gap-2 border border-[#00203F]/15 bg-[#E6E9EC] p-2.5 font-mono text-[11px] text-[#00203F] break-all">
                    <span>{cryptoOrderData.cryptoPayment.receivingAddress}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(cryptoOrderData.cryptoPayment.receivingAddress);
                        setCopiedAddress(true);
                        setTimeout(() => setCopiedAddress(false), 2000);
                      }}
                      className="ml-auto shrink-0 p-1 hover:text-[#36ECDE]"
                      title="Copy Address"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  {copiedAddress && <span className="text-[#00203F] font-bold text-[10px]">Copied to clipboard!</span>}
                </div>

                <div className="border border-[#00203F]/20 bg-[#E6E9EC]/50 p-3 text-[11px] text-[#2F2F2F]">
                  <p className="font-bold flex items-center gap-1 text-[#00203F]">
                    <AlertCircle className="h-3.5 w-3.5 text-[#00203F]" /> Real JSON-RPC Blockchain Verification
                  </p>
                  <p className="mt-1 text-[#2F2F2F]/80">
                    Once you broadcast your transaction from MetaMask or hardware wallet, enter your transaction hash below. Our backend queries live Ethereum/Sepolia RPC nodes to verify confirmations and destination wallet.
                  </p>
                </div>
              </div>

              {/* Transaction Hash Input & Verify */}
              <div className="border border-[#00203F]/15 bg-[#E6E9EC]/40 p-5 space-y-4">
                <h3 className="text-xs font-bold text-[#00203F] uppercase tracking-wider">
                  Verify Transaction Hash
                </h3>

                <input
                  type="text"
                  value={txHashInput}
                  onChange={(e) => setTxHashInput(e.target.value)}
                  placeholder="0x..."
                  className="w-full border border-[#00203F]/20 bg-white px-3 py-2 text-xs font-mono text-[#00203F] focus:outline-none focus:border-[#00203F]"
                />

                {cryptoError && (
                  <p className="text-xs font-medium text-red-600 bg-red-50 p-2.5 border border-red-200">
                    {cryptoError}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleVerifyCryptoTx}
                  disabled={verifyingTx || !txHashInput.trim()}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#00203F] py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#36ECDE] hover:text-[#00203F] disabled:bg-[#00203F]/20 disabled:text-[#2F2F2F]/40 transition-colors"
                >
                  {verifyingTx ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Querying RPC Nodes...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      <span>Confirm & Verify On-Chain</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Regular Checkout Form */}
        {!cryptoOrderData && !payHerePayload && (
          <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Customer Information & Delivery Address */}
            <div className="lg:col-span-7 space-y-6">
              <div className="border border-[#00203F]/15 bg-white p-6 shadow-xs space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#00203F]">
                  Customer & Delivery Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-[#00203F] mb-1">Full Name</label>
                    <input
                      type="text"
                      name="customerName"
                      required
                      value={formData.customerName}
                      onChange={handleInputChange}
                      className="w-full border border-[#00203F]/20 bg-[#E6E9EC]/30 px-3 py-2 text-[#00203F] focus:bg-white focus:outline-none focus:border-[#00203F]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#00203F] mb-1">Email Address</label>
                    <input
                      type="email"
                      name="customerEmail"
                      required
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      className="w-full border border-[#00203F]/20 bg-[#E6E9EC]/30 px-3 py-2 text-[#00203F] focus:bg-white focus:outline-none focus:border-[#00203F]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#00203F] mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="customerPhone"
                      required
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      className="w-full border border-[#00203F]/20 bg-[#E6E9EC]/30 px-3 py-2 text-[#00203F] focus:bg-white focus:outline-none focus:border-[#00203F]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-[#00203F] mb-1">Street Address</label>
                    <input
                      type="text"
                      name="addressLine1"
                      required
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      className="w-full border border-[#00203F]/20 bg-[#E6E9EC]/30 px-3 py-2 text-[#00203F] focus:bg-white focus:outline-none focus:border-[#00203F]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#00203F] mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full border border-[#00203F]/20 bg-[#E6E9EC]/30 px-3 py-2 text-[#00203F] focus:bg-white focus:outline-none focus:border-[#00203F]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#00203F] mb-1">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full border border-[#00203F]/20 bg-[#E6E9EC]/30 px-3 py-2 text-[#00203F] focus:bg-white focus:outline-none focus:border-[#00203F]"
                    />
                  </div>
                </div>
              </div>

              {/* Tri-Method Payment Selection */}
              <div className="border border-[#00203F]/15 bg-white p-6 shadow-xs space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#00203F]">
                  Select Payment Method
                </h2>

                <div className="space-y-3">
                  {/* PayHere Online Payment */}
                  <label
                    className={`flex items-start gap-4 border p-4 cursor-pointer transition ${
                      paymentMethod === 'payhere'
                        ? 'border-2 border-[#00203F] bg-[#E6E9EC]/40 shadow-xs'
                        : 'border-[#00203F]/15 hover:border-[#00203F]/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'payhere'}
                      onChange={() => setPaymentMethod('payhere')}
                      className="mt-1 accent-[#00203F]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#00203F] flex items-center gap-1.5">
                          <CreditCard className="h-4 w-4 text-[#00203F]" />
                          PayHere Online Gateway (Credit/Debit Card)
                        </span>
                        <span className="text-[10px] font-bold text-[#00203F] bg-[#36ECDE]/20 border border-[#36ECDE]/40 px-2 py-0.5">
                          Instant
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-[#2F2F2F]/70">
                        Supports Visa, MasterCard, Amex, Genie, eZ Cash. Redirects to secure PayHere hosted gateway with server MD5 verification.
                      </p>
                    </div>
                  </label>

                  {/* Cryptocurrency */}
                  <label
                    className={`flex items-start gap-4 border p-4 cursor-pointer transition ${
                      paymentMethod === 'crypto'
                        ? 'border-2 border-[#00203F] bg-[#E6E9EC]/40 shadow-xs'
                        : 'border-[#00203F]/15 hover:border-[#00203F]/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'crypto'}
                      onChange={() => setPaymentMethod('crypto')}
                      className="mt-1 accent-[#00203F]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#00203F] flex items-center gap-1.5">
                          <Coins className="h-4 w-4 text-[#00203F]" />
                          Direct Cryptocurrency (ETH / Web3)
                        </span>
                        <span className="text-[10px] font-bold text-[#00203F] bg-[#36ECDE]/20 border border-[#36ECDE]/40 px-2 py-0.5">
                          Sepolia / EVM
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-[#2F2F2F]/70">
                        Direct wallet transfer to platform receiving address. Verified on-chain via JSON-RPC block confirmation.
                      </p>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-start gap-4 border p-4 cursor-pointer transition ${
                      paymentMethod === 'cod'
                        ? 'border-2 border-[#00203F] bg-[#E6E9EC]/40 shadow-xs'
                        : 'border-[#00203F]/15 hover:border-[#00203F]/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 accent-[#00203F]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#00203F] flex items-center gap-1.5">
                          <Banknote className="h-4 w-4 text-[#00203F]" />
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[10px] font-bold text-[#00203F] bg-[#E6E9EC] border border-[#00203F]/15 px-2 py-0.5">
                          Courier
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-[#2F2F2F]/70">
                        Pay cash upon parcel delivery. Platform reconciles funds via verified courier tracking references.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Order Summary and Pay Button */}
            <div className="lg:col-span-5 space-y-6">
              <div className="border border-[#00203F]/15 bg-white p-6 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#00203F]">
                  Review Items ({totalItems})
                </h3>

                <div className="divide-y divide-[#00203F]/10 max-h-64 overflow-y-auto pr-1">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="max-w-[200px]">
                        <p className="font-bold text-[#00203F] line-clamp-1">{product.name}</p>
                        <p className="text-[10px] text-[#2F2F2F]/60">Qty: {quantity} • Sold by {product.seller?.store_name}</p>
                      </div>
                      <span className="font-mono font-bold text-[#00203F]">
                        LKR {(product.price * quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#00203F]/10 pt-3 space-y-2 text-xs">
                  <div className="flex justify-between text-[#2F2F2F]/80">
                    <span>Subtotal</span>
                    <span className="font-mono font-bold text-[#00203F]">
                      LKR {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#2F2F2F]/80">
                    <span>Shipping</span>
                    <span className="font-bold text-[#00203F]">FREE Courier</span>
                  </div>
                  <div className="flex justify-between text-[#2F2F2F]/80">
                    <span>Platform Commission (8%)</span>
                    <span className="text-[#2F2F2F]/50">Deducted from seller payout</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-[#00203F]/10 text-sm font-black text-[#00203F]">
                    <span>Total Due</span>
                    <span className="font-mono text-base font-black text-[#00203F]">
                      LKR {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#00203F] py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-[#36ECDE] hover:text-[#00203F] disabled:bg-[#00203F]/20 disabled:text-[#2F2F2F]/40 transition-colors"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Validating Prices & Stock...</span>
                    </>
                  ) : (
                    <span>Confirm Order & Pay</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
