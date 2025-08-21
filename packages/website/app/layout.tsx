// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports

import "../styles/globals.css";
import React from "react";
import { routing } from "@/i18n/routing";
// import { GoogleAnalytics } from "@next/third-parties/google";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import NextTopLoader from "nextjs-toploader";

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
  params: { locale },
}: Omit<Props, "children">) {
  const t = await getTranslations({ locale, namespace: "hero" });

  return {
    title: t("title"),
    description: "All-in-one video enhancements",
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
  // // unstable_setRequestLocale(locale);

  // // Providing all messages to the client
  // // side is the easiest way to get started
  // const messages = await getMessages();
  setRequestLocale(locale);
  return (
    <html
      suppressHydrationWarning
      lang={locale}
      className="bg-background dark:bg-background-dark"
    >
      <head>
        <script
          src="https://accounts.google.com/gsi/client"
          defer
          async
        ></script>
      </head>
      <body>
        <NextTopLoader color="#6563e0"></NextTopLoader>
        {children}
        {/* <GoogleAnalytics gaId="G-3K6JBNVR8X" /> */}
      </body>
    </html>
  );
}
