'use client';

import * as React from "react";
import { useTranslations } from "@/contexts/I18nContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SubscriptionContent() {
  const t = useTranslations("dashboard.subscription");

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">{t("title")}</h3>
      <Card className="max-w-md">
        <CardHeader className="text-center">
          <Badge variant="secondary" className="mb-2">
            {t("freePlan")}
          </Badge>
          <CardTitle>{t("freePlan")}</CardTitle>
          <CardDescription>{t("freePlanDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm text-muted-foreground">
            {Array.from({ length: 3 }, (_, i) => (
              <p key={i}>✓ {t(`features.${i}`)}</p>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            {t("upgrade")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
