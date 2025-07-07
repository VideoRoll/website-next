"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  CheckboxGroup,
  Checkbox,
  Textarea,
  Spacer,
  Spinner,
} from "@heroui/react";
import { IconStar, IconSend, IconCheck, IconX } from "@tabler/icons-react";

interface FeedbackData {
  dissatisfiedFeatures: string[];
  desiredFeatures: string[];
  otherFeatures?: string;
  reason?: number;
}

interface RateFeedbackProps {
  reason?: number;
}

export default function RateFeedback({ reason }: RateFeedbackProps) {
  const t = useTranslations("rateFeedback");
  const [dissatisfiedFeatures, setDissatisfiedFeatures] = useState<string[]>(
    []
  );
  const [desiredFeatures, setDesiredFeatures] = useState<string[]>([]);
  const [otherFeatures, setOtherFeatures] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const dissatisfiedOptions = [
    { value: "video", label: t("options1.video") },
    { value: "audio", label: t("options1.audio") },
    { value: "performance", label: t("options1.performance") },
    { value: "ui", label: t("options1.ui") },
    { value: "interaction", label: t("options1.interaction") },
  ];

  const desiredOptions = [
    { value: "favorites", label: t("options2.favorites") },
    { value: "subtitles", label: t("options2.subtitles") },
    { value: "recording", label: t("options2.recording") },
    { value: "sharing", label: t("options2.sharing") },
    { value: "other", label: t("options2.other") },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (dissatisfiedFeatures.length === 0 && desiredFeatures.length === 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const feedbackData: FeedbackData = {
        dissatisfiedFeatures,
        desiredFeatures,
        otherFeatures: desiredFeatures.includes("other")
          ? otherFeatures
          : '',
        reason,
      };

      // Default API call
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      setSubmitStatus("success");
      // Reset form after successful submission
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = useMemo(
    () => dissatisfiedFeatures.length > 0 || desiredFeatures.length > 0,
    [dissatisfiedFeatures, desiredFeatures]
  );

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {submitStatus === "success" ? (
          <Card className="bg-green-800 border-green-700">
            <CardBody className="text-center py-8">
              <IconCheck className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-green-100 mb-2">
                {t("successMessage")}
              </h3>
            </CardBody>
          </Card>
        ) : (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-col items-center text-center pb-4">
              <div className="flex items-center gap-2 mb-2">
                <IconStar className="h-6 w-6 text-yellow-400" />
                <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
              </div>
              <p className="text-gray-300 text-sm">{t("subtitle")}</p>
            </CardHeader>

            <CardBody className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Question 1: Dissatisfied Features */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">
                    {t("question1")}
                  </h3>
                  <CheckboxGroup
                    value={dissatisfiedFeatures}
                    onValueChange={setDissatisfiedFeatures}
                    className="space-y-2"
                  >
                    {dissatisfiedOptions.map((option) => (
                      <Checkbox
                        key={option.value}
                        value={option.value}
                        className="text-gray-300"
                        classNames={{
                          label: "text-gray-300",
                          wrapper: "border-gray-600",
                        }}
                      >
                        {option.label}
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                </div>

                <Spacer y={2} />

                {/* Question 2: Desired Features */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">
                    {t("question2")}
                  </h3>
                  <CheckboxGroup
                    value={desiredFeatures}
                    onValueChange={setDesiredFeatures}
                    className="space-y-2"
                  >
                    {desiredOptions.map((option) => (
                      <Checkbox
                        key={option.value}
                        value={option.value}
                        className="text-gray-300"
                        classNames={{
                          label: "text-gray-300",
                          wrapper: "border-gray-600",
                        }}
                      >
                        {option.label}
                      </Checkbox>
                    ))}
                  </CheckboxGroup>

                  {/* Other Features Textarea */}
                  {desiredFeatures.includes("other") && (
                    <div className="mt-4">
                      <Textarea
                        value={otherFeatures}
                        onValueChange={setOtherFeatures}
                        placeholder={t("otherPlaceholder")}
                        minRows={3}
                        maxRows={6}
                        className="w-full"
                        classNames={{
                          input: "bg-gray-700 text-white placeholder-gray-400",
                          inputWrapper: "bg-gray-700 border-gray-600",
                        }}
                      />
                    </div>
                  )}
                </div>

                <Spacer y={2} />

                {/* Submit Button */}
                <div className="flex flex-col items-center space-y-4">
                  <Button
                    type="submit"
                    color="primary"
                    size="lg"
                    disabled={!isFormValid || isSubmitting}
                    startContent={
                      isSubmitting ? (
                        <Spinner size="sm" color="white" />
                      ) : (
                        <IconSend className="h-4 w-4" />
                      )
                    }
                    className="min-w-[200px]"
                  >
                    {isSubmitting ? t("submitting") : t("submitButton")}
                  </Button>

                  {/* Status Messages */}
                  {submitStatus === "error" && (
                    <div className="flex items-center gap-2 text-red-400">
                      <IconX className="h-4 w-4" />
                      <span className="text-sm">{t("errorMessage")}</span>
                    </div>
                  )}

                  {!isFormValid && (
                    <p className="text-gray-400 text-sm text-center">
                      {t("minSelection")}
                    </p>
                  )}
                </div>
              </form>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
