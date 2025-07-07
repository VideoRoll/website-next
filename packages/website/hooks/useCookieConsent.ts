'use client';

import { useState, useEffect, useCallback } from 'react';

interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsentData extends CookiePreferences {
  consentDate?: string;
  version?: string;
}

export const useCookieConsent = () => {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
  const [hasConsent, setHasConsent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 检查用户是否可以使用登录/注册功能
  const canUseAuth = useCallback((): boolean => {
    if (!preferences) return false;
    // 至少需要同意必要Cookie和功能Cookie才能使用认证功能
    return preferences.necessary && preferences.functional;
  }, [preferences]);

  // 检查特定类型的Cookie是否被允许
  const isCookieAllowed = useCallback((type: keyof CookiePreferences): boolean => {
    if (!preferences) return false;
    return preferences[type] === true;
  }, [preferences]);

  // 加载保存的Cookie偏好
  const loadSavedPreferences = useCallback(() => {
    setIsLoading(true);
    try {
      const savedConsent = localStorage.getItem('cookie-consent');
      const consentDate = localStorage.getItem('cookie-consent-date');
      const consentVersion = localStorage.getItem('cookie-consent-version');
      const currentVersion = '1.0';

      if (savedConsent && consentVersion === currentVersion) {
        const consentData: CookieConsentData = JSON.parse(savedConsent);
        setPreferences(consentData);
        setHasConsent(true);
        
        // 检查同意是否过期（1年）
        if (consentDate) {
          const consentTime = new Date(consentDate);
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
          
          if (consentTime < oneYearAgo) {
            // 同意已过期，重置状态
            clearConsent();
          }
        }
      } else {
        setHasConsent(false);
      }
    } catch (error) {
      console.error('Error loading cookie preferences:', error);
      setHasConsent(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 保存Cookie偏好
  const savePreferences = useCallback((newPreferences: CookiePreferences) => {
    try {
      localStorage.setItem('cookie-consent', JSON.stringify(newPreferences));
      localStorage.setItem('cookie-consent-date', new Date().toISOString());
      localStorage.setItem('cookie-consent-version', '1.0');
      
      setPreferences(newPreferences);
      setHasConsent(true);
      
      // 触发自定义事件，通知其他组件Cookie偏好已更新
      window.dispatchEvent(new CustomEvent('cookiePreferencesChanged', {
        detail: newPreferences
      }));
      
      return true;
    } catch (error) {
      console.error('Error saving cookie preferences:', error);
      return false;
    }
  }, []);

  // 清除Cookie同意
  const clearConsent = useCallback(() => {
    try {
      localStorage.removeItem('cookie-consent');
      localStorage.removeItem('cookie-consent-date');
      localStorage.removeItem('cookie-consent-version');
      
      setPreferences(null);
      setHasConsent(false);
      
      // 清理非必要Cookie
      cleanupNonEssentialCookies();
      
      window.dispatchEvent(new CustomEvent('cookieConsentCleared'));
      
      return true;
    } catch (error) {
      console.error('Error clearing cookie consent:', error);
      return false;
    }
  }, []);

  // 清理非必要Cookie
  const cleanupNonEssentialCookies = useCallback(() => {
    // 定义需要清理的Cookie类型
    const cookieTypes = {
      analytics: ['_ga', '_gid', '_gat', '_gtag', '_fbp', '_fbc'],
      marketing: ['_facebook_marketing', '_google_ads', '_twitter_marketing'],
      functional: ['preferences', 'settings', 'theme']
    };

    // 获取当前所有Cookie
    const cookies = document.cookie.split(';');
    
    cookies.forEach(cookie => {
      const cookieName = cookie.split('=')[0].trim();
      
      // 检查是否为非必要Cookie
      Object.entries(cookieTypes).forEach(([type, names]) => {
        if (names.some(name => cookieName.includes(name))) {
          if (!preferences || !preferences[type as keyof CookiePreferences]) {
            // 删除Cookie
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          }
        }
      });
    });
  }, [preferences]);

  // 获取同意状态摘要
  const getConsentSummary = useCallback(() => {
    if (!preferences || !hasConsent) {
      return {
        hasConsent: false,
        canUseAuth: false,
        enabledFeatures: [] as string[]
      };
    }

    const enabledFeatures: string[] = [];
    if (preferences.necessary) enabledFeatures.push('essential');
    if (preferences.functional) enabledFeatures.push('functional');
    if (preferences.analytics) enabledFeatures.push('analytics');
    if (preferences.marketing) enabledFeatures.push('marketing');

    return {
      hasConsent: true,
      canUseAuth: canUseAuth(),
      enabledFeatures,
      preferences
    };
  }, [preferences, hasConsent, canUseAuth]);

  // 组件挂载时加载偏好
  useEffect(() => {
    loadSavedPreferences();
  }, [loadSavedPreferences]);

  // 监听其他窗口/标签页的Cookie偏好变更
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cookie-consent') {
        loadSavedPreferences();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadSavedPreferences]);

  return {
    // 状态
    preferences,
    hasConsent,
    isLoading,
    
    // 检查方法
    canUseAuth,
    isCookieAllowed,
    
    // 操作方法
    savePreferences,
    clearConsent,
    loadSavedPreferences,
    cleanupNonEssentialCookies,
    
    // 工具方法
    getConsentSummary
  };
};

// Cookie管理工具类
export class CookieManager {
  // 设置Cookie
  static setCookie(
    name: string, 
    value: string, 
    options: {
      days?: number;
      secure?: boolean;
      sameSite?: 'Strict' | 'Lax' | 'None';
      domain?: string;
      path?: string;
    } = {}
  ): boolean {
    const {
      days = 30,
      secure = window.location.protocol === 'https:',
      sameSite = 'Lax',
      domain,
      path = '/'
    } = options;

    try {
      const expires = new Date();
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));

      const cookieString = [
        `${name}=${encodeURIComponent(value)}`,
        `expires=${expires.toUTCString()}`,
        `path=${path}`,
        domain ? `domain=${domain}` : '',
        `SameSite=${sameSite}`,
        secure ? 'Secure' : '',
        'HttpOnly' // 注意：这个只能在服务端设置
      ].filter(Boolean).join('; ');

      document.cookie = cookieString;
      return true;
    } catch (error) {
      console.error('Error setting cookie:', error);
      return false;
    }
  }

  // 获取Cookie
  static getCookie(name: string): string | null {
    try {
      const nameEQ = name + '=';
      const ca = document.cookie.split(';');
      
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
          return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting cookie:', error);
      return null;
    }
  }

  // 删除Cookie
  static deleteCookie(name: string, domain?: string): boolean {
    try {
      const deleteCookieString = [
        `${name}=`,
        'expires=Thu, 01 Jan 1970 00:00:00 UTC',
        'path=/',
        domain ? `domain=${domain}` : ''
      ].filter(Boolean).join('; ');

      document.cookie = deleteCookieString;
      
      // 也尝试删除带域名的版本
      if (!domain) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting cookie:', error);
      return false;
    }
  }

  // 获取所有Cookie
  static getAllCookies(): Record<string, string> {
    try {
      const cookies: Record<string, string> = {};
      const ca = document.cookie.split(';');
      
      ca.forEach(cookie => {
        const [name, value] = cookie.split('=');
        if (name && value) {
          cookies[name.trim()] = decodeURIComponent(value.trim());
        }
      });
      
      return cookies;
    } catch (error) {
      console.error('Error getting all cookies:', error);
      return {};
    }
  }
}
