import { type NextRequest } from 'next/server'
import { updateSession } from '@website-next/auth/supabase/middleware'
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { getAuthConfig } from './lib/auth-init';
 
export default createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const config = getAuthConfig();
  return await updateSession(request, config);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    // Enable a redirect to a matching locale at the root
    "/",

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    "/(zh|en)/:path*",
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}