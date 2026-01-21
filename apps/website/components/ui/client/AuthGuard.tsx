'use client';

import React from 'react';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showMessage?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallback, 
  showMessage = true 
}) => {
  const { canUseAuth, hasConsent, isLoading } = useCookieConsent();
  const t = useTranslations('auth');
  const params = useParams();
  const locale = params?.locale as string || 'en';

  // 加载中状态
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 如果可以使用认证功能，渲染子组件
  if (canUseAuth) {
    return <>{children}</>;
  }

  // 如果提供了自定义fallback，使用它
  if (fallback) {
    return <>{fallback}</>;
  }

  // 默认的阻止访问消息
  if (showMessage) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          {/* 图标 */}
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-7V9a3 3 0 10-6 0v6m12 0V9a3 3 0 00-3-3H9a3 3 0 00-3 3v9.586a1 1 0 001.707.707L9 18h6z" />
            </svg>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {t('access_restricted')}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            {t('cookie_consent_required')}
          </p>

          {/* Cookie状态指示 */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
            <div className="text-left space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{t('necessary_cookies')}</span>
                <span className="text-green-600 dark:text-green-400">✓ {t('required')}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>{t('functional_cookies')}</span>
                <span className="text-red-600 dark:text-red-400">✗ {t('not_allowed')}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('cookie_explanation')}
            </p>
            
            <div className="flex flex-col gap-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                {t('refresh_page')}
              </button>
              
              <a
                href={`/${locale}/privacy-policy`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors duration-200 text-center"
              >
                {t('learn_more')}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 如果不显示消息，返回null
  return null;
};

export default AuthGuard;
