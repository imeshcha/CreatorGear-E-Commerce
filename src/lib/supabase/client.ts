import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://evfpyidulnbewerkrnqy.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZnB5aWR1bG5iZXdlcmtybnF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3MDU1OTIsImV4cCI6MjEwNzI4MTU5Mn0.wxy2HmkCekaUatkwst8cWRAPnGEDk4EZE9map-hR-t0';

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
