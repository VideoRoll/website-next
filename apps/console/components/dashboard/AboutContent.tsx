'use client';

import * as React from "react";
import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export function AboutContent() {
  const t = useTranslations("dashboard.about");

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">{t("title")}</h3>
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">{t("description")}</p>
        <Separator />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium">{t("pluginInfo")}</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">{t("version")} </span>
                <span className="font-medium">v2.0.7</span>
              </div>
              <div>
                <span className="text-muted-foreground">{t("developer")} </span>
                <span className="font-medium">VideoRoll Team</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium">{t("contact")}</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">{t("email")} </span>
                <Link href="mailto:support@videoroll.app" className="text-primary hover:underline">
                  support@videoroll.app
                </Link>
              </div>
              <div>
                <span className="text-muted-foreground">{t("website")} </span>
                <Link href="https://docs.videoroll.app" target="_blank" className="text-primary hover:underline">
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
