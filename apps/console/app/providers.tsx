'use client';

import React, { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { I18nProvider } from "@/contexts/I18nContext";
import { UserProvider } from "@/contexts/UserContext";
import { TopNav } from "@/components/layout/TopNav";

// 骨架屏组件
function AppSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <div 
      suppressHydrationWarning 
      className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/10"
    >
      {/* TopNav 骨架屏 */}
      <div className="h-16 border-b border-border/40 bg-card/40 backdrop-blur-sm flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="h-9 w-24 bg-muted/50 rounded-lg animate-pulse" />
          <div className="h-9 w-20 bg-muted/50 rounded-lg animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 bg-muted/50 rounded-lg animate-pulse" />
          <div className="h-9 w-9 bg-muted/50 rounded-lg animate-pulse" />
          <div className="h-9 w-9 bg-muted/50 rounded-lg animate-pulse" />
          <div className="h-9 w-9 bg-muted/50 rounded-lg animate-pulse" />
          <div className="h-9 w-32 bg-muted/50 rounded-lg animate-pulse" />
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

// 应用外壳组件
function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/10">
      <TopNav />
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 在客户端挂载前，显示骨架屏（但仍需提供 UserProvider 避免 hook 报错）
  if (!mounted) {
    return (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <UserProvider>
          <AppSkeleton>{children}</AppSkeleton>
        </UserProvider>
      </ThemeProvider>
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
          <AppShell>{children}</AppShell>
        </UserProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
