import "../styles/globals.css";
import React from "react";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "./providers";

export const metadata = {
  title: "VideoRoll Console",
  description: "VideoRoll Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <NextTopLoader color="#6563e0" height={3} showSpinner={false} zIndex={9999} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
