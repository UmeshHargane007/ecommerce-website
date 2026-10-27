import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Create a .env file in frontend/'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://YOUR_PROJECT.supabase.co',
  supabaseAnonKey || 'YOUR_ANON_KEY'
);