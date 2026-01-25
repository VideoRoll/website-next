"use client";

import * as React from "react";
import { useTranslations, useLocale, changeLanguage } from "@/contexts/I18nContext";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  LogOut,
  LayoutDashboard,
  Wrench,
  Search,
  Bell,
  Moon,
  Sun,
  Globe,
  Loader2,
  Check,
  LogIn,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "next-themes";
import { createClient } from "@website-next/auth/supabase/client";
import { getAuthConfig } from "@/lib/auth-init";
import Image from "next/image";

function isDashboardRoute(pathname: string): boolean {
  return pathname.startsWith("/dashboard") || (!pathname.startsWith("/tools") && pathname !== "/");
}

function isToolsRoute(pathname: string): boolean {
  return pathname.startsWith("/tools");
}

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const moduleT = useTranslations("common.modules");
  const navT = useTranslations("dashboard.navigation");
  const commonT = useTranslations("common");
  const locale = useLocale();
  const { currentUser, isLoading } = useUser();
  const { setTheme } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const isDashboard = isDashboardRoute(pathname);
  const isTools = isToolsRoute(pathname);

  const userEmail = currentUser?.email || "user@example.com";
  const userName =
    currentUser?.user_metadata?.name ||
    currentUser?.email?.split("@")[0] ||
    "User";
  const userInitials =
    userName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "VR";

  const handleLogin = () => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
      window.location.href = `http://localhost:3001/${locale}/signin`;
    } else {
      window.location.href = `${window.location.origin}/${locale}/signin`;
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      const config = getAuthConfig();
      const supabase = createClient(config);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout failed:", error);
        setIsLoggingOut(false);
        return;
      }
      
      // Refresh the current page after successful logout
      window.location.reload();
    } catch (err) {
      console.error("Failed to logout:", err);
      setIsLoggingOut(false);
    }
  };

  const handleLanguageChange = (lng: 'zh' | 'en') => {
    changeLanguage(lng);
  };

  return (
    <>
      {/* Fullscreen Loading Overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">{navT("logout")}...</p>
          </div>
        </div>
      )}
      
      <header className="flex h-16 items-center justify-between border-b border-border/40 bg-card/40 backdrop-blur-sm px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/console/favicon.ico"
            alt="VideoRoll"
            width={32}
            height={32}
            className="object-contain"
          />
        </div>

        {/* 居中的导航菜单 - 带边框的圆角容器 */}
        <div className="flex items-center gap-1 p-1 rounded-lg border border-border/60 bg-card/60 backdrop-blur-sm">
          <LinkButton
            href="/dashboard/profile"
            variant={isDashboard ? "default" : "ghost"}
            className="rounded-md transition-all duration-200 h-8 px-3"
          >
            <LayoutDashboard className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-sm">{moduleT("dashboard")}</span>
          </LinkButton>
          <LinkButton
            href="/tools"
            variant={isTools ? "default" : "ghost"}
            className="rounded-md transition-all duration-200 h-8 px-3"
          >
            <Wrench className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-sm">{moduleT("tools")}</span>
          </LinkButton>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Button */}
          {/* <Button
            variant="ghost"
            size="icon"
            className="hover:bg-accent/50 transition-colors"
          >
            <Search className="h-4 w-4" />
          </Button> */}

          {/* Notifications */}
          {/* <Button
            variant="ghost"
            size="icon"
            className="hover:bg-accent/50 transition-colors relative"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full border-2 border-card"></span>
          </Button> */}

          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Language Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-4 w-4" />
                <span className="sr-only">Toggle language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
                {locale === 'en' && <Check className="mr-2 h-4 w-4" />}
                {locale !== 'en' && <span className="mr-2 w-4" />}
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange('zh')}>
                {locale === 'zh' && <Check className="mr-2 h-4 w-4" />}
                {locale !== 'zh' && <span className="mr-2 w-4" />}
                中文
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu or Login Button */}
          {isLoading ? (
            <Button variant="ghost" size="icon" disabled>
              <Loader2 className="h-4 w-4 animate-spin" />
            </Button>
          ) : currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-accent/50 transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser?.user_metadata?.avatar_url} />
                    <AvatarFallback className="text-xs">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>{navT("profile")}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="mr-2 h-4 w-4" />
                  )}
                  <span>{navT("logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="default"
              onClick={handleLogin}
              className="flex items-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              <span>{commonT("loginButton")}</span>
            </Button>
          )}
        </div>
      </header>
    </>
  );
}
