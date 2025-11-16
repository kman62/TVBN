import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let browserClient;

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Missing Supabase environment variables. Update your .env.local file.');
    }

    browserClient = createClient(supabaseUrl || 'http://localhost:54321', supabaseAnonKey || 'public-anon-key');
  }

  return browserClient;
}
