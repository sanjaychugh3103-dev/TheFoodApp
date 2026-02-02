import { createClient } from '@supabase/supabase-js';

// These should be in environment variables in a real app
const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
