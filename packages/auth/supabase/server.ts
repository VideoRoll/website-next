import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { AuthConfig } from '../config';

export async function createClient(config: AuthConfig) {
  const cookieStore = await cookies();

  return createServerClient(
    config.supabase.url,
    config.supabase.publishableKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

export async function createAdminClient(config: AuthConfig) {
  if (!config.supabase.secretKey) {
    throw new Error('Supabase secret key is required for admin client. Please provide it in auth config.');
  }

  return createSupabaseClient(
    config.supabase.url,
    config.supabase.secretKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
