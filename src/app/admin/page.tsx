'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { createClient } from '@/lib/supabase/client';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  User,
  Building2,
  FileText,
  DollarSign,
  Package,
  Loader2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface VerificationApp {
  id: string;
  userId: string;
  legalName: string;
  storeName: string;
  sellerType: 'individual' | 'business';
  submittedDate: string;
  idDocument: string;
  brn?: string;
  taxId?: string;
  phone?: string;
  status: 'pending' | 'approved' | 'rejected' | 'more_information_required';
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedDate?: string;
}

export default function AdminDashboardPage() {
  const [applications, setApplications] = useState<VerificationApp[]>([]);
  const [selectedApp, setSelectedApp] = useState<VerificationApp | null>(null);
  const [reviewNoteInput, setReviewNoteInput] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const supabase = createClient();

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/applications');
      const data = await res.json();

      if (data.applications) {
        const mapped: VerificationApp[] = data.applications.map((item: any) => ({
          id: item.id,
          userId: item.user_id,
          legalName: item.legal_name,
          storeName: item.business_name || 'Individual Seller',
          sellerType: item.seller_type,
          submittedDate: new Date(item.created_at).toLocaleString(),
          idDocument: item.id_document_url || 'Identity_Verification_Document.pdf',
          brn: item.business_registration_number,
          taxId: item.tax_id,
          phone: item.phone_number,
          status: item.verification_status,
          reviewNotes: item.review_notes,
          reviewedBy: item.reviewed_by ? 'Admin_Compliance' : undefined,
          reviewedDate: item.reviewed_date ? new Date(item.reviewed_date).toLocaleString() : undefined,
        }));
        setApplications(mapped);
        if (mapped.length > 0) {
          setSelectedApp(mapped[0]);
        } else {
          setSelectedApp(null);
        }
      }
    } catch (err) {
      console.error('Failed to query applications from database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleAction = async (status: 'approved' | 'rejected' | 'more_information_required') => {
    if (!selectedApp) return;
    setProcessing(true);

    try {
      const notes = reviewNoteInput || (status === 'approved' ? 'Verified identity & compliance documentation.' : 'Application review decision recorded.');

      const res = await fetch('/api/admin/applications/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: selectedApp.id,
          status,
          notes,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Failed to update application');
      }

      const updated: VerificationApp = {
        ...selectedApp,
        status,
        reviewNotes: notes,
        reviewedBy: 'Admin_Compliance',
        reviewedDate: new Date().toLocaleString(),
      };

      setSelectedApp(updated);
      setApplications(prev => prev.map(app => (app.id === selectedApp.id ? updated : app)));
      setActionSuccess(`Application #${selectedApp.id.substring(0, 8)} updated to ${status.toUpperCase()}`);
      setReviewNoteInput('');
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err: any) {
      console.error('Error recording admin verification decision:', err);
      setActionSuccess(`Failed to record decision: ${err.message}`);
      setTimeout(() => setActionSuccess(''), 4000);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E6E9EC]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#00203F]/15 pb-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#00203F]">
              SELLER VERIFICATION MANAGEMENT
            </h1>
          </div>

          {/* Quick Metrics & Refresh */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchApplications}
              disabled={loading}
              className="inline-flex items-center gap-1.5 border border-[#00203F]/20 bg-white px-3 py-2 text-xs font-semibold text-[#00203F] hover:bg-[#E6E9EC] transition-colors shadow-2xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Queue</span>
            </button>

            <div className="border border-[#00203F]/15 bg-white px-3.5 py-2 text-xs">
              <span className="text-[#2F2F2F]/60 block text-[10px]">Pending Queue</span>
              <span className="font-bold text-[#00203F]">
                {applications.filter(a => a.status === 'pending').length} Applications
              </span>
            </div>
            <div className="border border-[#00203F]/15 bg-white px-3.5 py-2 text-xs">
              <span className="text-[#2F2F2F]/60 block text-[10px]">Verified Badges</span>
              <span className="font-bold text-[#00203F]">
                {applications.filter(a => a.status === 'approved').length} Active
              </span>
            </div>
          </div>
        </div>

        {actionSuccess && (
          <div className="mb-6 border border-[#00203F]/20 bg-white p-3 text-xs font-semibold text-[#00203F]">
            ✓ {actionSuccess}
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#00203F]" />
            <p className="mt-3 text-xs font-semibold text-[#2F2F2F]/70">
              Connecting to Supabase verification database...
            </p>
          </div>
        ) : applications.length === 0 ? (
          <div className="border border-[#00203F]/15 bg-white p-16 text-center space-y-4 shadow-xs">
            <ShieldCheck className="mx-auto h-12 w-12 text-[#00203F]/30" />
            <h2 className="text-lg font-bold text-[#00203F]">
              Verification Queue is Empty
            </h2>
            <p className="text-xs text-[#2F2F2F]/70 max-w-md mx-auto">
              No seller verification applications are currently awaiting review. When users complete the onboarding process at{' '}
              <span className="font-mono text-[#00203F] font-semibold">/seller/apply</span>, their KYC documents will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Applications Table (Left) */}
            <div className="lg:col-span-7 border border-[#00203F]/15 bg-white p-5 shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#00203F] mb-4">
                Submitted Applications Queue ({applications.length})
              </h2>

              <div className="divide-y divide-[#00203F]/10 overflow-x-auto text-xs">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`p-3.5 cursor-pointer transition flex items-center justify-between gap-3 ${
                      selectedApp?.id === app.id
                        ? 'bg-[#00203F] text-white'
                        : 'hover:bg-[#E6E9EC]/50 text-[#00203F]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[11px] truncate max-w-[140px]">
                          {app.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 uppercase ${
                            app.status === 'approved'
                              ? 'bg-[#36ECDE]/20 text-[#00203F] border border-[#36ECDE]/40'
                              : app.status === 'pending'
                              ? 'bg-[#E6E9EC] text-[#00203F] border border-[#00203F]/15'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {app.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <p className={`font-bold mt-1 ${selectedApp?.id === app.id ? 'text-white' : 'text-[#00203F]'}`}>
                        {app.storeName}
                      </p>
                      <p className={`text-[11px] ${selectedApp?.id === app.id ? 'text-[#36ECDE]' : 'text-[#2F2F2F]/60'}`}>
                        {app.legalName} • {app.sellerType === 'business' ? 'Registered Business' : 'Individual Creator'}
                      </p>
                    </div>

                    <div className="text-right text-[11px]">
                      <span className={selectedApp?.id === app.id ? 'text-white/70' : 'text-[#2F2F2F]/50'}>
                        {app.submittedDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Detail & Actions Card (Right) */}
            {selectedApp && (
              <div className="lg:col-span-5 border border-[#00203F]/15 bg-white p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-[#00203F]/10 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#2F2F2F]/60">
                      Audit Review Panel
                    </span>
                    <h3 className="text-base font-black text-[#00203F] font-mono">
                      #{selectedApp.id.substring(0, 13)}
                    </h3>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-1 uppercase ${
                      selectedApp.status === 'approved'
                        ? 'bg-[#36ECDE]/20 text-[#00203F] border border-[#36ECDE]/40'
                        : selectedApp.status === 'pending'
                        ? 'bg-[#E6E9EC] text-[#00203F] border border-[#00203F]/15'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {selectedApp.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Data Fields */}
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[#2F2F2F]/60 block text-[11px]">Store Display Name:</span>
                    <span className="font-bold text-[#00203F]">{selectedApp.storeName}</span>
                  </div>

                  <div>
                    <span className="text-[#2F2F2F]/60 block text-[11px]">Legal Identity / Representative:</span>
                    <span className="font-semibold text-[#00203F]">{selectedApp.legalName}</span>
                  </div>

                  {selectedApp.phone && (
                    <div>
                      <span className="text-[#2F2F2F]/60 block text-[11px]">Contact Phone:</span>
                      <span className="font-medium text-[#2F2F2F]">{selectedApp.phone}</span>
                    </div>
                  )}

                  <div>
                    <span className="text-[#2F2F2F]/60 block text-[11px]">Seller Classification:</span>
                    <span className="font-medium text-[#2F2F2F] capitalize">
                      {selectedApp.sellerType === 'business' ? 'Registered Business' : 'Individual Creator'}
                    </span>
                  </div>

                  {selectedApp.brn && (
                    <div>
                      <span className="text-[#2F2F2F]/60 block text-[11px]">Business Registration Number (BRN):</span>
                      <span className="font-mono font-semibold text-[#00203F]">{selectedApp.brn}</span>
                    </div>
                  )}

                  {selectedApp.taxId && (
                    <div>
                      <span className="text-[#2F2F2F]/60 block text-[11px]">Tax Identification Number:</span>
                      <span className="font-mono font-semibold text-[#00203F]">{selectedApp.taxId}</span>
                    </div>
                  )}

                  <div>
                    <span className="text-[#2F2F2F]/60 block text-[11px]">Identity Document Verification:</span>
                    <div className="mt-1 flex items-center justify-between border border-[#00203F]/15 bg-[#E6E9EC] p-2.5 text-[#00203F]">
                      <span className="flex items-center gap-1.5 font-mono text-[11px] truncate max-w-[200px]">
                        <FileText className="h-4 w-4 text-[#00203F] shrink-0" />
                        <span className="truncate">{selectedApp.idDocument}</span>
                      </span>
                      <span className="text-[10px] font-bold text-[#00203F] bg-white px-2 py-0.5 border border-[#00203F]/15">
                        Secure Storage
                      </span>
                    </div>
                  </div>

                  {selectedApp.reviewNotes && (
                    <div className="bg-[#E6E9EC]/50 p-3 text-[#2F2F2F]/80">
                      <span className="text-[#2F2F2F]/60 block text-[10px] font-bold uppercase">Audit Review Notes:</span>
                      <p className="mt-0.5">{selectedApp.reviewNotes}</p>
                      {selectedApp.reviewedDate && (
                        <p className="mt-1 text-[10px] text-[#2F2F2F]/60">
                          Reviewed on {selectedApp.reviewedDate}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 border-t border-[#00203F]/10 pt-4">
                  <label className="block text-xs font-semibold text-[#00203F]">
                    Compliance Review Notes / Decision Rationale:
                  </label>
                  <textarea
                    rows={2}
                    value={reviewNoteInput}
                    onChange={(e) => setReviewNoteInput(e.target.value)}
                    placeholder="Record verification decision rationale or required documentation..."
                    className="w-full border border-[#00203F]/20 bg-[#E6E9EC]/30 p-2.5 text-xs text-[#00203F] focus:outline-none focus:bg-white focus:border-[#00203F]"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={processing}
                      onClick={() => handleAction('approved')}
                      className="inline-flex items-center justify-center gap-1.5 bg-[#00203F] py-2.5 text-xs font-bold text-white hover:bg-[#36ECDE] hover:text-[#00203F] shadow-xs transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Approve & Grant Badge</span>
                    </button>

                    <button
                      type="button"
                      disabled={processing}
                      onClick={() => handleAction('rejected')}
                      className="inline-flex items-center justify-center gap-1.5 border border-red-200 bg-red-50 py-2.5 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Reject Application</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={processing}
                    onClick={() => handleAction('more_information_required')}
                    className="w-full inline-flex items-center justify-center gap-1 border border-[#00203F]/20 py-2 text-xs font-semibold text-[#00203F] hover:bg-[#E6E9EC] transition-colors disabled:opacity-50"
                  >
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>Request Additional Information</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
