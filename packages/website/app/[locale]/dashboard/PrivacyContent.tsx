"use client";

import { Divider } from "@heroui/react";
import { useTranslations } from "next-intl";

export default function PrivacyContent() {
  const t = useTranslations("dashboard");

  return (
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
        <p className="text-sm text-gray-600">{t("privacy.footer")}</p>
      </div>
    </div>
  );
}
