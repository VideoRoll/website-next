import type { AuthConfig } from '@website-next/auth/config';

/**
 * Get auth configuration from environment variables
 * This should be called each time config is needed
 */
export function getAuthConfig(): AuthConfig {
  return {
    supabase: {
      url: import.meta.env.VITE_SUPABASE_URL!,
      publishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
    },
    siteUrl: import.meta.env.VITE_SITE_URL,
    // stripe: {
    //   secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY,
    //   secretKeyLive: import.meta.env.VITE_STRIPE_SECRET_KEY_LIVE,
    // },
  };
}
