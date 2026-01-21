import React from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { ThemeProvider } from "next-themes";
import { routing } from "@/i18n/routing";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getUserServerSideProps } from "@website-next/auth/auth-helpers/props";
import { UserProvider } from "@/contexts/UserContext";
import { TopNav } from "@/components/layout/TopNav";
import { getAuthConfig } from "@/lib/auth-init";

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Omit<Props, "children">) {
  const paramsData = await params;
  const t = await getTranslations({
    locale: paramsData.locale,
    namespace: "dashboard",
  });

  return {
    title: t("title"),
    description: "VideoRoll Dashboard",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    return notFound();
  }

  setRequestLocale(locale);

  // Providing all messages to the client
  const messages = await getMessages();

  // Get user information
  const config = getAuthConfig();
  const { currentUser } = await getUserServerSideProps(config);

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <UserProvider currentUser={currentUser}>
          <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/10">
            <TopNav />
            <div className="flex-1 overflow-hidden">
              {children}
            </div>
          </div>
        </UserProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
