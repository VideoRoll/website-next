"use client";

import { Card, CardBody, Chip, Button } from "@heroui/react";
import { useTranslations } from "next-intl";

export default function SubscriptionContent() {
  const t = useTranslations("dashboard");

  return (
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
}
