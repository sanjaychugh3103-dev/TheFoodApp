import { createClient } from '@supabase/supabase-js';

// Use process.env for Expo/React Native environment variables
// In Expo, variables must be prefixed with EXPO_PUBLIC_ to be accessible
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
