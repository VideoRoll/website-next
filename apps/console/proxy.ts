import { type NextRequest } from 'next/server';
import { updateSession } from '@website-next/auth/supabase/middleware';
import { getAuthConfig } from './lib/auth-init';

export async function proxy(request: NextRequest) {
  const config = getAuthConfig();
  // 使用类型断言解决 monorepo 中 Next.js 版本不匹配的问题
  return await updateSession(request as any, config);
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
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
