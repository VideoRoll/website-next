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
  const locale = useLocale(); // framer-motion 滚动动画
  const { scrollY } = useScroll();
  const iconTranstion1 = useTransform(scrollY, [200, 300], [0, -40]);
  const iconTranstion2 = useTransform(scrollY, [100, 200], [0, -40]);
  const iconTranstion3 = useTransform(scrollY, [0, 100], [0, -40]);
  const videoY = useTransform(scrollY, [200, 600], [0, -60]);

  // 视频旋转动画：从45度倾斜到0度正常
  const videoRotateX = useTransform(scrollY, [100, 500], [20, 0]);
  const videoScale = useTransform(scrollY, [100, 500], [1, 1]);
  const videoOpacity = useTransform(scrollY, [100, 500], [0.7, 1]);

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
  ); // 瀑布流用户评论数据
  const waterfallReviews = useMemo(
    () => [
      {
        user: "Alex Chen",
        comment:
          "This extension has completely transformed my video workflow. The rotation feature is incredibly smooth and intuitive!",
        stars: 5,
        avatar: "AC",
      },
      {
        user: "Sarah Johnson",
        comment:
          "Love how easy it is to use. Works flawlessly with YouTube and other platforms. The interface is clean and doesn't interfere with the original player. I've been using it for months now and it's become an essential part of my daily browsing experience.",
        stars: 5,
        avatar: "SJ",
      },
      {
        user: "Miguel Rodriguez",
        comment:
          "Finally found an extension that actually works as advertised.",
        stars: 5,
        avatar: "MR",
      },
      {
        user: "Emma Thompson",
        comment:
          "Clean interface, powerful features. This is exactly what I needed for my video editing workflow. The picture-in-picture mode is particularly useful when I'm working on multiple projects simultaneously.",
        stars: 5,
        avatar: "ET",
      },
      {
        user: "David Kim",
        comment:
          "The picture-in-picture mode is a game changer. I can multitask while watching videos effortlessly. Performance is excellent and it doesn't slow down my browser at all.",
        stars: 5,
        avatar: "DK",
      },
      {
        user: "Lisa Wang",
        comment: "Impressive performance and reliability.",
        stars: 5,
        avatar: "LW",
      },
      {
        user: "James Wilson",
        comment:
          "The speed control feature is incredibly useful for educational content. I can slow down complex tutorials or speed up basic explanations. The quality remains crisp at all playback speeds, which is really impressive. Highly recommend to anyone who watches educational videos regularly!",
        stars: 5,
        avatar: "JW",
      },
      {
        user: "Anna Petrov",
        comment:
          "Love the minimalist design and how it doesn't interfere with the original video player interface. Simple but effective.",
        stars: 5,
        avatar: "AP",
      },
      {
        user: "Carlos Silva",
        comment:
          "Best video enhancement extension I've used. The quality improvements are noticeable immediately and the rotation controls are so smooth.",
        stars: 5,
        avatar: "CS",
      }
    ],
    []
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
            className="text-base md:text-lg text-gray-500 dark:text-gray-300 max-w-xl mb-6"
          >
            {t("subtitle")}
          </motion.p>

          {/* 五星评级和用户数量 */}
          <motion.div
            style={{ y: iconTranstion3 }}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex items-center gap-6 mb-8"
          >
            {/* 五星评级 */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1 text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <IconStarFilled key={i} size={18} />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {t("usersTrust")}
                </span>
              </div>
            </div>

            {/* 用户数量 */}
          </motion.div>

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

        <div className="w-1/3 absolute right-0 hidden md:block">
          <DotLottieReact
            src="https://lottie.host/483db3d9-6961-472c-b9b0-1e4c8cdb3807/9QCmQrjS8E.lottie"
            loop
            autoplay
            renderConfig={{
              devicePixelRatio: 1,
              autoResize: true,
            }}
            // dotLottieRefCallback={dotLottieRefCallback}
          />
        </div>
      </section>{" "}
      {/* 2. 介绍视频独立模块 */}
      <section className="max-w-screen-2xl px-[5vw] mx-auto relative flex justify-center z-20">
        <div className="w-full">
          {/* 视频标题 */}
          {/* 3D 旋转视频容器 */}
          <div
            className="relative mx-auto w-full"
            style={{ perspective: "1200px" }}
          >
            <motion.div
              style={{
                rotateX: videoRotateX,
                scale: videoScale,
                opacity: videoOpacity,
                transformStyle: "preserve-3d",
              }}
              className="relative w-full"
            >
              {/* 视频阴影效果 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl transform translate-y-2 blur-xl" />

              {/* 视频容器 */}
              <div className="w-full relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-700 dark:border-gray-700">
                {/* 视频播放器顶部栏装饰 */}
                <div className="flex items-center gap-2 p-4 bg-gray-800 dark:bg-gray-800 border-b border-gray-800 dark:border-gray-700">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 text-center text-sm text-gray-300 dark:text-gray-300">
                    VideoRoll - introduction
                  </div>
                </div>

                {/* 实际视频 */}
                <div className="relative aspect-video bg-gray-900">
                  {/* 视频占位内容（如果没有真实视频） */}
                  {/* <div className="absolute z-1 inset-0 flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
                    <div className="text-center text-white">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                        <svg
                          className="w-8 h-8"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {locale === "zh" ? "演示视频" : "Demo Video"}
                      </h3>
                      <p className="text-white/80">
                        {locale === "zh"
                          ? "展示 VideoRoll Pro 的核心功能"
                          : "Showcasing VideoRoll Pro's core features"}
                      </p>
                    </div>
                  </div> */}
                  {/* <iframe
                    height="100%"
                    width="100%;"
                    src="https://embed.wave.video/sHNa0OoGuLrsYO4i"
                    allow="autoplay; fullscreen"
                    scrolling="no"
                  ></iframe> */}
                  <div
                    className="wave_popover_embed z-10 absolute inset-0"
                    data-id="sHNa0OoGuLrsYO4i"
                    data-width="560"
                    data-height="300"
                  >
                    <div>
                      <img
                        src="https://embed.wave.video/sHNa0OoGuLrsYO4i/preview.jpg?width=1920&height=1080&play=true&color=%2330AEF2"
                        alt="null"
                        style={{
                          cursor: "pointer",
                          display: "block",
                          maxWidth: "100%",
                          objectFit: "cover",
                        }}
                        data-target="target"
                      />
                    </div>
                    <script src="https://wave.video/embed/popover-embed.js"></script>
                  </div>
                  {/* 视频覆盖层 - 功能标签 */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm">
                      <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      {locale === "zh" ? "实时功能演示" : "Live Feature Demo"}
                    </div>
                  </div>{" "}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>{" "}
      {/* 3. 功能网格 - 高级卡片式 */}
      <section className="relative z-30 py-20">
        <div className="max-w-screen-2xl px-[5vw] mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mt-4 mb-4">
            {t("featuresTitle")}
          </h2>
          <div className="mb-16 flex justify-center">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
          </div>

          {/* 交叉布局卡片容器 */}
          <div className="w-full mx-auto space-y-8">
            {/* 第一行：左1/3 右2/3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="group relative overflow-hidden md:col-span-1"
              >
                <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-900/10 backdrop-blur-sm rounded-2xl p-8 min-h-[200px] border border-gray-700/30 hover:border-purple-500/30 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-4 group-hover:text-purple-200 transition-colors duration-300">
                      {features[0]?.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-300 leading-relaxed">
                      {features[0]?.desc}
                    </p>
                  </div>

                  <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="group relative overflow-hidden md:col-span-2"
              >
                {" "}
                <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-900/10 backdrop-blur-sm rounded-2xl p-8 min-h-[200px] border border-gray-700/30 hover:border-purple-500/30 transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-4 group-hover:text-purple-200 transition-colors duration-300">
                      {features[1]?.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-300 leading-relaxed">
                      {features[1]?.desc}
                    </p>
                  </div>{" "}
                  {/* 视频网站图标 - 绝对定位在卡片底部 */}
                  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-end gap-4 p-8 transform translate-y-1/3">
                    {platforms
                      .filter((platform) =>
                        [
                          "YouTube",
                          "Bilibili",
                          "Vimeo",
                          "Twitch",
                          "Tiktok",
                          "X",
                          "Instagram",
                          "Facebook",
                        ].includes(platform.name)
                      )
                      .map((platform, index) => (
                        <div
                          key={platform.name}
                          className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-gray-400 group-hover:text-purple-300 transition-colors duration-300"
                        >
                          {platform.icon}
                        </div>
                      ))}
                  </div>
                  <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            </div>

            {/* 第二行：左2/3 右1/3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="group relative overflow-hidden md:col-span-2"
              >
                <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-900/10 backdrop-blur-sm rounded-2xl p-8 min-h-[200px] border border-gray-700/30 hover:border-purple-500/30 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-4 group-hover:text-purple-200 transition-colors duration-300">
                      {features[2]?.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-300 leading-relaxed">
                      {features[2]?.desc}
                    </p>
                  </div>

                  <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="group relative overflow-hidden md:col-span-1"
              >
                <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-900/10 backdrop-blur-sm rounded-2xl p-8 min-h-[200px] border border-gray-700/30 hover:border-purple-500/30 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-4 group-hover:text-purple-200 transition-colors duration-300">
                      {features[3]?.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-300 leading-relaxed">
                      {features[3]?.desc}
                    </p>
                  </div>

                  <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            </div>

            {/* 第三行：左1/3 右2/3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="group relative overflow-hidden md:col-span-1"
              >
                <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-900/10 backdrop-blur-sm rounded-2xl p-8 min-h-[200px] border border-gray-700/30 hover:border-purple-500/30 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-4 group-hover:text-purple-200 transition-colors duration-300">
                      {features[4]?.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-300 leading-relaxed">
                      {features[4]?.desc}
                    </p>
                  </div>

                  <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="group relative overflow-hidden md:col-span-2"
              >
                <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-900/10 backdrop-blur-sm rounded-2xl p-8 min-h-[200px] border border-gray-700/30 hover:border-purple-500/30 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-4 group-hover:text-purple-200 transition-colors duration-300">
                      {features[5]?.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-300 leading-relaxed">
                      {features[5]?.desc}
                    </p>
                  </div>

                  <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>{" "}
      {/* 4. 图片展示区块 */}
      <section className="max-w-screen-2xl px-[5vw] mx-auto py-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
          {t("interfaceTitle")}
        </h2>
        <div className="mb-16 flex justify-center">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
        </div>
        <div className="flex items-center justify-center gap-0 max-w-4xl mx-auto">
          {/* 左边图片 - 逆时针旋转15度 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
            style={{ transformOrigin: "right bottom" }}
          >
            <div
              className="relative transform -rotate-[15deg]"
              style={{
                filter:
                  "drop-shadow(0 0 30px rgba(147, 51, 234, 0.25)) drop-shadow(0 0 60px rgba(59, 130, 246, 0.15))",
              }}
            >
              <Image
                src={Item1}
                alt="Item 1"
                className="w-48 md:w-64 h-auto object-contain rounded-2xl"
              />
              {/* 发光效果背景 */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/15 via-blue-500/15 to-indigo-500/20 rounded-2xl blur-xl -z-10 scale-110" />
            </div>
          </motion.div>

          {/* 中间图片 - 不旋转 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10 -mx-8"
          >
            <div
              className="relative"
              style={{
                filter:
                  "drop-shadow(0 0 40px rgba(147, 51, 234, 0.3)) drop-shadow(0 0 80px rgba(59, 130, 246, 0.2))",
              }}
            >
              <Image
                src={Item2}
                alt="Item 2"
                className="w-56 md:w-72 h-auto object-contain rounded-2xl"
              />
              {/* 发光效果背景 */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-blue-500/20 to-indigo-500/25 rounded-2xl blur-xl -z-10 scale-110" />
            </div>
          </motion.div>

          {/* 右边图片 - 顺时针旋转15度 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
            style={{ transformOrigin: "left bottom" }}
          >
            <div
              className="relative transform rotate-[15deg]"
              style={{
                filter:
                  "drop-shadow(0 0 30px rgba(147, 51, 234, 0.25)) drop-shadow(0 0 60px rgba(59, 130, 246, 0.15))",
              }}
            >
              <Image
                src={Item3}
                alt="Item 3"
                className="w-48 md:w-64 h-auto object-contain rounded-2xl"
              />
              {/* 发光效果背景 */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/15 via-blue-500/15 to-indigo-500/20 rounded-2xl blur-xl -z-10 scale-110" />
            </div>
          </motion.div>
        </div>
      </section>
      {/* 5. 用户评价瀑布流 */}
      <section className="relative py-20 max-w-screen-2xl px-[5vw] mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
          {t("reviewsTitle")}
        </h2>
        <div className="mb-16 flex justify-center">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
        </div>

        {/* 瀑布流容器 */}
        <div className="relative">
          {/* 三列瀑布流布局 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {" "}
            {/* 第一列 */}
            <div className="space-y-6">
              {" "}
              {[0, 3, 6, 9, 12].map((reviewIndex) => {
                const review = waterfallReviews[reviewIndex];
                if (!review) return null;
                return (
                  <motion.div
                    key={`col1-${reviewIndex}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: reviewIndex * 0.1 }}
                    className="group relative overflow-hidden"
                  >
                    <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-900/10 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 hover:border-purple-500/30 transition-all duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                            {review.avatar}
                          </div>
                          <div>
                            <h4 className="font-semibold group-hover:text-purple-200 transition-colors duration-300">
                              {review.user}
                            </h4>
                            <div className="flex gap-1 text-yellow-400">
                              {Array.from({ length: review.stars }).map(
                                (_, i) => (
                                  <IconStarFilled key={i} size={14} />
                                )
                              )}
                            </div>
                          </div>
                        </div>

                        <blockquote className="text-gray-500 dark:text-gray-300 leading-relaxed text-sm italic">
                          "{review.comment}"
                        </blockquote>
                      </div>

                      <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
            {/* 第二列 */}
            <div className="space-y-6">
              {" "}
              {[1, 4, 7, 10].map((reviewIndex) => {
                const review = waterfallReviews[reviewIndex];
                if (!review) return null;
                return (
                  <motion.div
                    key={`col2-${reviewIndex}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: reviewIndex * 0.1 }}
                    className="group relative overflow-hidden"
                  >
                    <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-900/10 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 hover:border-purple-500/30 transition-all duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                            {review.avatar}
                          </div>
                          <div>
                            <h4 className="font-semibold group-hover:text-purple-200 transition-colors duration-300">
                              {review.user}
                            </h4>
                            <div className="flex gap-1 text-yellow-400">
                              {Array.from({ length: review.stars }).map(
                                (_, i) => (
                                  <IconStarFilled key={i} size={14} />
                                )
                              )}
                            </div>
                          </div>
                        </div>

                        <blockquote className="text-gray-500 dark:text-gray-300 leading-relaxed text-sm italic">
                          "{review.comment}"
                        </blockquote>
                      </div>

                      <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
            {/* 第三列 */}
            <div className="space-y-6">
              {" "}
              {[2, 5, 8, 11].map((reviewIndex) => {
                const review = waterfallReviews[reviewIndex];
                if (!review) return null;
                return (
                  <motion.div
                    key={`col3-${reviewIndex}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: reviewIndex * 0.1 }}
                    className="group relative overflow-hidden"
                  >
                    <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-900/10 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 hover:border-purple-500/30 transition-all duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                            {review.avatar}
                          </div>
                          <div>
                            <h4 className="font-semibold group-hover:text-purple-200 transition-colors duration-300">
                              {review.user}
                            </h4>
                            <div className="flex gap-1 text-yellow-400">
                              {Array.from({ length: review.stars }).map(
                                (_, i) => (
                                  <IconStarFilled key={i} size={14} />
                                )
                              )}
                            </div>
                          </div>
                        </div>

                        <blockquote className="text-gray-500 dark:text-gray-300 leading-relaxed text-sm italic">
                          "{review.comment}"
                        </blockquote>
                      </div>

                      <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* 底部渐变遮罩 */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none" />
        </div>
      </section>
    </div>
  );
}
