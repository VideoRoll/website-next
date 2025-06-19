// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports

import React from "react";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

// export const metadata = {
//   title: "Video Roll",
//   description: "All-in-one video enhancements",
// };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// For the Purpose of Updating MetaData from Locale
// in this case updating the title
export async function generateMetadata({
  params,
}: Omit<Props, "children">) {
  const paramsData = await params;
  const t = await getTranslations({ locale: paramsData.locale, namespace: "hero" });

  return {
    title: t("title"),
    description: "All-in-one video enhancements",
  };
}

const GlobalLoadingPortal = dynamic(
  () => import("@/components/ui/GlobalLoading").then(m => m.default),
  { ssr: true }
);

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    // 不允许在 root layout 直接调用 notFound
    return notFound();
  }

  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <HeroUIProvider>
        <NextThemesProvider forcedTheme="dark">
          <ToastProvider placement="top-center" toastOffset={60} />
          {children}
          <GlobalLoadingPortal />
        </NextThemesProvider>
      </HeroUIProvider>
    </NextIntlClientProvider>
  );
}
