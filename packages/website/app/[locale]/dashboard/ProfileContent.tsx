"use client";

import { Avatar, Divider, Chip } from "@heroui/react";
import { useTranslations, useLocale } from "next-intl";
import { IconUser } from "@tabler/icons-react";

type Props = {
  userMeta: {
    avatar_url?: string;
    full_name?: string;
    email?: string;
  };
  appMeta: {
    provider?: string;
  };
  createdAt?: string;
  lastSignInAt?: string;
};

export default function ProfileContent({ userMeta, appMeta, createdAt, lastSignInAt }: Props) {
  const t = useTranslations("dashboard");
  const locale = useLocale();

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        <Avatar
          src={userMeta.avatar_url}
          alt={userMeta.full_name}
          className="w-20 h-20"
          fallback={<IconUser size={48} stroke={1.5} />}
        />
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-xl font-semibold">{userMeta.full_name}</h3>
          <p className="text-gray-600 break-all">{userMeta.email}</p>
          <Chip
            color={
              appMeta.provider === "google"
                ? "primary"
                : appMeta.provider === "github"
                ? "secondary"
                : "default"
            }
            variant="flat"
            size="sm"
          >
            {appMeta.provider === "google"
              ? t("profile.googleAccount")
              : appMeta.provider === "github"
              ? t("profile.githubAccount")
              : t("profile.emailAccount")}
          </Chip>
        </div>
      </div>
      <Divider />
      <div className="space-y-4">
        <h4 className="text-lg font-medium">{t("profile.accountInfo")}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">{t("profile.loginEmail")}</p>
            <p className="font-medium break-all">{userMeta.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t("profile.loginMethod")}</p>
            <p className="font-medium">
              {appMeta.provider === "google"
                ? t("profile.googleOAuth")
                : appMeta.provider === "github"
                ? t("profile.githubOAuth")
                : t("profile.emailPassword")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t("profile.createdAt")}</p>
            <p className="font-medium">{formatDate(createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t("profile.lastSignInAt")}</p>
            <p className="font-medium">{formatDate(lastSignInAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
