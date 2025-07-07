'use client';

import React, { useState } from 'react';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { useTranslations } from 'next-intl';

interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookiePreferencesPage: React.FC = () => {
  const { 
    preferences, 
    hasConsent, 
    isLoading, 
    savePreferences, 
    clearConsent, 
    getConsentSummary 
  } = useCookieConsent();
  
  const [localPreferences, setLocalPreferences] = useState<CookiePreferences>(
    preferences || {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    }
  );
  
  const [isSaving, setIsSaving] = useState(false);
  const t = useTranslations('cookie');

  React.useEffect(() => {
    if (preferences) {
      setLocalPreferences(preferences);
    }
  }, [preferences]);

  const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'necessary') return; // 必要Cookie不能关闭
    
    setLocalPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = savePreferences(localPreferences);
      if (success) {
        // 可以显示成功消息
        console.log('Cookie preferences saved successfully');
      }
    } catch (error) {
      console.error('Failed to save cookie preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    const defaultPreferences: CookiePreferences = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    };
    setLocalPreferences(defaultPreferences);
  };

  const handleClearAll = async () => {
    if (window.confirm(t('confirm_clear_all'))) {
      clearConsent();
      setLocalPreferences({
        necessary: true,
        functional: false,
        analytics: false,
        marketing: false
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const consentSummary = getConsentSummary();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* 页面标题 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('preferences_title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t('preferences_description')}
        </p>
      </div>

      {/* 当前状态概览 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-4">
          {t('current_status')}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
              {t('consent_status')}: 
              <span className={`ml-2 font-medium ${consentSummary.hasConsent ? 'text-green-600' : 'text-red-600'}`}>
                {consentSummary.hasConsent ? t('granted') : t('not_granted')}
              </span>
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              {t('auth_access')}: 
              <span className={`ml-2 font-medium ${consentSummary.canUseAuth ? 'text-green-600' : 'text-red-600'}`}>
                {consentSummary.canUseAuth ? t('enabled') : t('disabled')}
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
              {t('enabled_features')}:
            </p>
            <div className="flex flex-wrap gap-1">
              {consentSummary.enabledFeatures.map(feature => (
                <span 
                  key={feature}
                  className="px-2 py-1 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                >
                  {t(feature)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cookie类别设置 */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('cookie_categories')}
        </h2>

        {/* 必要Cookie */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('necessary_cookies')}
              </h3>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">
                {t('always_active')}
              </span>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={localPreferences.necessary}
                disabled
                className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 disabled:opacity-50"
              />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {t('necessary_description')}
          </p>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            {t('examples')}: {t('necessary_examples')}
          </div>
        </div>

        {/* 功能Cookie */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('functional_cookies')}
              </h3>
              {localPreferences.functional && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                  {t('active')}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={localPreferences.functional}
                onChange={(e) => handlePreferenceChange('functional', e.target.checked)}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {t('functional_description')}
          </p>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            {t('examples')}: {t('functional_examples')}
          </div>
        </div>

        {/* 分析Cookie */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('analytics_cookies')}
              </h3>
              {localPreferences.analytics && (
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                  {t('active')}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={localPreferences.analytics}
                onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
              />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {t('analytics_description')}
          </p>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            {t('examples')}: {t('analytics_examples')}
          </div>
        </div>

        {/* 营销Cookie */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('marketing_cookies')}
              </h3>
              {localPreferences.marketing && (
                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 text-xs rounded-full">
                  {t('active')}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={localPreferences.marketing}
                onChange={(e) => handlePreferenceChange('marketing', e.target.checked)}
                className="w-5 h-5 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
              />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {t('marketing_description')}
          </p>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            {t('examples')}: {t('marketing_examples')}
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors duration-200 disabled:cursor-not-allowed"
        >
          {isSaving ? t('saving') : t('save_preferences')}
        </button>
        
        <button
          onClick={handleReset}
          className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors duration-200"
        >
          {t('reset_to_default')}
        </button>
        
        <button
          onClick={handleClearAll}
          className="flex-1 px-6 py-3 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors duration-200"
        >
          {t('clear_all_cookies')}
        </button>
      </div>

      {/* 帮助信息 */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          {t('need_help')}
        </h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <p>• {t('help_item_1')}</p>
          <p>• {t('help_item_2')}</p>
          <p>• {t('help_item_3')}</p>
        </div>
        <div className="mt-4">
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            {t('read_privacy_policy')} →
          </a>
        </div>
      </div>
    </div>
  );
};

export default CookiePreferencesPage;
