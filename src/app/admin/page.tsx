'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
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
  status: 'pending' | 'approved' | 'rejected' | 'more_info_required';
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedDate?: string;
}

const INITIAL_APPS: VerificationApp[] = [
  {
    id: 'APP-9201',
    userId: 'usr-alex-01',
    legalName: 'Alex Robertson',
    storeName: 'Alex Photography & Film',
    sellerType: 'individual',
    submittedDate: '2026-10-10 14:32 UTC',
    idDocument: 'NIC-928173612-verified.pdf',
    status: 'approved',
    reviewNotes: 'Identity confirmed against national registry. Payout verified.',
    reviewedBy: 'Admin_Super',
    reviewedDate: '2026-10-10 16:00 UTC',
  },
  {
    id: 'APP-9202',
    userId: 'usr-cinegear-02',
    legalName: 'CineGear Pro Ltd',
    storeName: 'CineGear Pro Store',
    sellerType: 'business',
    submittedDate: '2026-10-09 11:20 UTC',
    idDocument: 'Business_Certificate_PV98231.pdf',
    brn: 'PV-98231',
    status: 'approved',
    reviewNotes: 'Authorized Sony & Canon dealership papers certified.',
    reviewedBy: 'Admin_Super',
    reviewedDate: '2026-10-09 13:45 UTC',
  },
  {
    id: 'APP-9203',
    userId: 'usr-kasun-03',
    legalName: 'Kasun Jayawardena',
    storeName: 'Kasun Creative Tech',
    sellerType: 'individual',
    submittedDate: '2026-10-11 08:14 UTC',
    idDocument: 'Gov_Passport_Scan_78912.pdf',
    status: 'pending',
  },
];

export default function AdminDashboardPage() {
  const [applications, setApplications] = useState<VerificationApp[]>(INITIAL_APPS);
  const [selectedApp, setSelectedApp] = useState<VerificationApp | null>(applications[2]);
  const [reviewNoteInput, setReviewNoteInput] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const handleAction = (status: 'approved' | 'rejected' | 'more_info_required') => {
    if (!selectedApp) return;

    setApplications(prev =>
      prev.map(app => {
        if (app.id === selectedApp.id) {
          const updated = {
            ...app,
            status,
            reviewNotes: reviewNoteInput || (status === 'approved' ? 'Verified by Admin' : 'Reason recorded'),
            reviewedBy: 'Admin_Compliance',
            reviewedDate: new Date().toISOString(),
          };
          setSelectedApp(updated);
          return updated;
        }
        return app;
      })
    );

    setActionSuccess(`Application ${selectedApp.id} marked as ${status.toUpperCase()}`);
    setReviewNoteInput('');
    setTimeout(() => setActionSuccess(''), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-1">
              Admin Compliance Console
            </div>
            <h1 className="text-2xl font-black tracking-tight text-neutral-900">
              SELLER VERIFICATION MANAGEMENT
            </h1>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs">
              <span className="text-neutral-400 block text-[10px]">Pending Queue</span>
              <span className="font-bold text-amber-600">
                {applications.filter(a => a.status === 'pending').length} Applications
              </span>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs">
              <span className="text-neutral-400 block text-[10px]">Verified Badges</span>
              <span className="font-bold text-emerald-600">
                {applications.filter(a => a.status === 'approved').length} Active
              </span>
            </div>
          </div>
        </div>

        {actionSuccess && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">
            ✓ {actionSuccess}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Applications Table (Left) */}
          <div className="lg:col-span-7 rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-4">
              Submitted Applications Queue
            </h2>

            <div className="divide-y divide-neutral-100 overflow-x-auto text-xs">
              {applications.map((app) => (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-3.5 rounded-xl cursor-pointer transition flex items-center justify-between gap-3 ${
                    selectedApp?.id === app.id
                      ? 'bg-neutral-900 text-white'
                      : 'hover:bg-neutral-50 text-neutral-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[11px]">{app.id}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.2 rounded-full uppercase ${
                          app.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <p className={`font-bold mt-1 ${selectedApp?.id === app.id ? 'text-white' : 'text-neutral-900'}`}>
                      {app.storeName}
                    </p>
                    <p className={`text-[11px] ${selectedApp?.id === app.id ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      {app.legalName} • {app.sellerType === 'business' ? 'B2C Business' : 'C2C Individual'}
                    </p>
                  </div>

                  <div className="text-right text-[11px]">
                    <span className={selectedApp?.id === app.id ? 'text-neutral-400' : 'text-neutral-400'}>
                      {app.submittedDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Application Detail & Actions Card (Right) */}
          {selectedApp && (
            <div className="lg:col-span-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Audit Review Panel
                  </span>
                  <h3 className="text-base font-black text-neutral-900">
                    Application #{selectedApp.id}
                  </h3>
                </div>

                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                    selectedApp.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedApp.status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {selectedApp.status}
                </span>
              </div>

              {/* Data Fields Specified in PDF Page 4 */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-neutral-400 block text-[11px]">Store Display Name:</span>
                  <span className="font-bold text-neutral-900">{selectedApp.storeName}</span>
                </div>

                <div>
                  <span className="text-neutral-400 block text-[11px]">Legal Identity / Representative:</span>
                  <span className="font-semibold text-neutral-800">{selectedApp.legalName}</span>
                </div>

                <div>
                  <span className="text-neutral-400 block text-[11px]">Seller Classification:</span>
                  <span className="font-medium text-neutral-800 capitalize">
                    {selectedApp.sellerType === 'business' ? 'Business Seller (B2C)' : 'Individual Creator (C2C)'}
                  </span>
                </div>

                {selectedApp.brn && (
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Business Registration Number (BRN):</span>
                    <span className="font-mono font-semibold text-neutral-900">{selectedApp.brn}</span>
                  </div>
                )}

                <div>
                  <span className="text-neutral-400 block text-[11px]">Identity Document Verification:</span>
                  <div className="mt-1 flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 p-2 text-neutral-700">
                    <span className="flex items-center gap-1.5 font-mono text-[11px]">
                      <FileText className="h-4 w-4 text-neutral-500" />
                      {selectedApp.idDocument}
                    </span>
                    <span className="text-[10px] font-bold text-neutral-500">Restricted Access</span>
                  </div>
                </div>

                {selectedApp.reviewNotes && (
                  <div className="rounded-lg bg-neutral-50 p-3 text-neutral-600">
                    <span className="text-neutral-400 block text-[10px] font-bold uppercase">Audit Review Notes:</span>
                    <p className="mt-0.5">{selectedApp.reviewNotes}</p>
                    <p className="mt-1 text-[10px] text-neutral-400">
                      By {selectedApp.reviewedBy} on {selectedApp.reviewedDate}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons as Required by PDF Page 4 */}
              <div className="space-y-3 border-t border-neutral-100 pt-4">
                <label className="block text-xs font-semibold text-neutral-700">
                  Compliance Review Notes / Decision Rationale:
                </label>
                <textarea
                  rows={2}
                  value={reviewNoteInput}
                  onChange={(e) => setReviewNoteInput(e.target.value)}
                  placeholder="Record verification decision or required documents..."
                  className="w-full rounded-lg border border-neutral-300 bg-neutral-50 p-2.5 text-xs text-neutral-900 focus:outline-none focus:bg-white focus:border-neutral-900"
                />

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleAction('approved')}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm transition"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Approve & Grant Badge</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAction('rejected')}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 py-2.5 text-xs font-bold text-red-700 hover:bg-red-100 transition"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Reject Application</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleAction('more_info_required')}
                  className="w-full inline-flex items-center justify-center gap-1 rounded-xl border border-neutral-200 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition"
                >
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Request Additional Information</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
