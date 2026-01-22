'use client';

import * as React from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

type PanelId =
  | "profile"
  | "account"
  | "subscription"
  | "about";

function extractPanelFromPath(pathname: string): PanelId {
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  
  if (lastSegment === 'profile') return 'profile';
  if (lastSegment === 'account') return 'account';
  if (lastSegment === 'subscription') return 'subscription';
  if (lastSegment === 'about') return 'about';
  
  return 'profile';
}

function getHeaderTitle(activePanel: PanelId, navT: any): string {
  return navT(activePanel) || navT('profile');
}

function renderLoginPrompt(
  router: ReturnType<typeof useRouter>, 
  t: ReturnType<typeof useTranslations>,
  locale: string
) {
  const handleLogin = () => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
      // 开发环境：跳转到 localhost:3001
      window.location.href = `http://localhost:3001/${locale}/signin`;
    } else {
      // 生产环境：使用内部路由
      router.push('/signin');
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
  const navT = useTranslations("dashboard.navigation");
  const commonT = useTranslations("common");
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const { currentUser } = useUser();
  const activePanel = extractPanelFromPath(pathname);

  if (!currentUser) {
    return renderLoginPrompt(router, commonT, locale);
  }

  return (
    <div className="flex h-full overflow-hidden p-6 gap-6">
      <Sidebar 
        activeItem={activePanel}
      />
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-card/60 backdrop-blur-md border border-border/60 shadow-xl shadow-black/5 dark:shadow-black/20">
        <Header title={getHeaderTitle(activePanel, navT)} />
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
