'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n, { changeLanguage as i18nChangeLanguage, type SupportedLocale } from '@/i18n/config';

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
export function useLocale(): SupportedLocale {
  const { i18n: i18nInstance, ready } = useTranslation();
  const [locale, setLocale] = useState<SupportedLocale>('en');

  useEffect(() => {
    if (ready && i18nInstance.language) {
      const lang = i18nInstance.language.split('-')[0] as SupportedLocale;
      setLocale(lang === 'zh' ? 'zh' : 'en');
    }
  }, [i18nInstance.language, ready]);

  return locale;
}

// 导出 changeLanguage 函数
export const changeLanguage = i18nChangeLanguage;

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
