"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  User,
  UserCircle,
  CreditCard,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePathname, Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";

interface NavItem {
  id: string;
  icon: React.ElementType;
  translationKey: string;
}

const dashboardNavItems: NavItem[] = [
  { id: "profile", icon: User, translationKey: "profile" },
  { id: "account", icon: UserCircle, translationKey: "account" },
  { id: "subscription", icon: CreditCard, translationKey: "subscription" },
  { id: "about", icon: Info, translationKey: "about" },
];

const getNavPath = (id: string) => {
  return `/${id}` as "/profile";
};

interface SidebarProps {
  activeItem: string;
}

export function Sidebar({ activeItem }: SidebarProps) {
  const t = useTranslations("dashboard.navigation");
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <TooltipProvider delayDuration={0} skipDelayDuration={0}>
      <aside
        className={cn(
          "flex h-full flex-col transition-all duration-300 overflow-hidden",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo / Brand */}
        <div className="flex h-16 items-center px-4">
          {!isCollapsed && (
            <span className="text-lg font-semibold text-sidebar-foreground">
              VideoRoll
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn("ml-auto h-8 w-8", isCollapsed && "mx-auto")}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto overflow-x-visible custom-scrollbar">
          {dashboardNavItems.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              isActive={activeItem === item.id}
              isCollapsed={isCollapsed}
              label={t(item.translationKey)}
            />
          ))}
        </nav>
      </aside>
    </TooltipProvider>
  );
}

interface NavButtonProps {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
  label: string;
}

function NavButton({
  item,
  isActive,
  isCollapsed,
  label,
}: NavButtonProps) {
  const Icon = item.icon;

  const button = (
    <Link
      href={getNavPath(item.id)}
      className={cn(
        buttonVariants({
          variant: isActive ? "secondary" : "ghost",
        }),
        "w-full justify-start transition-all duration-200",
        isActive && "text-primary",
        !isActive && "text-muted-foreground hover:text-foreground",
        isCollapsed && "justify-center px-2"
      )}
    >
      <Icon className={cn("h-4 w-4 transition-transform", !isCollapsed && "mr-2", isActive && "scale-110")} />
      {!isCollapsed && <span className="font-medium">{label}</span>}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8} className="z-[9999]">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return button;
}
