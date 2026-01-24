import * as React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SubscriptionContent() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">{t("dashboard.subscription.title")}</h3>
      <Card className="max-w-md">
        <CardHeader className="text-center">
          <Badge variant="secondary" className="mb-2">
            {t("dashboard.subscription.freePlan")}
          </Badge>
          <CardTitle>{t("dashboard.subscription.freePlan")}</CardTitle>
          <CardDescription>{t("dashboard.subscription.freePlanDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm text-muted-foreground">
            {Array.from({ length: 3 }, (_, i) => (
              <p key={i}>✓ {t(`dashboard.subscription.features.${i}`)}</p>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            {t("dashboard.subscription.upgrade")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
