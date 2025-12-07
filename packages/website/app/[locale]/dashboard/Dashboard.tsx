"use client";

import React, { useMemo, useState } from "react";
import {
  Card,
  CardBody,
  Avatar,
  Button,
  Divider,
  Chip,
  Link,
  User,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import CanvasStar from "@/components/ui/client/CanvasStar";
// 临时使用文字图标，如果需要 Heroicons，请运行: npm install @heroicons/react
const UserIcon = () => <span>👤</span>;
const ShieldCheckIcon = () => <span>🛡️</span>;
const CreditCardIcon = () => <span>💳</span>;
const InformationCircleIcon = () => <span>ℹ️</span>;

type Props = {
  currentUser: any;
  error?: string;
};

export default function DashboardPage(props: Props) {
  const { currentUser, error } = props;
  const [activeTab, setActiveTab] = useState("profile");
  const t = useTranslations("dashboard");

  const NAVIGATION_ITEMS = [
    {
      key: "profile",
      label: t("navigation.profile"),
      icon: UserIcon,
    },
    {
      key: "privacy",
      label: t("navigation.privacy"),
      icon: ShieldCheckIcon,
    },
    {
      key: "subscription",
      label: t("navigation.subscription"),
      icon: CreditCardIcon,
    },
    {
      key: "about",
      label: t("navigation.about"),
      icon: InformationCircleIcon,
    },
  ];

  const userMeta = useMemo(
    () => currentUser?.user_metadata ?? {},
    [currentUser]
  );
  const appMeta = useMemo(() => currentUser?.app_metadata ?? {}, [currentUser]);
  const renderProfileContent = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        <Avatar
          src={userMeta.avatar_url}
          alt={userMeta.full_name}
          className="w-20 h-20"
        />
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-xl font-semibold">{userMeta.full_name}</h3>
          <p className="text-gray-600 break-all">{userMeta.email}</p>          <Chip
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
              : t("profile.emailAccount")
            }
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
                : t("profile.emailPassword")
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  const renderPrivacyContent = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">{t("privacy.title")}</h3>
      <div className="prose max-w-none">
        <p className="text-gray-700 leading-relaxed mb-4">
          {t("privacy.intro")}
        </p>
        <ul className="space-y-2 text-gray-700">
          {Array.from({ length: 5 }, (_, i) => (
            <li key={i}>• {t(`privacy.policies.${i}`)}</li>
          ))}
        </ul>
        <Divider className="my-6" />
        <p className="text-sm text-gray-600">
          {t("privacy.footer")}
        </p>
      </div>
    </div>
  );
  const renderSubscriptionContent = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">{t("subscription.title")}</h3>
      <Card className="max-w-md">
        <CardBody className="text-center space-y-4">
          <Chip color="success" variant="flat" size="lg">
            {t("subscription.freePlan")}
          </Chip>
          <p className="text-gray-600">{t("subscription.freePlanDesc")}</p>
          <div className="space-y-2 text-sm text-gray-500">
            {Array.from({ length: 3 }, (_, i) => (
              <p key={i}>✓ {t(`subscription.features.${i}`)}</p>
            ))}
          </div>
          <Button color="primary" variant="bordered" className="mt-4">
            {t("subscription.upgrade")}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
  const renderAboutContent = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">{t("about.title")}</h3>
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          {t("about.description")}
        </p>
        <Divider />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium">{t("about.pluginInfo")}</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">{t("about.version")}</span>
                <span className="font-medium">v2.0.0</span>
              </div>
              <div>
                <span className="text-gray-500">{t("about.developer")}</span>
                <span className="font-medium">VideoRoll Team</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium">{t("about.contact")}</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">{t("about.email")}</span>
                <Link href="mailto:support@videoroll.pro" size="sm">
                  support@videoroll.pro
                </Link>
              </div>
              <div>
                <span className="text-gray-500">{t("about.website")}</span>
                <Link href="https://videoroll.pro" isExternal size="sm">
                  videoroll.pro
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileContent();
      case "privacy":
        return renderPrivacyContent();
      case "subscription":
        return renderSubscriptionContent();
      case "about":
        return renderAboutContent();
      default:
        return renderProfileContent();
    }
  };
  return (
    <>
      <CanvasStar></CanvasStar>
      <div className="p-4 pt-20">
        <div className="max-w-6xl mx-auto">
          {/* 移动端顶部 Tab 导航 */}
          <div className="lg:hidden mb-6">
            <Card>
              <CardBody className="p-2">
                <div className="flex overflow-x-auto">
                  {NAVIGATION_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.key}
                        onClick={() => setActiveTab(item.key)}
                        className={`flex-shrink-0 flex flex-col items-center justify-center px-4 py-3 min-w-[80px] text-center transition-colors rounded-lg ${
                          activeTab === item.key
                            ? "bg-primary-100 text-primary-600"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <Icon />
                        <span className="text-xs font-medium mt-1 leading-tight">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* 桌面端左侧导航 */}
            <Card className="hidden lg:block lg:w-64 h-fit">
              <CardBody className="p-0">
                <nav className="space-y-1">
                  {NAVIGATION_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.key}
                        onClick={() => setActiveTab(item.key)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                          activeTab === item.key
                            ? "bg-primary-50 text-primary-600 border-r-2 border-primary-600"
                            : "text-gray-200 hover:bg-primary-50"
                        }`}
                      >
                        <Icon />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </CardBody>
            </Card>

            {/* 内容区域 */}
            <Card className="flex-1">
              <CardBody className="p-4 lg:p-8">{renderContent()}</CardBody>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
