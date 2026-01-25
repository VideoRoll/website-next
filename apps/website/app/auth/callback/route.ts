import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@website-next/auth/supabase/server";
import { getAuthConfig } from "@/lib/auth-init";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const config = getAuthConfig();
    const supabase = await createClient(config);
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";
      
      // 检查是否是 dashboard 相关的跳转
      const isDashboardRedirect = next.includes('/dashboard') || next === '/';
      
      if (isLocalEnv && isDashboardRedirect) {
        // 开发环境，跳转到 console 应用的 profile 页面
        // 从 next 路径中提取 locale，如果没有则默认为 'en'
        const localeMatch = next.match(/\/(en|zh)(\/|$)/);
        const locale = localeMatch ? localeMatch[1] : 'en';
        return NextResponse.redirect(`http://localhost:3134/console`);
      }
      
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
