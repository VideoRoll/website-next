"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import {
  IconArrowRight,
  IconMedal,
  IconUserFilled,
  IconStarFilled,
} from "@tabler/icons-react";
import Youtube from "@/components/icons/Youtube";
import Bilibili from "@/components/icons/Bilibili";
import X from "@/components/icons/X";
import Vimeo from "@/components/icons/Vimeo";
import Twitch from "@/components/icons/Twitch";
import Facebook from "@/components/icons/Facebook";
import Instagram from "@/components/icons/Instagram";
import Tiktok from "@/components/icons/Tiktok";
import Chrome from "@/components/icons/Chrome";
import Edge from "@/components/icons/Edge";
import Firefox from "@/components/icons/Firefox";
import AnimationText from "@/components/ui/AnimationText";
import Item1 from "@/components/icons/item1.png";
import Item2 from "@/components/icons/item2.png";
import Item3 from "@/components/icons/item3.png";
import { Button } from "@heroui/react";
import { useTranslations, useLocale } from "next-intl";
import CanvasStar from "./CanvasStar";

const platforms = [
  { name: "YouTube", icon: <Youtube /> },
  { name: "Bilibili", icon: <Bilibili /> },
  { name: "X", icon: <X /> },
  { name: "Vimeo", icon: <Vimeo /> },
  { name: "Twitch", icon: <Twitch /> },
  { name: "Facebook", icon: <Facebook /> },
  { name: "Instagram", icon: <Instagram /> },
  { name: "Tiktok", icon: <Tiktok /> },
];

export default function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();

  // framer-motion 滚动动画
  const { scrollY } = useScroll();
  const iconTranstion1 = useTransform(scrollY, [200, 300], [0, -40]);
  const iconTranstion2 = useTransform(scrollY, [100, 200], [0, -40]);
  const iconTranstion3 = useTransform(scrollY, [0, 100], [0, -40]);
  const videoY = useTransform(scrollY, [200, 600], [0, -60]);

  // features/advantages/reviews等数据用t获取
  const features = useMemo(
    () => [
      { title: t("features.0.title"), desc: t("features.0.desc") },
      { title: t("features.1.title"), desc: t("features.1.desc") },
      { title: t("features.2.title"), desc: t("features.2.desc") },
      { title: t("features.3.title"), desc: t("features.3.desc") },
      { title: t("features.4.title"), desc: t("features.4.desc") },
      { title: t("features.5.title"), desc: t("features.5.desc") },
      { title: t("features.6.title"), desc: t("features.6.desc") },
      { title: t("features.7.title"), desc: t("features.7.desc") },
      { title: t("features.8.title"), desc: t("features.8.desc") },
    ],
    [t]
  );

  const advantages = useMemo(
    () => [
      { title: t("advantages.0.title"), desc: t("advantages.0.desc") },
      { title: t("advantages.1.title"), desc: t("advantages.1.desc") },
      { title: t("advantages.2.title"), desc: t("advantages.2.desc") },
    ],
    [t]
  );

  const reviews = useMemo(
    () => [
      { user: t("reviews.0.user"), comment: t("reviews.0.comment"), stars: 5 },
      { user: t("reviews.1.user"), comment: t("reviews.1.comment"), stars: 5 },
      { user: t("reviews.2.user"), comment: t("reviews.2.comment"), stars: 5 },
      { user: t("reviews.3.user"), comment: t("reviews.3.comment"), stars: 5 },
      { user: t("reviews.4.user"), comment: t("reviews.4.comment"), stars: 5 },
    ],
    [t]
  );

  const texts = useMemo(
    () => [
      { text: t("animation.0.text"), color: "#837cdd" },
      { text: t("animation.1.text"), color: "#69c4c9" },
      { text: t("animation.2.text"), color: "#eab308" },
      { text: t("animation.3.text"), color: "#2d96b7" },
      { text: t("animation.4.text"), color: "#16a34a" },
      { text: t("animation.5.text"), color: "#2563eb" },
      { text: t("animation.6.text"), color: "#2d96b7" },
      { text: t("animation.7.text"), color: "#ef72b8" },
      { text: t("animation.8.text"), color: "#eab308" },
      { text: t("animation.9.text"), color: "#db2777" },
      { text: t("animation.10.text"), color: "#eab308" },
      { text: t("animation.11.text"), color: "#ef72b8" },
    ],
    [t]
  );

  return (
    <div className="w-full">
      {/* Canvas星点动效层 */}
      <CanvasStar></CanvasStar>
      {/* 1. Hero 标题+平台图标 */}
      <section className="max-w-screen-2xl px-[5vw] mx-auto mb-10 relative flex md:flex-row items-center justify-between min-h-[60vh] pt-12 md:pt-24 overflow-hidden">
        {/* 左侧标题 */}
        <div className="ms:w-full flex-1 flex flex-col z-10">
          <motion.h1
            style={{ y: iconTranstion3 }}
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col font-extrabold text-3xl md:text-5xl lg:text-6xl mb-6"
          >
            <p className="mb-4">{t("title")}</p>
            <AnimationText
              className="text-2xl w-full md:text-4xl"
              prefix={t("animation.prefix")}
              prefixColor="#fff"
              texts={texts}
            />
          </motion.h1>
          <motion.p
            style={{ y: iconTranstion3 }}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base md:text-lg text-gray-500 dark:text-gray-300 max-w-xl mb-8"
          >
            {t("subtitle")}
          </motion.p>
          <motion.div style={{ y: iconTranstion3 }}>
            <Button
              color="primary"
              radius="full"
              variant="shadow"
              startContent={<Chrome size={22} />}
              className="mr-4"
              onPress={() =>
                window.open(
                  "https://chromewebstore.google.com/detail/cokngoholafkeghnhhdlmiadlojpindm",
                  "_blank"
                )
              }
            >
              {t("chrome")}
            </Button>
            <Button
              color="primary"
              radius="full"
              variant="shadow"
              startContent={<Edge size={22} />}
              className="mr-4"
              onPress={() =>
                window.open(
                  "https://microsoftedge.microsoft.com/addons/detail/video-roll/indeeigndpaahbcegcanpmbenmkbkmmn",
                  "_blank"
                )
              }
            >
              {t("edge")}
            </Button>
            <Button
              color="primary"
              radius="full"
              variant="shadow"
              startContent={<Firefox size={22} />}
              onPress={() =>
                window.open(
                  "https://addons.mozilla.org/en-US/firefox/addon/videoroll/",
                  "_blank"
                )
              }
            >
              {t("firefox")}
            </Button>
          </motion.div>
        </div>

        <div className="absolute right-0 hidden md:block">
          <DotLottieReact
            src="https://lottie.host/483db3d9-6961-472c-b9b0-1e4c8cdb3807/9QCmQrjS8E.lottie"
            loop
            autoplay
            // dotLottieRefCallback={dotLottieRefCallback}
          />
        </div>
      </section>

      {/* 2. 介绍视频独立模块 */}
      <section className="mx-auto relative flex justify-center z-20 mt-54 bg-background2">


      </section>

      {/* 3. 功能网格 */}
      <section className="max-w-screen-2xl px-[5vw] mx-auto relative z-30 py-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          {t("featuresTitle")}
        </h2>
        <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="
        grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3
      "
          >
            {features.map((f, i) => {
              const isLastRow =
                i >= features.length - (features.length % 3 || 3);
              const isLastCol = (i + 1) % 3 === 0;
              return (
                <div
                  key={f.title}
                  className={[
                    "p-6 text-center bg-transparent rounded-none shadow-none flex flex-col justify-center items-center min-h-[120px]",
                    !isLastRow ? "border-b border-dashed border-gray-500 " : "",
                    !isLastCol ? "border-r border-dashed border-gray-500" : "",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold mb-2">{f.title}</div>
                  <div className="text-gray-500 dark:text-gray-300 text-sm">
                    {f.desc}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* 4. 对比优势 */}
      <section className="max-w-screen-2xl px-[5vw] mx-auto py-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          {t("advantagesTitle")}
        </h2>
        <div className="flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto">
          {advantages.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-8 shadow border border-gray-100 dark:border-gray-700"
            >
              <div className="text-xl font-bold mb-2">{a.title}</div>
              <div className="text-gray-500 dark:text-gray-300">{a.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. 用户评价横向滚动 */}
      <section className="py-20 max-w-screen-2xl px-[5vw] mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          {t("reviewsTitle")}
        </h2>
        <motion.div
          className="flex gap-6 overflow-x-auto pb-4"
          whileTap={{ cursor: "grabbing" }}
        >
          {reviews.map((r, i) => (
            <motion.div
              key={r.user + i}
              className="min-w-[260px] bg-gradient-to-br from-yellow-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 shadow flex flex-col items-start"
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <IconUserFilled size={20} />
                <span className="font-semibold">{r.user}</span>
              </div>
              <div className="flex gap-1 text-yellow-500 mb-2">
                {Array.from({ length: r.stars }).map((_, idx) => (
                  <IconStarFilled key={idx} size={18} />
                ))}
              </div>
              <div className="text-gray-600 dark:text-gray-200">
                {r.comment}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
