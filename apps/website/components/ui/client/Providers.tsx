// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
'use client';
import React from "react";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import dynamic from "next/dynamic";

const GlobalLoadingPortal = dynamic(
  () => import("@/components/ui/client/GlobalLoading").then(m => m.default),
  { ssr: true }
);

export default function Providers({
  children,
  messages,
  locale,
}: {
  children: React.ReactNode;
  messages: Record<string, string>;
  locale: string;
}) {

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <HeroUIProvider>
        <NextThemesProvider forcedTheme="dark">
          {children}
          <ToastProvider placement="top-center" toastOffset={60} />
          <GlobalLoadingPortal />
        </NextThemesProvider>
      </HeroUIProvider>
    </NextIntlClientProvider>
  );
}
