import "../styles/globals.css";
import React from "react";
import { routing } from "@/i18n/routing";
import NextTopLoader from "nextjs-toploader";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// For the Purpose of Updating MetaData from Locale
// in this case updating the title
export async function generateMetadata({
  params: { locale },
}: Omit<Props, "children">) {
  const t = await getTranslations({ locale, namespace: "dashboard" });

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
  setRequestLocale(locale);
  return (
    <html suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <NextTopLoader color="#6563e0" height={3} showSpinner={false} zIndex={9999}/>
        {children}
      </body>
    </html>
  );
}
