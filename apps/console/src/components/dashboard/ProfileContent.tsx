import * as React from "react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

export function ProfileContent() {
  const { t, i18n } = useTranslation();
  const { currentUser } = useUser();

  const userMeta = currentUser?.user_metadata ?? {};
  const appMeta = currentUser?.app_metadata ?? {};
  const userEmail = currentUser?.email || userMeta.email || '';
  const userName = userMeta.full_name || userMeta.name || userEmail.split('@')[0] || 'User';
  const avatarUrl = userMeta.avatar_url;
  const createdAt = currentUser?.created_at;
  const lastSignInAt = currentUser?.last_sign_in_at;
  const locale = i18n.language || 'en';

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString(locale === "zh" ? "zh-CN" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getProviderLabel = () => {
    const provider = appMeta.provider;
    if (provider === "google") return t("dashboard.profile.googleAccount");
    if (provider === "github") return t("dashboard.profile.githubAccount");
    return t("dashboard.profile.emailAccount");
  };

  const getProviderMethod = () => {
    const provider = appMeta.provider;
    if (provider === "google") return t("dashboard.profile.googleOAuth");
    if (provider === "github") return t("dashboard.profile.githubOAuth");
    return t("dashboard.profile.emailPassword");
  };

  const userInitials = userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        <Avatar className="w-20 h-20">
          <AvatarImage src={avatarUrl} alt={userName} />
          <AvatarFallback>
            <User className="h-10 w-10" />
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-xl font-semibold">{userName}</h3>
          <p className="text-muted-foreground break-all">{userEmail}</p>
          <Badge variant="secondary" className="w-fit">
            {getProviderLabel()}
          </Badge>
        </div>
      </div>
      <Separator />
      <div className="space-y-4">
        <h4 className="text-lg font-medium">{t("dashboard.profile.accountInfo")}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{t("dashboard.profile.loginEmail")}</p>
            <p className="font-medium break-all">{userEmail}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("dashboard.profile.loginMethod")}</p>
            <p className="font-medium">{getProviderMethod()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("dashboard.profile.createdAt")}</p>
            <p className="font-medium">{formatDate(createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("dashboard.profile.lastSignInAt")}</p>
            <p className="font-medium">{formatDate(lastSignInAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
