'use client';

import { useEffect, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '@/i18n/config';

// 兼容 next-intl 的 useTranslations hook
export function useTranslations(namespace?: string) {
  const { t, ready } = useTranslation();
  
  return useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      // 如果 i18n 还未准备好，返回 key 避免 hydration 错误
      if (!ready) return key;
      return t(fullKey, params);
    },
    [t, namespace, ready]
  );
}

// 兼容 next-intl 的 useLocale hook
export function useLocale() {
  const { i18n, ready } = useTranslation();
  // 如果还未准备好，返回默认语言
  if (!ready || typeof window === 'undefined') return 'en' as const;
  return (i18n.language || 'en') as 'zh' | 'en';
}

// I18nProvider 组件（用于初始化 i18n 和避免 hydration 错误）
export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 确保 i18n 配置已加载
    if (typeof window !== 'undefined') {
      import('@/i18n/config').then(() => {
        setMounted(true);
      });
    }
  }, []);

  // 在客户端挂载前，渲染一个占位符避免 hydration 不匹配
  if (!mounted) {
    return <div suppressHydrationWarning style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return <>{children}</>;
}
