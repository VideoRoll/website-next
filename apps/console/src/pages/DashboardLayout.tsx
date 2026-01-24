import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { LogIn, PanelLeftOpen, PanelLeftClose, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type PanelId = 'profile' | 'account' | 'subscription' | 'about';

function extractPanelFromPath(pathname: string): PanelId {
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  if (lastSegment === 'profile') return 'profile';
  if (lastSegment === 'account') return 'account';
  if (lastSegment === 'subscription') return 'subscription';
  if (lastSegment === 'about') return 'about';

  return 'profile';
}

function getHeaderTitle(activePanel: PanelId, t: (key: string) => string): string {
  return t(`dashboard.navigation.${activePanel}`) || t('dashboard.navigation.profile');
}

export function DashboardLayout() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, loading } = useUser();
  const activePanel = extractPanelFromPath(location.pathname);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser) {
    const handleLogin = () => {
      const isDevelopment = import.meta.env.DEV;
      const locale = i18n.language || 'en';

      if (isDevelopment) {
        window.location.href = `http://localhost:3001/${locale}/signin`;
      } else {
        window.location.href = `${window.location.origin}/${locale}/signin`;
      }
    };

    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">{t('common.loginRequired')}</h2>
          <p className="text-muted-foreground">{t('common.loginDescription')}</p>
          <Button onClick={handleLogin} size="lg">
            <LogIn className="mr-2 h-4 w-4" />
            {t('common.loginButton')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden p-6 gap-6">
      <div className="relative">
        <Sidebar activeItem={activePanel} isCollapsed={isCollapsed} />
        <button
          type="button"
          className="absolute -right-3 top-4 z-10 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? '展开侧边栏' : '收起侧边栏'}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-6 w-6" />
          ) : (
            <PanelLeftClose className="h-6 w-6" />
          )}
        </button>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-card/60 backdrop-blur-md border border-border/60 shadow-xl shadow-black/5 dark:shadow-black/20">
        <Header title={getHeaderTitle(activePanel, t)} />
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
