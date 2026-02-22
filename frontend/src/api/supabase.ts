import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://dyscxlxkrvmjgdvhdyaq.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_GKd4awcHH07ujbyIdCFIcw_5hnZr12x';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
