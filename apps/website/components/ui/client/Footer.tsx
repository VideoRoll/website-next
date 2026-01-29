'use client';

import React from 'react';
import { Link } from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';

interface FooterProps {
  className?: string;
  logoText?: string;
  logoHref?: string;
}

export default function Footer({ 
  className = '', 
  logoText = 'VideoRoll',
  logoHref = '/'
}: FooterProps) {
  const t = useTranslations('footer');
  const authT = useTranslations('auth');
  const locale = useLocale();

  const FOOTER_LINKS = [
    {
      label: authT('termsOfService'),
      href: `https://docs.videoroll.app/${locale === 'zh' ? 'cn' : locale}/docs/terms`,
    },
    {
      label: t('links.privacy'),
      href: `https://docs.videoroll.app/${locale === 'zh' ? 'cn' : locale}/docs/privacy`,
    },
    {
      label: t('links.about'),
      href: `https://docs.videoroll.app/${locale === 'zh' ? 'cn' : locale}/docs`,
    },
    {
      label: t('links.contact'),
      href: `https://docs.videoroll.app/${locale === 'zh' ? 'cn' : locale}/docs/help`,
    },
    {
      label: t('links.bugReport'),
      href: 'https://github.com/VideoRoll/VideoRoll/issues',
    },
  ];
  return (
    <footer className='text-white py-8 mx-auto max-w-screen-2xl px-[5vw]'>
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* 左侧 Logo */}
          <div className="flex items-center">
            <Link 
              href={logoHref}
              className="text-xl font-bold text-white hover:text-gray-300 transition-colors"
            >
              {logoText}
            </Link>
          </div>

          {/* 右侧导航 */}
          <nav className="flex flex-wrap justify-center md:justify-end items-center gap-6">
            {FOOTER_LINKS.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                target="_blank"
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>        {/* 底部版权信息 */}
        <div className="mt-6 pt-6 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} {logoText}. {t('copyright')}.
          </p>
        </div>
      </div>
    </footer>
  );
}
