"use client";

import * as React from "react";
import { useTranslations } from "@/contexts/I18nContext";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Video,
  Music,
  Sparkles,
  Globe,
  ChevronRight,
} from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";

interface SubNavItem {
  id: string;
  label: string;
  route: string;
}

interface NavCategory {
  id: string;
  icon: React.ElementType;
  translationKey: string;
  route?: string; // 如果没有二级导航，直接跳转
  subNav?: SubNavItem[];
  comingSoon?: boolean;
}

const toolsNavCategories: NavCategory[] = [
  {
    id: "video",
    icon: Video,
    translationKey: "video",
    subNav: [
      { id: "convert", label: "convert", route: "/tools/convert" },
      { id: "transform", label: "transform", route: "/tools/transform" },
      { id: "compress", label: "compress", route: "/tools/compress" },
    ],
  },
  {
    id: "audio",
    icon: Music,
    translationKey: "audio",
    comingSoon: true,
  },
  {
    id: "ai",
    icon: Sparkles,
    translationKey: "ai",
    comingSoon: true,
  },
  // 暂时屏蔽浏览菜单
  // {
  //   id: "browse",
  //   icon: Globe,
  //   translationKey: "browse",
  //   route: "/tools/browse",
  // },
];

function getActiveCategory(pathname: string): string | null {
  if (pathname.startsWith("/tools/convert") || pathname.startsWith("/tools/transform") || pathname.startsWith("/tools/compress")) return "video";
  // 暂时屏蔽浏览菜单
  // if (pathname.startsWith("/tools/browse")) return "browse";
  return null;
}

function getActiveSubNav(pathname: string): string | null {
  if (pathname.startsWith("/tools/convert")) return "convert";
  if (pathname.startsWith("/tools/transform")) return "transform";
  if (pathname.startsWith("/tools/compress")) return "compress";
  return null;
}

interface ToolsSidebarProps {
  isCollapsed: boolean;
}

export function ToolsSidebar({ isCollapsed }: ToolsSidebarProps) {
  const t = useTranslations("tools.navigation");
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredCategory, setHoveredCategory] = React.useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  
  const activeCategory = React.useMemo(() => getActiveCategory(pathname), [pathname]);
  const activeSubNav = React.useMemo(() => getActiveSubNav(pathname), [pathname]);

  // 如果当前路径匹配某个分类的二级导航，自动选中该分类
  React.useEffect(() => {
    if (activeCategory) {
      setSelectedCategory(activeCategory);
    }
  }, [activeCategory]);

  // 清理定时器
  React.useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleCategoryMouseEnter = React.useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    // hover 时展开一级菜单（整体展开）
    setHoveredCategory('expanded');
  }, []);

  const handleCategoryMouseLeave = React.useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 150);
  }, []);

  const handleCategoryClick = React.useCallback((categoryId: string, hasSubNav: boolean) => {
    // 点击时选中一级菜单（一次只能选中一个）
    setSelectedCategory(categoryId);
    
    // 如果选中的是有二级菜单的项，自动导航到二级菜单的第一项
    if (hasSubNav) {
      const clickedCategory = toolsNavCategories.find(cat => cat.id === categoryId);
      if (clickedCategory?.subNav && clickedCategory.subNav.length > 0) {
        const firstSubNav = clickedCategory.subNav[0];
        router.push(firstSubNav.route);
      }
    }
  }, [router]);

  // 二级菜单的鼠标事件不需要影响一级菜单的显示/隐藏
  // 一级菜单只在鼠标离开一级菜单区域时消失

  // 确定当前显示的二级菜单（只要选中的分类有二级菜单就显示）
  const activeSubNavCategory = toolsNavCategories.find(cat => cat.id === selectedCategory);
  const showSubNav = selectedCategory && activeSubNavCategory?.subNav && activeSubNavCategory.subNav.length > 0;
  const isExpanded = hoveredCategory === 'expanded';
  
  // 确定默认选中的二级菜单项（选中一级菜单时，默认选中二级菜单的第一项）
  const defaultSubNavId = showSubNav && activeSubNavCategory?.subNav && activeSubNavCategory.subNav.length > 0
    ? activeSubNavCategory.subNav[0].id
    : null;
  
  // 当前激活的二级菜单项（如果路径匹配则使用路径匹配的，否则使用默认的第一项）
  const currentSubNavId = activeSubNav || (showSubNav ? defaultSubNavId : null);

  return (
    <TooltipProvider delayDuration={0} skipDelayDuration={0}>
      <div className="flex h-full relative">
        {/* 一级菜单 - 固定宽度 w-16，hover 时整体展开（浮动，不占据布局空间） */}
        <div
          className="relative z-50"
          onMouseEnter={handleCategoryMouseEnter}
          onMouseLeave={handleCategoryMouseLeave}
        >
          {/* 基础菜单容器 - 始终占据 w-16 的布局空间 */}
          <aside className="w-16 h-full flex flex-col overflow-hidden relative bg-background border-r border-border">
            {/* Main Navigation */}
            <nav className="flex-1 space-y-1.5 p-2 overflow-y-auto overflow-x-visible custom-scrollbar">
              {toolsNavCategories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                const isSelected = selectedCategory === category.id;
                const hasSubNav = category.subNav && category.subNav.length > 0;

                return (
                  <div key={category.id}>
                    {category.route ? (
                      <LinkButton
                        href={category.route}
                        variant={isActive ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-center px-2 transition-all duration-200",
                          !isActive && "text-muted-foreground hover:text-foreground"
                        )}
                        onClick={() => {
                          // 点击有 route 的项时，选中它（如果没有二级菜单，会隐藏二级菜单）
                          setSelectedCategory(category.id);
                        }}
                      >
                        <Icon className={cn("h-4 w-4 transition-transform", isActive && "scale-110")} />
                      </LinkButton>
                    ) : (
                      <div
                        className={cn(
                          "w-full flex items-center justify-center px-2 py-2 rounded-md transition-all duration-200",
                          category.comingSoon
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer",
                          !category.comingSoon && isSelected ? "bg-primary text-primary-foreground" : !category.comingSoon ? "text-muted-foreground hover:bg-accent" : "text-muted-foreground"
                        )}
                        onClick={category.comingSoon ? undefined : () => handleCategoryClick(category.id, hasSubNav)}
                      >
                        <Icon className={cn("h-4 w-4 transition-transform", !category.comingSoon && isActive && "scale-110")} />
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </aside>

          {/* Hover 时展开的浮动面板 - 整体展开，不占据布局空间 */}
          {isExpanded && (
            <aside 
              className="absolute left-0 top-0 w-56 h-full bg-background border-r border-border z-[60] pointer-events-auto animate-in slide-in-from-left-2 fade-in-0 duration-200"
              onMouseEnter={handleCategoryMouseEnter}
              onMouseLeave={handleCategoryMouseLeave}
            >
              <div className="flex flex-col h-full">
                {/* Navigation Items */}
                <nav className="flex-1 space-y-1.5 p-2 overflow-y-auto overflow-x-visible custom-scrollbar">
                  {toolsNavCategories.map((category) => {
                    const Icon = category.icon;
                    const isActive = activeCategory === category.id;
                    const isSelected = selectedCategory === category.id;
                    const hasSubNav = category.subNav && category.subNav.length > 0;

                    return (
                      <div key={category.id}>
                        {category.route ? (
                          <LinkButton
                            href={category.route}
                            variant={isActive ? "default" : "ghost"}
                            className={cn(
                              "w-full justify-start transition-all duration-200",
                              !isActive && "text-muted-foreground hover:text-foreground"
                            )}
                            onClick={() => {
                              // 点击有 route 的项时，选中它（如果没有二级菜单，会隐藏二级菜单）
                              setSelectedCategory(category.id);
                            }}
                          >
                            <Icon className={cn("h-4 w-4 mr-2 transition-transform", isActive && "scale-110")} />
                            <span className="font-medium whitespace-nowrap">{t(category.translationKey)}</span>
                          </LinkButton>
                        ) : (
                          <div
                            className={cn(
                              "w-full flex items-center justify-start px-3 py-2 rounded-md transition-all duration-200",
                              category.comingSoon
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer",
                              !category.comingSoon && isSelected ? "bg-primary text-primary-foreground" : !category.comingSoon ? "text-muted-foreground hover:bg-accent" : "text-muted-foreground"
                            )}
                            onClick={category.comingSoon ? undefined : () => handleCategoryClick(category.id, hasSubNav)}
                          >
                            <Icon className={cn("h-4 w-4 mr-2 transition-transform", !category.comingSoon && isActive && "scale-110")} />
                            <span className="font-medium flex-1 whitespace-nowrap">{t(category.translationKey)}</span>
                            {!category.comingSoon && hasSubNav && (
                              <ChevronRight className="h-4 w-4 ml-2" />
                            )}
                            {category.comingSoon && (
                              <span className="ml-2 text-xs opacity-70 whitespace-nowrap">
                                {t("comingSoon")}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </nav>
              </div>
            </aside>
          )}
        </div>

        {/* 二级菜单 - 占据实际宽度（只有选中的分类才显示） */}
        {showSubNav && activeSubNavCategory && (
          <aside
            className="w-56 h-full bg-background border-r border-border flex flex-col transition-all duration-300 z-40"
          >
            <div className="h-16 flex items-center px-4">
              <span className="font-semibold text-sm">{t(activeSubNavCategory.translationKey)}</span>
            </div>
            <nav className="flex-1 overflow-y-auto p-2 space-y-1">
              {activeSubNavCategory.subNav.map((subItem) => {
                const isSubActive = currentSubNavId === subItem.id;
                return (
                  <LinkButton
                    key={subItem.id}
                    href={subItem.route}
                    variant={isSubActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start transition-all duration-200",
                      !isSubActive && "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="font-medium">{t(subItem.label)}</span>
                  </LinkButton>
                );
              })}
            </nav>
          </aside>
        )}
      </div>
    </TooltipProvider>
  );
}
