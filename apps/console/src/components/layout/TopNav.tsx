import * as React from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
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
  Settings,
  LogOut,
  LayoutDashboard,
  Wrench,
  Search,
  Bell,
  Moon,
  Sun,
  Loader2,
  Languages,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "next-themes";
import { createClient } from "@website-next/auth/supabase/client";
import { getAuthConfig } from "@/lib/auth-init";

function isDashboardRoute(pathname: string): boolean {
  return !pathname.startsWith("/tools") && pathname !== "/";
}

function isToolsRoute(pathname: string): boolean {
  return pathname.startsWith("/tools");
}

function getUserInfo(currentUser: any) {
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

  return { userEmail, userName, userInitials };
}

export function TopNav() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { currentUser } = useUser();
  const { setTheme } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const isDashboard = isDashboardRoute(location.pathname);
  const isTools = isToolsRoute(location.pathname);

  const { userEmail, userName, userInitials } = getUserInfo(currentUser);
  const currentLanguage = i18n.language || "en";

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

      window.location.reload();
    } catch (err) {
      console.error("Failed to logout:", err);
      setIsLoggingOut(false);
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("console-locale", lng);
  };

  return (
    <>
      {/* Fullscreen Loading Overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              {t("dashboard.navigation.logout")}...
            </p>
          </div>
        </div>
      )}

      <header className="flex h-16 items-center justify-between border-b border-border/40 bg-card/40 backdrop-blur-sm px-6">
        <div className="flex items-center gap-2">
          <LinkButton
            to="/profile"
            variant={isDashboard ? "default" : "ghost"}
            className="rounded-lg transition-all duration-200"
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            {t("common.modules.dashboard")}
          </LinkButton>
          <LinkButton
            to="/tools"
            variant={isTools ? "default" : "ghost"}
            className="rounded-lg transition-all duration-200"
          >
            <Wrench className="h-4 w-4 mr-2" />
            {t("common.modules.tools")}
          </LinkButton>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-accent/50 transition-colors"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-accent/50 transition-colors relative"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full border-2 border-card"></span>
          </Button>

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
                <Languages className="h-4 w-4" />
                <span className="sr-only">{t("common.language")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => changeLanguage("en")}
                className={cn(currentLanguage === "en" && "bg-accent")}
              >
                {t("common.languages.en")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => changeLanguage("zh")}
                className={cn(currentLanguage === "zh" && "bg-accent")}
              >
                {t("common.languages.zh")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 hover:bg-accent/50 transition-colors"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser?.user_metadata?.avatar_url} />
                  <AvatarFallback className="text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-medium">{userName}</span>
                  <span className="text-xs text-muted-foreground">
                    {userEmail}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
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
                <span>{t("dashboard.navigation.logout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
}
