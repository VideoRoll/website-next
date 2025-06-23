import React from 'react';
import { Link } from '@heroui/react';
import { useTranslations } from 'next-intl';

interface FooterProps {
  className?: string;
  logoText?: string;
  logoHref?: string;
}

export default function Footer({ 
  className = '', 
  logoText = 'VideoRoll Pro',
  logoHref = '/'
}: FooterProps) {
  const t = useTranslations('footer');

  const FOOTER_LINKS = [
    {
      label: t('links.privacy'),
      href: '/privacy',
    },
    {
      label: t('links.about'),
      href: '/about',
    },
    {
      label: t('links.contact'),
      href: '/contact',
    },
    {
      label: t('links.friendlyLinks'),
      href: '/links',
    },
    {
      label: t('links.bugReport'),
      href: '/feedback',
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
