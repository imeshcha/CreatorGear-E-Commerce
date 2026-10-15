'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { isAdminEmail } from '@/lib/auth/admin';
import { createClient } from '@/lib/supabase/client';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  LogIn,
  LogOut,
  ArrowRight,
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
  Users,
  Store,
  Mail,
  Calendar,
  Star,
  CheckCircle2,
  Clock,
  KeyRound,
  Eye,
  X,
} from 'lucide-react';

interface AdminUserListItem {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone_number?: string;
  role: 'customer' | 'seller' | 'admin';
  status: 'active' | 'suspended' | 'banned';
  created_at: string;
  last_sign_in_at?: string;
  provider: string;
  seller_profile?: {
    store_name: string;
    slug: string;
    seller_type: 'individual' | 'business';
    is_verified: boolean;
    rating: number;
    review_count: number;
    completed_orders: number;
  } | null;
}

interface UserStats {
  totalUsers: number;
  customers: number;
  sellers: number;
  verifiedSellers: number;
  admins: number;
  googleUsers: number;
}

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
  const { authUser, userProfile, isAdmin, loading, signOut } = useAuth();
  const router = useRouter();

  // Authorize either by hardcoded/configured admin whitelist OR role='admin' in DB
  const isAuthorizedAdmin = Boolean(
    (authUser?.email && isAdminEmail(authUser.email)) ||
    isAdmin ||
    userProfile?.role === 'admin'
  );

  const [activeTab, setActiveTab] = useState<'users' | 'applications'>('users');

  // Users Directory State
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [usersLoading, setUsersLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'customer' | 'seller' | 'admin'>('all');
  const [userProviderFilter, setUserProviderFilter] = useState<'all' | 'google' | 'email'>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUserListItem | null>(null);

  // Seller Verification Applications State
  const [applications, setApplications] = useState<VerificationApp[]>([]);
  const [selectedApp, setSelectedApp] = useState<VerificationApp | null>(null);
  const [reviewNoteInput, setReviewNoteInput] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [appsLoading, setAppsLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Retrieve auth token for admin API calls
  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.access_token) {
        return {
          Authorization: `Bearer ${session.access_token}`,
        };
      }
    } catch (e) {
      console.error('Error acquiring auth session token:', e);
    }
    return {};
  };

  // Fetch all users
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/admin/users', { headers });
      if (res.status === 401 || res.status === 403) {
        console.warn('Unauthorized request to /api/admin/users');
        return;
      }
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
        setUserStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to query users from API:', err);
    } finally {
      setUsersLoading(false);
    }
  };

  // Fetch seller applications
  const fetchApplications = async () => {
    setAppsLoading(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/admin/applications', { headers });
      if (res.status === 401 || res.status === 403) {
        console.warn('Unauthorized request to /api/admin/applications');
        return;
      }
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
      setAppsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && authUser && isAuthorizedAdmin) {
      fetchUsers();
      fetchApplications();
    }
  }, [loading, authUser, isAuthorizedAdmin]);

  const handleAction = async (status: 'approved' | 'rejected' | 'more_information_required') => {
    if (!selectedApp) return;
    setProcessing(true);

    try {
      const notes =
        reviewNoteInput ||
        (status === 'approved'
          ? 'Verified identity & compliance documentation.'
          : 'Application review decision recorded.');

      const headers = await getAuthHeaders();
      const res = await fetch('/api/admin/applications/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
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
        reviewedBy: authUser?.email || 'Admin_Compliance',
        reviewedDate: new Date().toLocaleString(),
      };

      setSelectedApp(updated);
      setApplications((prev) => prev.map((app) => (app.id === selectedApp.id ? updated : app)));
      setActionSuccess(`Application #${selectedApp.id.substring(0, 8)} updated to ${status.toUpperCase()}`);
      setReviewNoteInput('');
      setTimeout(() => setActionSuccess(''), 4000);
      fetchUsers(); // Refresh users in case seller status changed
    } catch (err: any) {
      console.error('Error recording admin verification decision:', err);
      setActionSuccess(`Failed to record decision: ${err.message}`);
      setTimeout(() => setActionSuccess(''), 4000);
    } finally {
      setProcessing(false);
    }
  };

  // Filter users based on search, role, and provider
  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      u.full_name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.seller_profile?.store_name.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q);

    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    const matchesProvider = userProviderFilter === 'all' || u.provider === userProviderFilter;

    return matchesSearch && matchesRole && matchesProvider;
  });

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#E6E9EC] text-[#2F2F2F]">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-28 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center bg-white border border-[#00203F]/15 mb-4 shadow-xs">
            <Loader2 className="h-8 w-8 animate-spin text-[#00203F]" />
          </div>
          <h2 className="text-sm font-black uppercase tracking-wider text-[#00203F]">
            Verifying Administrator Credentials
          </h2>
          <p className="mt-1 text-xs text-[#2F2F2F]/70">
            Checking session integrity and platform security policies...
          </p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated State (Not Logged In)
  if (!authUser) {
    return (
      <div className="min-h-screen bg-[#E6E9EC] text-[#2F2F2F]">
        <Navbar />
        <div className="mx-auto max-w-lg px-4 py-24">
          <div className="border border-[#00203F]/20 bg-white p-8 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center bg-[#00203F] text-[#36ECDE] mb-6">
              <Lock className="h-7 w-7" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#00203F]/10 text-[#00203F] text-[10px] font-black uppercase tracking-wider mb-2">
              401 • Restricted Area
            </div>

            <h1 className="text-xl font-black text-[#00203F] uppercase tracking-wide">
              Administrator Sign In Required
            </h1>

            <p className="mt-3 text-xs leading-relaxed text-[#2F2F2F]/80">
              The CreatorGear administration dashboard and user directory are restricted to authorized platform personnel. You must be signed in with an authorized administrative account to access this portal.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="/login?redirect=/admin"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#00203F] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#36ECDE] hover:text-[#00203F] transition-colors shadow-xs"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In as Admin</span>
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center border border-[#00203F]/20 bg-white px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#00203F] hover:bg-[#E6E9EC] transition-colors"
              >
                <span>Storefront</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Unauthorized State (Logged In, but Not Admin)
  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-screen bg-[#E6E9EC] text-[#2F2F2F]">
        <Navbar />
        <div className="mx-auto max-w-xl px-4 py-24">
          <div className="border border-red-300 bg-white p-8 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center bg-red-600 text-white mb-6">
              <ShieldAlert className="h-7 w-7" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-wider mb-2">
              403 • Access Denied
            </div>

            <h1 className="text-xl font-black text-red-900 uppercase tracking-wide">
              Administrative Access Forbidden
            </h1>

            <div className="mt-3 bg-[#E6E9EC]/70 border border-[#00203F]/10 p-3">
              <span className="block text-[11px] font-bold text-[#00203F] uppercase tracking-wider">
                Current Authenticated Identity:
              </span>
              <span className="block text-xs font-mono text-[#2F2F2F] mt-0.5 truncate">
                {authUser.email}
              </span>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-[#2F2F2F]/80">
              Your account does not possess platform administrator privileges. This portal contains privileged customer databases, financial transaction ledgers, and compliance controls.
            </p>

            <p className="mt-2 text-xs text-[#2F2F2F]/60">
              If this is an error or you require administrator credentials, contact the primary platform owner at <span className="font-semibold text-[#00203F]">saimeshchathurak@gmail.com</span>.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  router.push('/login?redirect=/admin');
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#00203F] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#36ECDE] hover:text-[#00203F] transition-colors shadow-xs"
              >
                <LogOut className="h-4 w-4" />
                <span>Switch to Admin Account</span>
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center border border-[#00203F]/20 bg-white px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#00203F] hover:bg-[#E6E9EC] transition-colors"
              >
                <span>Return to Storefront</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authorized Admin Dashboard View
  return (
    <div className="min-h-screen bg-[#E6E9EC] text-[#2F2F2F]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#00203F]/15 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mb-1.5 bg-[#00203F] text-[#36ECDE] text-[10px] font-black uppercase tracking-wider">
              Control Panel
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[#00203F]">
              ADMINISTRATION & USER DIRECTORY
            </h1>
            <p className="text-xs text-[#2F2F2F]/70 mt-0.5">
              Manage platform accounts, customer directories, and seller compliance verification.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-white border border-[#00203F]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#00203F] shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active Administrator:</span>
                <span className="font-mono font-bold">{authUser.email}</span>
              </span>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center border border-[#00203F]/20 bg-white p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'users'
                  ? 'bg-[#00203F] text-white shadow-xs'
                  : 'text-[#00203F] hover:bg-[#E6E9EC]'
              }`}
            >
              <Users className="h-4 w-4 text-[#36ECDE]" />
              <span>Registered Users ({users.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('applications')}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'applications'
                  ? 'bg-[#00203F] text-white shadow-xs'
                  : 'text-[#00203F] hover:bg-[#E6E9EC]'
              }`}
            >
              <ShieldCheck className="h-4 w-4 text-[#36ECDE]" />
              <span>Seller Verification ({applications.filter((a) => a.status === 'pending').length} Pending)</span>
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {actionSuccess && (
          <div className="mb-6 border border-[#00203F]/20 bg-white p-3 text-xs font-bold text-[#00203F] shadow-xs">
            ✓ {actionSuccess}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 1: REGISTERED USERS DIRECTORY                             */}
        {/* ============================================================== */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="border border-[#00203F]/15 bg-white p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#2F2F2F]/60">
                    Total Users
                  </span>
                  <Users className="h-4 w-4 text-[#00203F]" />
                </div>
                <div className="mt-2 text-2xl font-black text-[#00203F]">
                  {userStats?.totalUsers || users.length}
                </div>
                <span className="text-[10px] text-[#2F2F2F]/60 mt-0.5 block">
                  All registered platform accounts
                </span>
              </div>

              <div className="border border-[#00203F]/15 bg-white p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#2F2F2F]/60">
                    Customers
                  </span>
                  <User className="h-4 w-4 text-[#00203F]" />
                </div>
                <div className="mt-2 text-2xl font-black text-[#00203F]">
                  {userStats?.customers || users.filter((u) => u.role === 'customer').length}
                </div>
                <span className="text-[10px] text-[#2F2F2F]/60 mt-0.5 block">
                  Buyers & gear shoppers
                </span>
              </div>

              <div className="border border-[#00203F]/15 bg-white p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#2F2F2F]/60">
                    Sellers
                  </span>
                  <Store className="h-4 w-4 text-[#00203F]" />
                </div>
                <div className="mt-2 text-2xl font-black text-[#00203F]">
                  {userStats?.sellers || users.filter((u) => u.role === 'seller').length}
                </div>
                <span className="text-[10px] text-[#2F2F2F]/60 mt-0.5 block">
                  {userStats?.verifiedSellers || 0} verified stores
                </span>
              </div>

              <div className="border border-[#00203F]/15 bg-white p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#2F2F2F]/60">
                    Google OAuth
                  </span>
                  <KeyRound className="h-4 w-4 text-[#00203F]" />
                </div>
                <div className="mt-2 text-2xl font-black text-[#00203F]">
                  {userStats?.googleUsers || users.filter((u) => u.provider === 'google').length}
                </div>
                <span className="text-[10px] text-[#2F2F2F]/60 mt-0.5 block">
                  Single Sign-On logins
                </span>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#00203F]/15 bg-white p-4 shadow-xs">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search by name, email, store name, or UUID..."
                  className="w-full border border-[#00203F]/20 bg-[#E6E9EC]/40 py-2 pl-9 pr-4 text-xs text-[#00203F] placeholder-[#2F2F2F]/50 focus:border-[#00203F] focus:bg-white focus:outline-none transition-all"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#00203F]/60" />
              </div>

              {/* Role Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-[#2F2F2F]/60 mr-1 hidden md:inline">
                  Role:
                </span>
                {(['all', 'customer', 'seller', 'admin'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setUserRoleFilter(r)}
                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                      userRoleFilter === r
                        ? 'bg-[#00203F] text-[#36ECDE]'
                        : 'border border-[#00203F]/15 bg-[#E6E9EC] text-[#00203F] hover:bg-white'
                    }`}
                  >
                    {r === 'all' ? 'All Roles' : `${r}s`}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={fetchUsers}
                  disabled={usersLoading}
                  className="inline-flex items-center gap-1.5 border border-[#00203F]/20 bg-white px-3 py-1.5 text-xs font-bold text-[#00203F] hover:bg-[#E6E9EC] transition-colors ml-2 shadow-2xs"
                  title="Refresh user records from Supabase"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${usersLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Users Data Table */}
            <div className="border border-[#00203F]/15 bg-white shadow-xs overflow-hidden">
              {usersLoading ? (
                <div className="py-20 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#00203F]" />
                  <p className="mt-3 text-xs font-semibold text-[#2F2F2F]/70">
                    Querying real-time users from Supabase Auth & PostgreSQL...
                  </p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="py-16 text-center text-xs text-[#2F2F2F]/70">
                  <User className="mx-auto h-10 w-10 text-[#00203F]/30 mb-2" />
                  <p className="font-bold text-[#00203F]">No users found matching your search filters.</p>
                  <button
                    onClick={() => {
                      setUserSearch('');
                      setUserRoleFilter('all');
                      setUserProviderFilter('all');
                    }}
                    className="mt-3 bg-[#00203F] text-white px-3.5 py-1.5 text-xs font-bold uppercase hover:bg-[#36ECDE] hover:text-[#00203F] transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#00203F]/15 bg-[#E6E9EC]/70 text-[#00203F] uppercase tracking-wider text-[10px] font-black">
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Store / Business Details</th>
                        <th className="py-3 px-4">Auth Provider</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Joined Date</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#00203F]/10">
                      {filteredUsers.map((u) => (
                        <tr
                          key={u.id}
                          className="hover:bg-[#E6E9EC]/40 transition-colors cursor-pointer"
                          onClick={() => setSelectedUser(u)}
                        >
                          {/* User Column */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center bg-[#00203F] text-[#36ECDE] shrink-0 font-bold overflow-hidden border border-[#00203F]/20">
                                {u.avatar_url ? (
                                  <img
                                    src={u.avatar_url}
                                    alt={u.full_name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  (u.full_name || u.email)[0].toUpperCase()
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-[#00203F] truncate">
                                  {u.full_name}
                                </div>
                                <div className="text-[11px] text-[#2F2F2F]/60 truncate font-mono">
                                  {u.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Role Column */}
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                                u.role === 'seller'
                                  ? 'bg-[#00203F] text-[#36ECDE]'
                                  : u.role === 'admin'
                                  ? 'bg-[#36ECDE] text-[#00203F]'
                                  : 'bg-[#E6E9EC] text-[#00203F] border border-[#00203F]/20'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>

                          {/* Store Details Column */}
                          <td className="py-3 px-4">
                            {u.seller_profile ? (
                              <div>
                                <div className="flex items-center gap-1.5 font-bold text-[#00203F]">
                                  <span>{u.seller_profile.store_name}</span>
                                  {u.seller_profile.is_verified && (
                                    <span title="Verified Seller">
                                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-[#2F2F2F]/60 mt-0.5 flex items-center gap-2">
                                  <span>★ {u.seller_profile.rating.toFixed(1)}</span>
                                  <span>•</span>
                                  <span>{u.seller_profile.completed_orders} orders</span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-[#2F2F2F]/40 text-[11px] italic">
                                Regular Buyer Account
                              </span>
                            )}
                          </td>

                          {/* Auth Provider Column */}
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                u.provider === 'google'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-[#E6E9EC] text-[#00203F]'
                              }`}
                            >
                              {u.provider === 'google' ? 'Google SSO' : 'Email/Pass'}
                            </span>
                          </td>

                          {/* Status Column */}
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase ${
                                u.status === 'active'
                                  ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                                  : 'text-red-700 bg-red-50 border border-red-200'
                              }`}
                            >
                              {u.status}
                            </span>
                          </td>

                          {/* Joined Date */}
                          <td className="py-3 px-4 text-[#2F2F2F]/70 text-[11px]">
                            {new Date(u.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </td>

                          {/* Action Column */}
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUser(u);
                              }}
                              className="inline-flex items-center gap-1 border border-[#00203F]/20 bg-white px-2.5 py-1 text-[11px] font-bold text-[#00203F] hover:bg-[#00203F] hover:text-[#36ECDE] transition-colors"
                            >
                              <Eye className="h-3 w-3" />
                              <span>Inspect</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* User Details Slide-out / Modal */}
            {selectedUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
                <div className="w-full max-w-lg border border-[#00203F] bg-white p-6 shadow-2xl relative space-y-4">
                  <div className="flex items-start justify-between border-b border-[#00203F]/15 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center bg-[#00203F] text-[#36ECDE] font-black text-lg overflow-hidden">
                        {selectedUser.avatar_url ? (
                          <img
                            src={selectedUser.avatar_url}
                            alt={selectedUser.full_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          (selectedUser.full_name || selectedUser.email)[0].toUpperCase()
                        )}
                      </div>
                      <div>
                        <h3 className="text-base font-black text-[#00203F]">
                          {selectedUser.full_name}
                        </h3>
                        <p className="text-xs text-[#2F2F2F]/60 font-mono">
                          {selectedUser.email}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedUser(null)}
                      className="p-1 text-[#2F2F2F]/50 hover:text-[#00203F]"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-[#2F2F2F]/60 block text-[10px] uppercase font-bold">
                        Supabase User UUID:
                      </span>
                      <span className="font-mono text-[#00203F] text-[11px] bg-[#E6E9EC] px-2 py-0.5 block truncate">
                        {selectedUser.id}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[#2F2F2F]/60 block text-[10px] uppercase font-bold">
                          Assigned Role:
                        </span>
                        <span className="font-black uppercase text-[#00203F]">
                          {selectedUser.role}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#2F2F2F]/60 block text-[10px] uppercase font-bold">
                          Authentication Method:
                        </span>
                        <span className="font-semibold text-[#00203F]">
                          {selectedUser.provider === 'google' ? 'Google OAuth SSO' : 'Email & Password'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[#2F2F2F]/60 block text-[10px] uppercase font-bold">
                          Account Status:
                        </span>
                        <span className="font-bold text-emerald-700 capitalize">
                          {selectedUser.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#2F2F2F]/60 block text-[10px] uppercase font-bold">
                          Registration Date:
                        </span>
                        <span className="text-[#2F2F2F]">
                          {new Date(selectedUser.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {selectedUser.last_sign_in_at && (
                      <div>
                        <span className="text-[#2F2F2F]/60 block text-[10px] uppercase font-bold">
                          Last Authentication Activity:
                        </span>
                        <span className="text-[#2F2F2F]">
                          {new Date(selectedUser.last_sign_in_at).toLocaleString()}
                        </span>
                      </div>
                    )}

                    {/* Seller Details if applicable */}
                    {selectedUser.seller_profile && (
                      <div className="mt-4 border-t border-[#00203F]/15 pt-3 space-y-2 bg-[#E6E9EC]/50 p-3">
                        <span className="text-[10px] font-black uppercase text-[#00203F] block">
                          Verified Seller Store Information:
                        </span>
                        <div className="grid grid-cols-2 gap-3 text-[11px]">
                          <div>
                            <span className="text-[#2F2F2F]/60 block text-[10px]">Store Name:</span>
                            <span className="font-bold text-[#00203F]">
                              {selectedUser.seller_profile.store_name}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#2F2F2F]/60 block text-[10px]">KYC Verification:</span>
                            <span
                              className={`font-bold ${
                                selectedUser.seller_profile.is_verified
                                  ? 'text-emerald-700'
                                  : 'text-amber-700'
                              }`}
                            >
                              {selectedUser.seller_profile.is_verified ? 'Verified Store' : 'Pending Verification'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#2F2F2F]/60 block text-[10px]">Seller Rating:</span>
                            <span className="font-bold text-[#00203F]">
                              ★ {selectedUser.seller_profile.rating.toFixed(2)} ({selectedUser.seller_profile.review_count} reviews)
                            </span>
                          </div>
                          <div>
                            <span className="text-[#2F2F2F]/60 block text-[10px]">Fulfillment:</span>
                            <span className="font-bold text-[#00203F]">
                              {selectedUser.seller_profile.completed_orders} Orders Completed
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#00203F]/15 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedUser(null)}
                      className="bg-[#00203F] text-white px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#36ECDE] hover:text-[#00203F] transition-colors"
                    >
                      Close Profile
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: SELLER VERIFICATION QUEUE                               */}
        {/* ============================================================== */}
        {activeTab === 'applications' && (
          <div>
            {appsLoading ? (
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
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-[#00203F]">
                      Submitted Applications Queue ({applications.length})
                    </h2>
                    <button
                      type="button"
                      onClick={fetchApplications}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#00203F] hover:text-[#36ECDE]"
                    >
                      <RefreshCw className={`h-3 w-3 ${appsLoading ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </button>
                  </div>

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
                              className={`px-2 py-0.2 text-[10px] font-bold uppercase ${
                                app.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : app.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {app.status}
                            </span>
                          </div>
                          <div
                            className={`font-semibold mt-1 ${
                              selectedApp?.id === app.id ? 'text-white' : 'text-[#00203F]'
                            }`}
                          >
                            {app.storeName} ({app.legalName})
                          </div>
                          <div
                            className={`text-[11px] mt-0.5 ${
                              selectedApp?.id === app.id ? 'text-[#36ECDE]' : 'text-[#2F2F2F]/60'
                            }`}
                          >
                            Submitted: {app.submittedDate}
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`inline-block px-2 py-0.5 text-[10px] uppercase font-bold ${
                              app.sellerType === 'business'
                                ? 'border border-blue-300 text-blue-800 bg-blue-50'
                                : 'border border-neutral-300 text-neutral-700 bg-neutral-100'
                            }`}
                          >
                            {app.sellerType}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Application Inspection & Decision Panel (Right) */}
                {selectedApp && (
                  <div className="lg:col-span-5 border border-[#00203F]/15 bg-white p-5 space-y-5 shadow-xs">
                    <div className="border-b border-[#00203F]/10 pb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F2F2F]/60">
                        Inspecting Application
                      </span>
                      <h3 className="text-base font-black text-[#00203F]">
                        {selectedApp.storeName}
                      </h3>
                      <p className="text-xs text-[#2F2F2F]/70">
                        Legal Registrant: {selectedApp.legalName}
                      </p>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-[#2F2F2F]/60 block text-[11px]">Seller Classification:</span>
                        <span className="font-medium text-[#2F2F2F] capitalize">
                          {selectedApp.sellerType === 'business' ? 'Registered Business' : 'Individual Creator'}
                        </span>
                      </div>

                      {selectedApp.brn && (
                        <div>
                          <span className="text-[#2F2F2F]/60 block text-[11px]">
                            Business Registration Number (BRN):
                          </span>
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
                        <span className="text-[#2F2F2F]/60 block text-[11px]">
                          Identity Document Verification:
                        </span>
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
                          <span className="text-[#2F2F2F]/60 block text-[10px] font-bold uppercase">
                            Audit Review Notes:
                          </span>
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
          </div>
        )}
      </main>
    </div>
  );
}
