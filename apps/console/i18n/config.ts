'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import zhMessages from '@/messages/zh.json';
import enMessages from '@/messages/en.json';

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

export default i18n;
