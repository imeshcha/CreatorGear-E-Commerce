'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const res = await signIn(email.trim(), password);
    setLoading(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      router.push('/account');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <Navbar />

      <main className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-neutral-200/90 bg-white p-8 sm:p-10 shadow-sm space-y-6">
          <div className="text-center">
            <span className="text-xl font-black tracking-tighter text-neutral-900 block">
              GEAR.
            </span>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-neutral-900">
              Welcome Back
            </h1>
            <p className="mt-1 text-xs text-neutral-500">
              Sign in to manage orders, addresses, and creator listings
            </p>
          </div>

          {errorMsg && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="creator@cinema.io"
                  className="w-full rounded-xl border border-neutral-300 bg-neutral-50 pl-9 pr-4 py-2.5 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900 transition"
                />
                <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-neutral-300 bg-neutral-50 pl-9 pr-4 py-2.5 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900 transition"
                />
                <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-neutral-800 disabled:bg-neutral-300 transition"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="border-t border-neutral-100 pt-4 text-center text-xs text-neutral-500">
            <span>Don't have an account yet? </span>
            <Link href="/register" className="font-bold text-neutral-900 hover:underline">
              Create Account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
