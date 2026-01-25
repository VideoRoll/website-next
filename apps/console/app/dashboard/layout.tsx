'use client';

import * as React from "react";
import { useTranslations, useLocale } from "@/contexts/I18nContext";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { LogIn, PanelLeftOpen, PanelLeftClose } from "lucide-react";

type PanelId =
  | "profile"
  | "account"
  | "subscription"
  | "about";

function extractPanelFromPath(pathname: string): PanelId {
  const segments = pathname.split('/').filter(Boolean);
  const dashboardIndex = segments.indexOf('dashboard');
  
  if (dashboardIndex >= 0 && dashboardIndex < segments.length - 1) {
    const lastSegment = segments[dashboardIndex + 1];
    if (lastSegment === 'profile') return 'profile';
    if (lastSegment === 'account') return 'account';
    if (lastSegment === 'subscription') return 'subscription';
    if (lastSegment === 'about') return 'about';
  }
  
  return 'profile';
}

function getHeaderTitle(activePanel: PanelId, navT: (key: string) => string): string {
  return navT(`${activePanel}`) || navT('profile');
}

interface LoginPromptProps {
  t: (key: string) => string;
  locale: string;
}

function LoginPrompt({ t, locale }: LoginPromptProps) {
  const handleLogin = () => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
      window.location.href = `http://localhost:3001/${locale}/signin`;
    } else {
      window.location.href = `${window.location.origin}/${locale}/signin`;
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold">{t("loginRequired")}</h2>
        <p className="text-muted-foreground">{t("loginDescription")}</p>
        <Button onClick={handleLogin} size="lg">
          <LogIn className="mr-2 h-4 w-4" />
          {t("loginButton")}
        </Button>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navT = useTranslations('dashboard.navigation');
  const commonT = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const { currentUser, isLoading } = useUser();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  
  // 使用 useMemo 缓存计算结果
  const activePanel = React.useMemo(() => extractPanelFromPath(pathname), [pathname]);
  const headerTitle = React.useMemo(() => getHeaderTitle(activePanel, navT), [activePanel, navT]);
  
  // 使用 useMemo 缓存 Sidebar 的 props
  const sidebarProps = React.useMemo(() => ({
    activeItem: activePanel,
    isCollapsed,
  }), [activePanel, isCollapsed]);
  
  // 使用 useCallback 缓存事件处理函数
  const handleToggleCollapse = React.useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full overflow-hidden p-6 gap-6">
        <div className="relative">
          <div className="w-56 h-full bg-muted/30 animate-pulse rounded-lg" />
        </div>
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-card/60 backdrop-blur-md border border-border/60">
          <div className="h-16 border-b border-border/60 bg-muted/30 animate-pulse" />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              <div className="h-8 w-48 bg-muted animate-pulse rounded" />
              <div className="h-64 bg-muted/50 animate-pulse rounded-lg" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPrompt t={commonT} locale={locale} />;
  }

  return (
    <div className="flex h-full overflow-hidden p-6 gap-6">
      <div className="relative">
        <Sidebar 
          activeItem={sidebarProps.activeItem}
          isCollapsed={sidebarProps.isCollapsed}
        />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-card/60 backdrop-blur-md border border-border/60 shadow-xl shadow-black/5 dark:shadow-black/20">
        {/* Header 区域 - 包含展开/收起按钮和标题 */}
        <header className="flex h-16 items-center border-b border-border/40 bg-card/40 backdrop-blur-sm px-6 rounded-t-2xl relative">
          {/* 展开/收起按钮 - 位于左侧 */}
          <button
            type="button"
            className="mr-4 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
            onClick={handleToggleCollapse}
            aria-label={isCollapsed ? "展开侧边栏" : "收起侧边栏"}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </button>
          <h1 className="text-xl font-semibold">{headerTitle}</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
