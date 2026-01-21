import type { AuthConfig } from '@website-next/auth/config';

/**
 * Get auth configuration from environment variables
 * This should be called each time config is needed
 */
export function getAuthConfig(): AuthConfig {
  return {
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      secretKey: process.env.SUPABASE_SECRET_KEY,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL,
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY,
      secretKeyLive: process.env.STRIPE_SECRET_KEY_LIVE,
    },
  };
}
