'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User, SellerProfile } from '@/types';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';

interface AuthContextType {
  authUser: SupabaseAuthUser | null;
  userProfile: User | null;
  sellerProfile: SellerProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<SupabaseAuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchUserData = async (sbUser: SupabaseAuthUser) => {
    try {
      // 1. Fetch public.users profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', sbUser.id)
        .single();

      if (profile) {
        setUserProfile(profile as User);
      } else {
        // Fallback user profile derived from auth user metadata
        setUserProfile({
          id: sbUser.id,
          email: sbUser.email || '',
          full_name: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'Creator',
          role: 'customer',
          status: 'active',
          created_at: sbUser.created_at,
        });
      }

      // 2. Fetch public.seller_profiles if exists
      const { data: seller } = await supabase
        .from('seller_profiles')
        .select('*')
        .eq('id', sbUser.id)
        .single();

      if (seller) {
        setSellerProfile(seller as SellerProfile);
      } else {
        setSellerProfile(null);
      }
    } catch (err) {
      console.error('Error fetching user database profile:', err);
    }
  };

  const refreshProfile = async () => {
    if (authUser) {
      await fetchUserData(authUser);
    }
  };

  useEffect(() => {
    async function initAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setAuthUser(user);
          await fetchUserData(user);
        }
      } catch (err) {
        console.error('Initial auth check error:', err);
      } finally {
        setLoading(false);
      }
    }

    initAuth();

    // Listen to real Supabase auth state change events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setAuthUser(session.user);
          await fetchUserData(session.user);
        } else {
          setAuthUser(null);
          setUserProfile(null);
          setSellerProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        setAuthUser(data.user);
        await fetchUserData(data.user);
      }

      return {};
    } catch (err: any) {
      return { error: err?.message || 'Login failed' };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        // Insert user record into public.users
        try {
          await supabase.from('users').upsert({
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
            role: 'customer',
            status: 'active',
          });
        } catch (dbErr) {
          console.error('Error inserting into users table:', dbErr);
        }

        setAuthUser(data.user);
        await fetchUserData(data.user);
      }

      return {};
    } catch (err: any) {
      return { error: err?.message || 'Registration failed' };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/account` : undefined;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (err: any) {
      return { error: err?.message || 'Google sign in failed' };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setAuthUser(null);
      setUserProfile(null);
      setSellerProfile(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        userProfile,
        sellerProfile,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
