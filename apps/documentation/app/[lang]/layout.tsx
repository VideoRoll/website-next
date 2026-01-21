import '../global.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { i18n } from '@/lib/i18n';
import { defineI18nUI } from 'fumadocs-ui/i18n';

const { provider } = defineI18nUI(i18n, {
  translations: {
    en: {
      displayName: 'English',
    },
    cn: {
      displayName: '简体中文',
      search: '搜索',
    },
  },
});

// translations
const cn: Partial<Translations> = {
  search: 'Translated Content',
};

// available languages that will be displayed on UI
// make sure `locale` is consistent with your i18n config
const locales = [
  {
    name: 'English',
    locale: 'en',
  },
  {
    name: 'Chinese',
    locale: 'cn',
    search: '搜索',
  },
];

export default async function RootLayout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
}) {
  const lang = (await params).lang;

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className='flex flex-col min-h-screen'>
        <RootProvider
          i18n={provider(lang)}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}