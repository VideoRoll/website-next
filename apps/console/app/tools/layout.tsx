'use client';

import * as React from "react";
import { useTranslations } from "@/contexts/I18nContext";
import { Header } from "@/components/layout/Header";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navT = useTranslations("tools.navigation");

  return (
    <div className="flex h-full overflow-hidden p-6">
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-card/60 backdrop-blur-md border border-border/60 shadow-xl shadow-black/5 dark:shadow-black/20">
        <Header title={navT("title") || "Tools"} />
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
