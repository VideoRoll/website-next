'use client';

import * as React from "react";
import { useTranslations } from "@/contexts/I18nContext";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { ToolsSidebar } from "@/components/layout/ToolsSidebar";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";

function getHeaderTitle(pathname: string, navT: (key: string) => string): string {
  if (pathname.startsWith("/tools/convert")) {
    return navT("convert") || "Format Converter";
  }
  if (pathname.startsWith("/tools/transform")) {
    return navT("transform") || "Video Transform";
  }
  if (pathname.startsWith("/tools/compress")) {
    return navT("compress") || "Video Compression";
  }
  if (pathname.startsWith("/tools/browse")) {
    return navT("browse") || "Browse";
  }
  return navT("title") || "Tools";
}

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navT = useTranslations("tools.navigation");
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  
  const headerTitle = React.useMemo(() => getHeaderTitle(pathname, navT), [pathname, navT]);
  
  const handleToggleCollapse = React.useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  return (
    <div className="flex h-full overflow-hidden">
      <ToolsSidebar isCollapsed={isCollapsed} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={headerTitle} />
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
