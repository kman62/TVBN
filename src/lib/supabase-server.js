import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export const createServerClient = () => {
  const cookieStore = cookies();
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      auth: {
        persistSession: false,
        detectSessionInUrl: false
      },
      global: {
        headers: {
          Authorization: `Bearer ${cookieStore.get('sb-access-token')?.value ?? ''}`
        }
      }
    }
  );
};
