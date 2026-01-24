import { createBrowserClient } from '@supabase/ssr';

// Define a function to create a Supabase client for client-side operations
export const createClient = async (config: any) => {
  return createBrowserClient(
    config.supabase.url,
    config.supabase.publishableKey
  );
};