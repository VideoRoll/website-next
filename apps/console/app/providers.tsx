'use client';

import React, { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { I18nProvider } from "@/contexts/I18nContext";
import { UserProvider } from "@/contexts/UserContext";
import { TopNav } from "@/components/layout/TopNav";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 在客户端挂载前，提供基本的 Provider 结构，避免 useUser 等 hook 报错
  if (!mounted) {
    return (
      <UserProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div suppressHydrationWarning className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/10">
            <div className="h-16 border-b border-border/40 bg-card/40 backdrop-blur-sm" />
            <div className="flex-1 overflow-hidden">
              {children}
            </div>
          </div>
        </ThemeProvider>
      </UserProvider>
    );
  }

  return (
    <I18nProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <UserProvider>
          <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/10">
            <TopNav />
            <div className="flex-1 overflow-hidden">
              {children}
            </div>
          </div>
        </UserProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
