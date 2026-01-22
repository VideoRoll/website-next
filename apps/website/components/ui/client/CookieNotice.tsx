'use client';

import React, { useState, useEffect } from 'react';
import { 
  IconX, 
  IconCookie, 
  IconShield, 
  IconSettings, 
  IconExternalLink 
} from '@tabler/icons-react';
import { Button, Switch } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieNoticeProps {
  className?: string;
  onPreferencesChange?: (preferences: CookiePreferences) => void;
}

const CookieNotice: React.FC<CookieNoticeProps> = ({ 
  className = '',
  onPreferencesChange 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false
  });

  const t = useTranslations('cookie');
  const params = useParams();
  const locale = params?.locale as string || 'en';

  useEffect(() => {
    // 检查用户是否已经做过选择
    const savedConsent = localStorage.getItem('cookie-consent');
    const consentDate = localStorage.getItem('cookie-consent-date');
    const consentVersion = localStorage.getItem('cookie-consent-version');
    const currentVersion = '1.0';

    if (!savedConsent || consentVersion !== currentVersion) {
      // 延迟显示，避免闪烁
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      // 加载已保存的偏好
      try {
        const savedPreferences = JSON.parse(savedConsent);
        setPreferences(savedPreferences);
        onPreferencesChange?.(savedPreferences);
      } catch (error) {
        console.error('Error parsing saved cookie preferences:', error);
      }
    }
  }, [onPreferencesChange]);

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(prefs));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    localStorage.setItem('cookie-consent-version', '1.0');
    
    // 触发偏好变更回调
    onPreferencesChange?.(prefs);
    
    // 隐藏通知
    hideNotice();
  };

  const hideNotice = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    };
    setPreferences(allAccepted);
    saveConsent(allAccepted);
  };

  const handleRejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    };
    setPreferences(onlyNecessary);
    saveConsent(onlyNecessary);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'necessary') return; // 必要Cookie不能关闭
    
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  // 如果不显示，返回null
  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed bottom-4 left-4 right-4 md:left-6 md:right-6 lg:left-auto lg:right-6 
        ${showSettings ? 'lg:max-w-lg' : 'lg:max-w-md'}
        bg-white dark:bg-gray-900 
        border border-gray-200 dark:border-gray-700
        rounded-xl shadow-2xl backdrop-blur-sm
        z-50 transition-all duration-300 ease-out
        ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
        ${className}
      `}
    >
      {/* 顶部装饰条 */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-t-xl" />
      
      <div className="p-5">
        {/* 标题行 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <IconCookie className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base">
                {t('title')}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('subtitle')}
              </p>
            </div>
          </div>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onClick={hideNotice}
            aria-label={t('close')}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <IconX className="w-4 h-4" />
          </Button>
        </div>

        {!showSettings ? (
          // 基本视图
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('description')}
            </p>

            {/* 重要提示 */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <IconShield className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-red-800 dark:text-red-300 mb-1">
                    {t('important_notice')}
                  </p>
                  <p className="text-xs text-red-700 dark:text-red-400">
                    {t('login_restriction')}
                  </p>
                </div>
              </div>
            </div>

            {/* 按钮区域 */}
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Button
                  color="primary"
                  size="sm"
                  onClick={handleAcceptAll}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {t('accept_all')}
                </Button>
                <Button
                  color="default"
                  variant="bordered"
                  size="sm"
                  onClick={handleRejectAll}
                  className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {t('reject_all')}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <Button
                  variant="light"
                  size="sm"
                  startContent={<IconSettings className="w-4 h-4" />}
                  onClick={toggleSettings}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  {t('customize')}
                </Button>

                <a
                  href={`/${locale}/privacy-policy`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 hover:underline"
                >
                  {t('privacy_policy')}
                  <IconExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ) : (
          // 详细设置视图
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onClick={toggleSettings}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label={t('back')}
              >
                ←
              </Button>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {t('cookie_settings')}
              </h4>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {/* 必要Cookie */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="font-medium text-sm text-gray-900 dark:text-white">
                      {t('necessary_cookies')}
                    </span>
                  </div>
                  <Switch
                    size="sm"
                    isSelected={preferences.necessary}
                    isDisabled
                    color="success"
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t('necessary_description')}
                </p>
              </div>

              {/* 功能Cookie */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="font-medium text-sm text-gray-900 dark:text-white">
                      {t('functional_cookies')}
                    </span>
                  </div>
                  <Switch
                    size="sm"
                    isSelected={preferences.functional}
                    onValueChange={(value) => handlePreferenceChange('functional', value)}
                    color="primary"
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t('functional_description')}
                </p>
              </div>

              {/* 分析Cookie */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <span className="font-medium text-sm text-gray-900 dark:text-white">
                      {t('analytics_cookies')}
                    </span>
                  </div>
                  <Switch
                    size="sm"
                    isSelected={preferences.analytics}
                    onValueChange={(value) => handlePreferenceChange('analytics', value)}
                    color="secondary"
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t('analytics_description')}
                </p>
              </div>

              {/* 营销Cookie */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    <span className="font-medium text-sm text-gray-900 dark:text-white">
                      {t('marketing_cookies')}
                    </span>
                  </div>
                  <Switch
                    size="sm"
                    isSelected={preferences.marketing}
                    onValueChange={(value) => handlePreferenceChange('marketing', value)}
                    color="warning"
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t('marketing_description')}
                </p>
              </div>
            </div>

            {/* 设置页面按钮 */}
            <div className="flex gap-2 pt-2">
              <Button
                color="primary"
                size="sm"
                onClick={handleSavePreferences}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
              >
                {t('save_preferences')}
              </Button>
              <Button
                color="default"
                variant="bordered"
                size="sm"
                onClick={toggleSettings}
                className="border-gray-300 dark:border-gray-600"
              >
                {t('cancel')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieNotice;
