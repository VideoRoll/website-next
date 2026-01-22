'use client';

import * as React from "react";
import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";

export function PrivacyContent() {
  const t = useTranslations("dashboard.privacy");

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">{t("title")}</h3>
      <div className="prose max-w-none">
        <p className="text-muted-foreground leading-relaxed mb-4">
          {t("intro")}
        </p>
        <ul className="space-y-2 text-muted-foreground">
          {Array.from({ length: 5 }, (_, i) => (
            <li key={i}>• {t(`policies.${i}`)}</li>
          ))}
        </ul>
        <Separator className="my-6" />
        <p className="text-sm text-muted-foreground">{t("footer")}</p>
      </div>
    </div>
  );
}
