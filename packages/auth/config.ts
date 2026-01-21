/**
 * Auth package configuration
 * All environment variables should be provided by the consumer
 * Configuration must be passed to each function call, not stored globally
 */
export interface AuthConfig {
  supabase: {
    url: string;
    publishableKey: string;
    secretKey?: string;
    serviceRoleKey?: string;
  };
  siteUrl?: string;
  stripe?: {
    secretKey?: string;
    secretKeyLive?: string;
  };
}
