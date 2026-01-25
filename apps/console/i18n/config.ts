'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import zhMessages from '@/messages/zh.json';
import enMessages from '@/messages/en.json';

// 支持的语言列表
export const supportedLocales = ['zh', 'en'] as const;
export type SupportedLocale = typeof supportedLocales[number];

const resources = {
  zh: {
    translation: zhMessages,
  },
  en: {
    translation: enMessages,
  },
};

// 只在客户端初始化
if (typeof window !== 'undefined' && !i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en',
      defaultNS: 'translation',
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['localStorage', 'cookie', 'navigator'],
        lookupLocalStorage: 'console-locale',
        lookupCookie: 'console-locale',
        caches: ['localStorage', 'cookie'],
      },
      react: {
        useSuspense: false, // 禁用 Suspense，避免 hydration 问题
      },
    });
}

/**
 * 切换语言
 */
export function changeLanguage(lng: SupportedLocale): void {
  if (typeof window !== 'undefined') {
    i18n.changeLanguage(lng);
    localStorage.setItem('console-locale', lng);
  }
}

/**
 * 获取当前语言
 */
export function getCurrentLanguage(): SupportedLocale {
  if (typeof window === 'undefined') return 'en';
  return (i18n.language?.split('-')[0] as SupportedLocale) || 'en';
}

export default i18n;
