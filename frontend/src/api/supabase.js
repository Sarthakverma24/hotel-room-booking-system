import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dyscxlxkrvmjgdvhdyaq.supabase.co';
const supabaseAnonKey = 'sb_publishable_GKd4awcHH07ujbyIdCFIcw_5hnZr12x';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
