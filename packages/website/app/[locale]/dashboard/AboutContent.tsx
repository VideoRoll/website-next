"use client";

import { Divider, Link } from "@heroui/react";
import { useTranslations } from "next-intl";

export default function AboutContent() {
  const t = useTranslations("dashboard");

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">{t("about.title")}</h3>
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">{t("about.description")}</p>
        <Divider />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium">{t("about.pluginInfo")}</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">{t("about.version")} </span>
                <span className="font-medium">v2.0.7</span>
              </div>
              <div>
                <span className="text-gray-500">{t("about.developer")} </span>
                <span className="font-medium">VideoRoll Team</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium">{t("about.contact")}</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">{t("about.email")} </span>
                <Link href="mailto:support@videoroll.app" size="sm">
                  support@videoroll.app
                </Link>
              </div>
              <div>
                <span className="text-gray-500">{t("about.website")} </span>
                <Link href="https://docs.videoroll.app" isExternal size="sm">
                  documentation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
