"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { usePathname, Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
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

export function TopNav() {
  const pathname = usePathname();
  const moduleT = useTranslations("common.modules");
  const navT = useTranslations("dashboard.navigation");
  const { currentUser } = useUser();
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
        <div className="flex items-center gap-2">
        <Link
          href="/profile"
          className={cn(
            buttonVariants({
              variant: isDashboard ? "secondary" : "ghost",
            }),
            "rounded-lg transition-all duration-200",
            isDashboard && "text-primary bg-secondary"
          )}
        >
          <LayoutDashboard className="h-4 w-4 mr-2" />
          {moduleT("dashboard")}
          123123123123
        </Link>
        <Link
          href="/tools"
          className={cn(
            buttonVariants({
              variant: isTools ? "secondary" : "ghost",
            }),
            "rounded-lg transition-all duration-200",
            isTools && "text-primary bg-secondary"
          )}
        >
          <Wrench className="h-4 w-4 mr-2" />
          {moduleT("tools")}
        </Link>
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
              <span>{navT("logout")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
    </>
  );
}
