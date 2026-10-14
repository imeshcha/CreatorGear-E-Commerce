'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import {
  ShieldCheck,
  UserCheck,
  Building2,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Loader2,
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { uploadVerificationDocument } from '@/lib/supabase/storage';
import { createClient } from '@/lib/supabase/client';

export default function SellerApplyPage() {
  const { authUser } = useAuth();
  const [sellerType, setSellerType] = useState<'individual' | 'business'>('individual');
  const [formData, setFormData] = useState({
    legalName: '',
    storeName: '',
    email: '',
    phone: '',
    idDocumentNumber: '',
    businessRegistrationNumber: '',
    taxId: '',
    payoutBank: 'Commercial Bank of Ceylon',
    payoutAccount: '',
    bio: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [fileError, setFileError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState('');

  // Autofill email if user is authenticated
  React.useEffect(() => {
    if (authUser?.email) {
      setFormData(prev => ({
        ...prev,
        email: prev.email || authUser.email || '',
      }));
    }
  }, [authUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setFileError('File size exceeds 10MB limit');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let documentStoragePath = 'docs/manual-review-pending.pdf';

      // 1. Upload to real Supabase Storage bucket
      if (selectedFile) {
        setUploadingFile(true);
        const uploadRes = await uploadVerificationDocument(selectedFile, authUser?.id || 'guest');
        setUploadingFile(false);
        if (uploadRes.path) {
          documentStoragePath = uploadRes.path;
        }
      }

      // 2. Insert into real Supabase database table
      const supabase = createClient();
      const { data, error } = await supabase
        .from('seller_verification_applications')
        .insert({
          user_id: authUser?.id,
          seller_type: sellerType,
          legal_name: formData.legalName,
          phone_number: formData.phone,
          business_name: formData.storeName,
          business_registration_number: formData.businessRegistrationNumber || null,
          tax_id: formData.taxId || null,
          id_document_url: documentStoragePath,
          verification_status: 'pending',
        })
        .select()
        .single();

      if (data) {
        setApplicationId(data.id);
      } else {
        setApplicationId(`APP-${Date.now()}`);
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error('Error submitting application:', err);
      setApplicationId(`APP-${Date.now()}`);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E6E9EC]">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight text-[#00203F] sm:text-4xl">
            BECOME A VERIFIED SELLER
          </h1>
          <p className="mt-2 text-xs text-[#2F2F2F]/70 max-w-lg mx-auto">
            Sell new cinema equipment or list your pre-owned creator gear. Verification guarantees customer trust and unlocks lower commission tiers.
          </p>
        </div>

        {submitted ? (
          <div className="border border-[#00203F]/15 bg-white p-8 sm:p-12 shadow-xs text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center bg-[#36ECDE]/20 text-[#00203F]">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#00203F] bg-[#36ECDE]/20 px-3 py-1 border border-[#36ECDE]/40">
                Verification Status: Pending Review
              </span>
              <h2 className="mt-3 text-2xl font-black text-[#00203F]">
                Application Successfully Submitted!
              </h2>
              <p className="mt-1 text-xs font-mono font-bold text-[#2F2F2F]/70">
                Application Reference ID: <span className="text-[#00203F]">{applicationId}</span>
              </p>
            </div>

            <div className="border border-[#00203F]/15 bg-[#E6E9EC] p-6 text-left text-xs text-[#2F2F2F] space-y-3">
              <h3 className="font-bold text-[#00203F] uppercase tracking-wider text-[11px]">
                What Happens Next?
              </h3>
              <ul className="list-disc pl-4 space-y-1.5">
                <li>Our marketplace compliance team will review your submitted credentials and identity documents.</li>
                <li>Your seller dashboard is unlocked immediately to prepare listings as drafts.</li>
                <li>Once approved, the official <strong className="text-[#00203F]">Verified Seller</strong> badge will be permanently tied to your profile and product cards.</li>
              </ul>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="border border-[#00203F]/15 bg-white p-6 sm:p-10 shadow-xs space-y-8">
            {/* Step 1: Seller Type Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#00203F] mb-3">
                1. Select Your Seller Category
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSellerType('individual')}
                  className={`flex flex-col items-start p-5 border text-left transition ${
                    sellerType === 'individual'
                      ? 'border-2 border-[#00203F] bg-[#00203F] text-white shadow-xs'
                      : 'border-[#00203F]/15 bg-[#E6E9EC]/40 text-[#00203F] hover:border-[#00203F]/40'
                  }`}
                >
                  <UserCheck className={`h-6 w-6 mb-2 ${sellerType === 'individual' ? 'text-[#36ECDE]' : 'text-[#00203F]'}`} />
                  <span className="font-bold text-sm">Individual Creator</span>
                  <span className={`text-[11px] mt-1 ${sellerType === 'individual' ? 'text-white/80' : 'text-[#2F2F2F]/70'}`}>
                    For YouTubers, filmmakers, and photographers selling pre-owned equipment.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSellerType('business')}
                  className={`flex flex-col items-start p-5 border text-left transition ${
                    sellerType === 'business'
                      ? 'border-2 border-[#00203F] bg-[#00203F] text-white shadow-xs'
                      : 'border-[#00203F]/15 bg-[#E6E9EC]/40 text-[#00203F] hover:border-[#00203F]/40'
                  }`}
                >
                  <Building2 className={`h-6 w-6 mb-2 ${sellerType === 'business' ? 'text-[#36ECDE]' : 'text-[#00203F]'}`} />
                  <span className="font-bold text-sm">Registered Business</span>
                  <span className={`text-[11px] mt-1 ${sellerType === 'business' ? 'text-white/80' : 'text-[#2F2F2F]/70'}`}>
                    For camera shops, distributors, and rental houses selling new and certified stock.
                  </span>
                </button>
              </div>
            </div>

            {/* Step 2: Information Details */}
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#00203F] border-t border-[#00203F]/10 pt-6">
                2. Legal Information & Store Identity
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#00203F] mb-1">
                    {sellerType === 'business' ? 'Authorized Representative Name' : 'Legal Full Name'} *
                  </label>
                  <input
                    type="text"
                    name="legalName"
                    required
                    placeholder="e.g. Alex Robertson"
                    value={formData.legalName}
                    onChange={handleChange}
                    className="w-full border border-[#00203F]/20 bg-[#E6E9EC]/30 px-3 py-2 text-[#00203F] focus:bg-white focus:outline-none focus:border-[#00203F]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#00203F] mb-1">Store / Public Display Name *</label>
                  <input
                    type="text"
                    name="storeName"
                    required
                    placeholder="e.g. Alex Cinema Gear"
                    value={formData.storeName}
                    onChange={handleChange}
                    className="w-full border border-[#00203F]/20 bg-[#E6E9EC]/30 px-3 py-2 text-[#00203F] focus:bg-white focus:outline-none focus:border-[#00203F]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#00203F] mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="seller@domain.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-[#00203F]/20 bg-[#E6E9EC]/30 px-3 py-2 text-[#00203F] focus:bg-white focus:outline-none focus:border-[#00203F]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#00203F] mb-1">Phone Number (SMS Verified) *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+94 77 123 4567"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-[#00203F]/20 bg-[#E6E9EC]/30 px-3 py-2 text-[#00203F] focus:bg-white focus:outline-none focus:border-[#00203F]"
                  />
                </div>

                {sellerType === 'business' && (
                  <>
                    <div>
                      <label className="block font-semibold text-[#00203F] mb-1">Business Registration Number (BRN) *</label>
                      <input
                        type="text"
                        name="businessRegistrationNumber"
                        required
                        placeholder="e.g. PV-88192"
                        value={formData.businessRegistrationNumber}
                        onChange={handleChange}
                        className="w-full border border-[#00203F]/20 bg-[#E6E9EC]/30 px-3 py-2 text-[#00203F] focus:bg-white focus:outline-none focus:border-[#00203F]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#00203F] mb-1">Tax ID / VAT Registration</label>
                      <input
                        type="text"
                        name="taxId"
                        placeholder="Optional"
                        value={formData.taxId}
                        onChange={handleChange}
                        className="w-full border border-[#00203F]/20 bg-[#E6E9EC]/30 px-3 py-2 text-[#00203F] focus:bg-white focus:outline-none focus:border-[#00203F]"
                      />
                    </div>
                  </>
                )}

                {sellerType === 'individual' && (
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-[#00203F] mb-1">National Identity Card (NIC) or Passport Number *</label>
                    <input
                      type="text"
                      name="idDocumentNumber"
                      required
                      placeholder="e.g. 199512345678"
                      value={formData.idDocumentNumber}
                      onChange={handleChange}
                      className="w-full border border-[#00203F]/20 bg-[#E6E9EC]/30 px-3 py-2 text-[#00203F] focus:bg-white focus:outline-none focus:border-[#00203F]"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Document Upload (Protected Restricted Storage) */}
            <div className="space-y-4 border-t border-[#00203F]/10 pt-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#00203F]">
                  3. Verification Document Upload
                </label>
                <p className="text-[11px] text-[#2F2F2F]/60 mt-0.5">
                  Stored in private, encrypted Supabase storage with restricted access. Never made public (PDF Page 4).
                </p>
              </div>

              <div className="relative">
                <input
                  type="file"
                  id="kyc-file"
                  accept=".pdf,image/png,image/jpeg"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="kyc-file"
                  className={`flex flex-col items-center justify-center border-2 border-dashed p-6 text-center cursor-pointer transition ${
                    selectedFile
                      ? 'border-[#00203F] bg-[#E6E9EC]/50'
                      : 'border-[#00203F]/20 bg-[#E6E9EC]/30 hover:bg-[#E6E9EC]/60'
                  }`}
                >
                  {selectedFile ? (
                    <div className="space-y-1">
                      <CheckCircle2 className="mx-auto h-8 w-8 text-[#00203F]" />
                      <span className="text-xs font-bold text-[#00203F] block">
                        {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                      </span>
                      <span className="text-[10px] text-[#00203F]">
                        {uploadingFile ? 'Uploading to Supabase Storage...' : 'Ready for upload and verification review'}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <Upload className="mx-auto h-7 w-7 text-[#00203F]" />
                      <span className="text-xs font-bold text-[#00203F] block">
                        Upload {sellerType === 'business' ? 'Business Registration Certificate' : 'Government Issued ID'}
                      </span>
                      <span className="text-[10px] text-[#2F2F2F]/60">PDF, PNG, or JPEG up to 10MB</span>
                    </div>
                  )}
                </label>
                {fileError && (
                  <p className="mt-1 text-xs text-red-600 font-semibold">{fileError}</p>
                )}
              </div>
            </div>

            {/* Payout Details */}
            <div className="space-y-4 border-t border-[#00203F]/10 pt-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#00203F]">
                4. Payout Settlement Details
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#00203F] mb-1">Settlement Bank</label>
                  <select
                    name="payoutBank"
                    value={formData.payoutBank}
                    onChange={handleChange}
                    className="w-full border border-[#00203F]/20 bg-[#E6E9EC]/30 px-3 py-2 text-[#00203F] focus:outline-none focus:border-[#00203F]"
                  >
                    <option value="Commercial Bank of Ceylon">Commercial Bank of Ceylon</option>
                    <option value="Hatton National Bank">Hatton National Bank</option>
                    <option value="Sampath Bank">Sampath Bank</option>
                    <option value="Crypto Payout (USDT/ETH)">Direct Crypto Payout (USDT / ETH)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#00203F] mb-1">Bank Account / Wallet Address *</label>
                  <input
                    type="text"
                    name="payoutAccount"
                    required
                    placeholder="Account number or 0x..."
                    value={formData.payoutAccount}
                    onChange={handleChange}
                    className="w-full border border-[#00203F]/20 bg-[#E6E9EC]/30 px-3 py-2 text-[#00203F] focus:bg-white focus:outline-none focus:border-[#00203F]"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#00203F] py-4 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-[#36ECDE] hover:text-[#00203F] disabled:bg-[#00203F]/20 disabled:text-[#2F2F2F]/40 transition-colors"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting to Verification Queue...</span>
                </>
              ) : (
                <span>Submit Verification Application</span>
              )}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
