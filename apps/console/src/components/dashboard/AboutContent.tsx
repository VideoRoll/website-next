import * as React from "react";
import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";

export function AboutContent() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">{t("dashboard.about.title")}</h3>
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">{t("dashboard.about.description")}</p>
        <Separator />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium">{t("dashboard.about.pluginInfo")}</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">{t("dashboard.about.version")} </span>
                <span className="font-medium">v2.0.7</span>
              </div>
              <div>
                <span className="text-muted-foreground">{t("dashboard.about.developer")} </span>
                <span className="font-medium">VideoRoll Team</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium">{t("dashboard.about.contact")}</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">{t("dashboard.about.email")} </span>
                <a href="mailto:support@videoroll.app" className="text-primary hover:underline">
                  support@videoroll.app
                </a>
              </div>
              <div>
                <span className="text-muted-foreground">{t("dashboard.about.website")} </span>
                <a href="https://docs.videoroll.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  documentation
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
