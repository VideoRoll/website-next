"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button, Card, CardBody, CardHeader, Link } from "@heroui/react";
import {
  IconCheck,
  IconX,
  IconStarFilled,
  IconCrown,
  IconGift,
} from "@tabler/icons-react";
import { useTranslations, useLocale } from "next-intl";

export default function Pricing() {
  const t = useTranslations();
  const locale = useLocale();

  // 从国际化中获取所有功能描述，按分类组织
  const featureCategories = [
    {
      category: "video",
      title: t("pricing.features.video.title"),
      features: [
        { key: "rotate", label: t("pricing.features.video.rotate") },
        { key: "download", label: t("pricing.features.video.download") },
        { key: "video_url", label: t("pricing.features.video.video_url") },
        { key: "video_url_qr", label: t("pricing.features.video.video_url_qr") },
        { key: "loop", label: t("pricing.features.video.loop") },
        { key: "zoom", label: t("pricing.features.video.zoom") },
        { key: "rotate_adaptive", label: t("pricing.features.video.rotate_adaptive") },
        { key: "reposition", label: t("pricing.features.video.reposition") },
        { key: "focus", label: t("pricing.features.video.focus") },
        { key: "player", label: t("pricing.features.video.player") },
        { key: "filter", label: t("pricing.features.video.filter") },
        { key: "speed", label: t("pricing.features.video.speed") },
        { key: "pip", label: t("pricing.features.video.pip") },
        { key: "web_qr", label: t("pricing.features.video.web_qr") },
        { key: "screenshot", label: t("pricing.features.video.screenshot") },
        { key: "video_stretch", label: t("pricing.features.video.video_stretch") },
        { key: "advanced_pip", label: t("pricing.features.video.advanced_pip") },
        { key: "ai_summary", label: t("pricing.features.video.ai_summary") },
        { key: "record", label: t("pricing.features.video.record") },
        { key: "ab_loop", label: t("pricing.features.video.ab_loop") },
        { key: "vr", label: t("pricing.features.video.vr") }
      ],
    },
    {
      category: "audio",
      title: t("pricing.features.audio.title"),
      features: [
        { key: "volume_boost", label: t("pricing.features.audio.volume_boost") },
        { key: "pitch", label: t("pricing.features.audio.pitch") },
        { key: "audio_delay", label: t("pricing.features.audio.audio_delay") },
        { key: "audio_stereo", label: t("pricing.features.audio.audio_stereo") },
        { key: "3d_surround", label: t("pricing.features.audio.3d_surround") },
      ],
    },
    {
      category: "other",
      title: t("pricing.features.other.title"),
      features: [
        { key: "ad_accelerator", label: t("pricing.features.other.ad_accelerator") },
        { key: "platform_support", label: t("pricing.features.other.platform_support") },
        { key: "disable", label: t("pricing.features.other.disable") },
        { key: "cache_list", label: t("pricing.features.other.cache_list") },
        { key: "disable_list", label: t("pricing.features.other.disable_list") },
        { key: "custom_shortcuts", label: t("pricing.features.other.custom_shortcuts") },
        { key: "custom_layout", label: t("pricing.features.other.custom_layout") },
      ],
    },
  ];

  // 将所有功能平铺用于生成 proFeatures
  const allFeatures = featureCategories.flatMap(
    (category) => category.features
  );

  // Free计划的功能可用性（您可以根据需要修改）
  const freeFeatures = {
    rotate: true,
    download: true,
    record: false,
    ai_summary: true,
    vr: false,
    pitch: false,
    audio_delay: false,
    loop: true,
    zoom: true,
    player: true,
    filter: true,
    speed: true,
    ad_accelerator: true,
    pip: true,
    screenshot: true,
    volume_boost: true,
    custom_shortcuts: true,
    platform_support: true,
    privacy_protection: true,
    "3d_surround": false,
    video_stretch: true,
    color_adjustment: true,
    brightness_control: true,
    contrast_adjustment: true,
    saturation_control: true,
    advanced_pip: true,
    custom_layout: false,
    audio_stereo: false,
    ab_loop: false,
    rotate_adaptive: true,
    video_url: true,
    video_url_qr: true,
    web_qr: true,
    reposition: true,
    focus: true,
    disable: true,
    cache_list: true,
    disable_list: true,
  };

  // Pro计划所有功能都可用
  const proFeatures = Object.fromEntries(
    allFeatures.map((feature) => [feature.key, true])
  );

  return (
    <div className="w-full min-h-screen bg-background">
      {/* 标题部分 */}
      <section className="max-w-screen-2xl px-[5vw] mx-auto pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {t("pricing.title")}
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-300 max-w-2xl mx-auto">
            {t("pricing.subtitle")}
          </p>
        </motion.div>
      </section>

      {/* 价格卡片 */}
      <section className="max-w-screen-2xl px-[5vw] mx-auto pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Free 计划 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="relative h-full bg-gradient-to-br from-gray-900/50 to-gray-900/10 backdrop-blur-sm border border-gray-700/30 hover:border-primary/30 transition-all duration-500">
              <CardHeader className="pb-4 h-[160px] flex flex-col items-start justify-start">
                {/* 标题行 - 固定高度，左对齐 */}
                <div className="flex items-center justify-start gap-3 h-12 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shrink-0">
                    <IconGift size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold leading-tight text-left">
                      {t("pricing.free.title")}
                    </h3>
                  </div>
                </div>

                {/* 描述区域 - 剩余空间，左对齐 */}
                <div className="flex-1 flex flex-col justify-start">
                  <div className="px-2">
                    <p className="text-sm text-white font-medium leading-relaxed">
                      {t("pricing.free.description")}
                    </p>
                    {/* 占位行，与Pro卡片的disclaimer对齐 */}
                    <div className="h-4"></div>
                  </div>
                </div>
              </CardHeader>

              <CardBody className="pt-0">
                <div className="space-y-4 mb-6">
                  {featureCategories.map((category, categoryIndex) => (
                    <div key={category.category}>
                      {/* 分类标题 */}
                      <div className="mb-2">
                        <h4 className="text-base font-semibold text-gray-400 uppercase tracking-wide">
                          {category.title}
                        </h4>
                      </div>
                      {/* 分类功能列表 */}
                      <div className="space-y-2 ml-2">
                        {category.features.map((feature, index) => (
                          <div
                            key={feature.key}
                            className="flex items-center gap-3"
                          >
                            {freeFeatures[feature.key] ? (
                              <IconCheck
                                size={20}
                                className="text-green-500 shrink-0"
                              />
                            ) : (
                              <IconX
                                size={20}
                                className="text-red-500 shrink-0"
                              />
                            )}
                            <span
                              className={`text-lg ${
                                freeFeatures[feature.key]
                                  ? "text-foreground"
                                  : "text-gray-500 line-through"
                              }`}
                            >
                              {feature.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  color="primary"
                  variant="flat"
                  size="lg"
                  className="w-full"
                  onPress={() =>
                    window.open(
                      "https://chromewebstore.google.com/detail/cokngoholafkeghnhhdlmiadlojpindm",
                      "_blank"
                    )
                  }
                >
                  {t("pricing.free.button")}
                </Button>
              </CardBody>
            </Card>
          </motion.div>

          {/* Pro 计划 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="relative h-full bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm border border-primary/30 hover:border-primary/50 transition-all duration-500">
              <CardHeader className="pb-4 h-[160px] flex flex-col justify-start items-start">
                {/* 标题行 - 固定高度，左对齐，推荐标识在右侧 */}
                <div className="flex items-center justify-start gap-3 h-12 mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center shrink-0">
                      <IconCrown size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold leading-tight text-left">
                        {t("pricing.pro.title")}
                      </h3>
                    </div>
                  </div>
                  {/* 推荐标识 - 与标题同行 */}
                  <div className="shrink-0">
                    <div className="bg-gradient-to-r from-primary to-secondary px-3 py-1 rounded-full">
                      <span className="text-white text-xs font-semibold flex items-center gap-1">
                        <IconStarFilled size={14} />
                        {t("pricing.pro.recommended")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 描述区域 - 剩余空间，左对齐 */}
                <div className="flex-1 flex flex-col justify-start">
                  <div className="px-2">
                    <p className="text-sm text-white font-medium leading-relaxed">
                      {t("pricing.pro.description")}
                    </p>
                    <p className="text-xs text-white/70 mt-2 leading-relaxed">
                      {t("pricing.pro.disclaimer")}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardBody className="pt-0">
                <div className="space-y-4 mb-6">
                  {featureCategories.map((category, categoryIndex) => (
                    <div key={category.category}>
                      {/* 分类标题 */}
                      <div className="mb-2">
                        <h4 className="text-base font-semibold text-gray-400 uppercase tracking-wide">
                          {category.title}
                        </h4>
                      </div>
                      {/* 分类功能列表 */}
                      <div className="space-y-2 ml-2">
                        {category.features.map((feature, index) => (
                          <div
                            key={feature.key}
                            className="flex items-center gap-3"
                          >
                            <IconCheck
                              size={20}
                              className="text-green-500 shrink-0"
                            />
                            <span className="text-lg text-foreground">
                              {feature.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  color="primary"
                  variant="shadow"
                  size="lg"
                  className="w-full"
                  as={Link}
                  href={`/${locale}/signin`}
                >
                  {t("pricing.pro.button")}
                </Button>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
