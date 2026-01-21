"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Analytics() {
  const t = useTranslations("dashboard.stats");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("views")}</CardTitle>
            <CardDescription>Total page views this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">45,231</div>
            <div className="flex h-[200px] items-center justify-center text-muted-foreground">
              Views Chart Placeholder
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("sessions")}</CardTitle>
            <CardDescription>Active sessions this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12,543</div>
            <div className="flex h-[200px] items-center justify-center text-muted-foreground">
              Sessions Chart Placeholder
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("bounceRate")}</CardTitle>
            <CardDescription>Average bounce rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">32.5%</div>
            <div className="flex h-[200px] items-center justify-center text-muted-foreground">
              Bounce Rate Chart Placeholder
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("avgDuration")}</CardTitle>
            <CardDescription>Average session duration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4m 32s</div>
            <div className="flex h-[200px] items-center justify-center text-muted-foreground">
              Duration Chart Placeholder
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
