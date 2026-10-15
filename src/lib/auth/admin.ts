import { getAdminSupabase } from '@/lib/supabase/admin';

// Default authorized administrator emails (hardened fallback)
export const DEFAULT_ADMIN_EMAILS = [
  'saimeshchathurak@gmail.com',
  'saimeshchathurak1@gmail.com',
];

/**
 * Returns a normalized list of all authorized administrator emails.
 */
export function getAdminEmails(): string[] {
  const envAdmins =
    process.env.ADMIN_EMAILS ||
    process.env.NEXT_PUBLIC_ADMIN_EMAILS ||
    '';

  const fromEnv = envAdmins
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const combined = Array.from(
    new Set([...DEFAULT_ADMIN_EMAILS.map((e) => e.toLowerCase()), ...fromEnv])
  );

  return combined;
}

/**
 * Checks if a given email is in the authorized administrator list.
 */
export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();
  return getAdminEmails().includes(cleanEmail);
}

/**
 * Extracts a Supabase access token from either the Authorization header or cookies.
 */
function extractTokenFromRequest(request: Request): string | null {
  // 1. Check Authorization Bearer header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    const bearerToken = authHeader.substring(7).trim();
    if (bearerToken) return bearerToken;
  }

  // 2. Check Cookie header
  const cookieHeader = request.headers.get('cookie') || '';
  if (!cookieHeader) return null;

  // Supabase SSR uses cookies named `sb-<project-ref>-auth-token` or chunked `.0`, `.1`
  const cookies = cookieHeader.split(';').map((c) => c.trim());

  // Check for chunked cookies
  const chunked: { [key: number]: string } = {};
  let baseToken = '';

  for (const cookie of cookies) {
    const [name, ...valParts] = cookie.split('=');
    const val = valParts.join('=');
    if (!name || !val) continue;

    // Check for chunked pattern sb-*-auth-token.N
    const chunkMatch = name.match(/sb-[a-zA-Z0-9]+-auth-token\.(\d+)/);
    if (chunkMatch) {
      chunked[parseInt(chunkMatch[1], 10)] = val;
      continue;
    }

    // Check for standard single cookie
    if (name.match(/sb-[a-zA-Z0-9]+-auth-token$/)) {
      baseToken = val;
    }
  }

  let rawCookieVal = baseToken;
  const chunkKeys = Object.keys(chunked).map(Number).sort((a, b) => a - b);
  if (chunkKeys.length > 0) {
    rawCookieVal = chunkKeys.map((k) => chunked[k]).join('');
  }

  if (rawCookieVal) {
    try {
      const decoded = decodeURIComponent(rawCookieVal);
      // Supabase cookies might be "base64-..." or JSON string
      if (decoded.startsWith('base64-')) {
        const jsonStr = Buffer.from(decoded.substring(7), 'base64').toString('utf-8');
        const parsed = JSON.parse(jsonStr);
        return Array.isArray(parsed) ? parsed[0] : (parsed.access_token || parsed);
      } else if (decoded.startsWith('[') || decoded.startsWith('{')) {
        const parsed = JSON.parse(decoded);
        return Array.isArray(parsed) ? parsed[0] : (parsed.access_token || parsed);
      }
      return decoded;
    } catch {
      // If parsing fails, return raw value
      return rawCookieVal;
    }
  }

  return null;
}

export interface AdminAuthResult {
  authorized: boolean;
  user?: any;
  email?: string;
  userId?: string;
  error?: string;
  status: number;
}

/**
 * Server-side verification for admin API endpoints.
 * Validates the caller is signed in AND is an authorized administrator.
 */
export async function verifyAdminRequest(request: Request): Promise<AdminAuthResult> {
  const token = extractTokenFromRequest(request);

  if (!token) {
    return {
      authorized: false,
      error: 'Authentication required. Missing administrative credentials.',
      status: 401,
    };
  }

  try {
    const supabase = getAdminSupabase();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser(token);

    if (authErr || !user) {
      return {
        authorized: false,
        error: 'Invalid or expired administrative session. Please sign in again.',
        status: 401,
      };
    }

    const email = user.email?.toLowerCase();
    const isWhitelisted = isAdminEmail(email);

    // Also check database role in public.users
    const { data: dbUser } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    const isRoleAdmin = dbUser?.role === 'admin';

    if (!isWhitelisted && !isRoleAdmin) {
      return {
        authorized: false,
        email: user.email,
        userId: user.id,
        error: `Access Denied. Account (${user.email}) does not have platform administrator privileges.`,
        status: 403,
      };
    }

    // Auto-promote whitelisted user to admin role in database if not already done
    if (isWhitelisted && dbUser?.role !== 'admin') {
      try {
        await supabase
          .from('users')
          .update({ role: 'admin' })
          .eq('id', user.id);
      } catch (updateErr) {
        console.error('Error auto-syncing admin role:', updateErr);
      }
    }

    return {
      authorized: true,
      user,
      email: user.email,
      userId: user.id,
      status: 200,
    };
  } catch (err: any) {
    console.error('Admin verification error:', err);
    return {
      authorized: false,
      error: 'An unexpected error occurred during administrative verification.',
      status: 500,
    };
  }
}
