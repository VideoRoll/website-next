import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';

export function ToolsLayout() {
  const { t } = useTranslation();

  return (
    <div className="flex h-full overflow-hidden p-6">
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-card/60 backdrop-blur-md border border-border/60 shadow-xl shadow-black/5 dark:shadow-black/20">
        <Header title={t('tools.navigation.title') || 'Tools'} />
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
