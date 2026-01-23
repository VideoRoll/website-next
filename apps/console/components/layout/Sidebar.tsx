"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
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
} from "lucide-react";
import { usePathname } from "@/i18n/navigation";
import { LinkButton } from "@/components/ui/link-button";
import Image from "next/image";

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
  isCollapsed: boolean;
}

export function Sidebar({ activeItem, isCollapsed }: SidebarProps) {
  const t = useTranslations("dashboard.navigation");
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0} skipDelayDuration={0}>
      <aside
        className={cn(
          "flex h-full flex-col transition-all duration-300 overflow-hidden",
          isCollapsed ? "w-16" : "w-56"
        )}
      >
        {/* Logo / Brand */}
        <div className="flex h-16 items-center justify-start px-4">
          
          <Image
            src="/console/favicon.ico"
            alt="VideoRoll"
            width={32}
            height={32}
            className="object-contain"
          />
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
    <LinkButton
      href={getNavPath(item.id)}
      variant={isActive ? "default" : "ghost"}
      className={cn(
        "w-full justify-start transition-all duration-200",
        !isActive && "text-muted-foreground hover:text-foreground",
        isCollapsed && "justify-center px-2"
      )}
    >
      <Icon className={cn("h-4 w-4 transition-transform", !isCollapsed && "mr-2", isActive && "scale-110")} />
      {!isCollapsed && <span className="font-medium">{label}</span>}
    </LinkButton>
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
