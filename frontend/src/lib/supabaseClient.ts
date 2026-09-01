/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  (import.meta as any).env?.VITE_SUPABASE_URL || 
  'https://urlczpaowinnjrabppxd.supabase.co';

const supabaseAnonKey = 
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVybGN6cGFvd2lubmpyYWJwcHhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxOTE2ODIsImV4cCI6MjEwMzc2NzY4Mn0.tZd7CCRZblDn3VZlnVnmXRK18dhcHV0nh1XgUMk2pIQ';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-supabase-url'));

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
