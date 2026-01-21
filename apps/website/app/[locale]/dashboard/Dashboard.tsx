"use client";

import React, { useMemo, useState } from "react";
import { Card, CardBody } from "@heroui/react";
import { useTranslations } from "next-intl";
import {
  IconUser,
  IconShieldCheck,
  IconCreditCard,
  IconInfoCircle,
  IconDashboard,
} from "@tabler/icons-react";
import CanvasStar from "@/components/ui/client/CanvasStar";
import ProfileContent from "./ProfileContent";
import PrivacyContent from "./PrivacyContent";
import SubscriptionContent from "./SubscriptionContent";
import AboutContent from "./AboutContent";
import AccountContent from "./AccountContent";

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
      icon: IconUser,
    },
    {
      key: "subscription",
      label: t("navigation.subscription"),
      icon: IconCreditCard,
    },
    {
      key: "account",
      label: t("navigation.account"),
      icon: IconDashboard,
    },
    {
      key: "privacy",
      label: t("navigation.privacy"),
      icon: IconShieldCheck,
    },

    {
      key: "about",
      label: t("navigation.about"),
      icon: IconInfoCircle,
    },
  ];

  const userMeta = useMemo(
    () => currentUser?.user_metadata ?? {},
    [currentUser]
  );
  const appMeta = useMemo(() => currentUser?.app_metadata ?? {}, [currentUser]);

  const userEmail = userMeta.email || "";

  const createdAt = currentUser?.created_at;
  const lastSignInAt = currentUser?.last_sign_in_at;

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <ProfileContent
            userMeta={userMeta}
            appMeta={appMeta}
            createdAt={createdAt}
            lastSignInAt={lastSignInAt}
          />
        );
      case "privacy":
        return <PrivacyContent />;
      case "subscription":
        return <SubscriptionContent />;
      case "about":
        return <AboutContent />;
      case "account":
        return <AccountContent userEmail={userEmail} />;
      default:
        return (
          <ProfileContent
            userMeta={userMeta}
            appMeta={appMeta}
            createdAt={createdAt}
            lastSignInAt={lastSignInAt}
          />
        );
    }
  };

  return (
    <>
      <div className="w-full h-[600px] absolute top-[-64px] overflow-hidden">
        <CanvasStar speed={1.8}></CanvasStar>
      </div>
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
                        <Icon size={20} stroke={1.5} />
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
                        <Icon size={20} stroke={1.5} />
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
