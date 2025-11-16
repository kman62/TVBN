import { createClient } from '@supabase/supabase-js';

export function getSupabaseServerClient(accessToken) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase environment variables are not configured.');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      detectSessionInUrl: false
    },
    global: {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`
          }
        : undefined
    }
  });
}
