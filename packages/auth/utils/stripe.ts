import Stripe from 'stripe';
import type { AuthConfig } from '../config';

export function getStripe(config: AuthConfig) {
  if (!config.stripe?.secretKeyLive && !config.stripe?.secretKey) {
    throw new Error('Stripe secret key is required. Please provide it in auth config.');
  }

  return new Stripe(
    config.stripe.secretKeyLive ?? config.stripe.secretKey ?? '',
    {
      // https://github.com/stripe/stripe-node#configuration
      // https://stripe.com/docs/api/versioning
      // @ts-ignore
      apiVersion: null,
      // Register this as an official Stripe plugin.
      // https://stripe.com/docs/building-plugins#setappinfo
      appInfo: {
        name: 'Next.js Subscription Starter',
        version: '0.0.0',
        url: 'https://github.com/vercel/nextjs-subscription-payments'
      }
    }
  );
}
