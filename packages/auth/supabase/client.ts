import { createBrowserClient } from '@supabase/ssr';
import { getAuthConfig } from '../config';

// Define a function to create a Supabase client for client-side operations
export const createClient = () => {
  const config = getAuthConfig();
  return createBrowserClient(
    config.supabase.url,
    config.supabase.publishableKey
  );
};