import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['zh', 'en'],
  defaultLocale: 'zh'
});

export const config = {
  // 只拦截应用页面
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
