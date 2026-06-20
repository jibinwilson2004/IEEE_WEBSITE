// ============================================================
// Supabase Configuration — IEEE MBITS
// ============================================================
const SUPABASE_URL = 'https://bbgqaukvbdxuxqjlngyr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_WA63MVJ3qTDzn9Zz1K5q0Q_DvOoGO7b';

// Initialize Supabase client (requires @supabase/supabase-js CDN loaded before this)
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
