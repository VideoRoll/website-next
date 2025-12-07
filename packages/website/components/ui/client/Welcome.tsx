"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import logo from "@/components/icons/logo.png";

// 撒花粒子组件
const Confetti = ({ delay = 0 }: { delay?: number }) => {
  const colors = [
    "#FFD700",
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FECA57",
    "#FF9FF3",
    "#54A0FF",
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{ backgroundColor: randomColor }}
      initial={{
        x: Math.random() * window.innerWidth,
        y: -20,
        rotate: 0,
        scale: 1,
      }}
      animate={{
        y: window.innerHeight + 100,
        rotate: 360,
        scale: [1, 1.5, 0.5, 0],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        delay: delay,
        ease: "easeOut",
      }}
    />
  );
};

// 星形撒花组件
const Star = ({ delay = 0 }: { delay?: number }) => {
  return (
    <motion.div
      className="absolute text-yellow-400 text-lg"
      initial={{
        x: Math.random() * window.innerWidth,
        y: -20,
        rotate: 0,
        scale: 1,
        opacity: 1,
      }}
      animate={{
        y: window.innerHeight + 100,
        rotate: [0, 180, 360],
        scale: [1, 1.2, 0.8, 0],
        opacity: [1, 0.8, 0.3, 0],
      }}
      transition={{
        duration: 4 + Math.random() * 1,
        delay: delay,
        ease: "easeOut",
      }}
    >
      ⭐
    </motion.div>
  );
};

export default function Welcome() {
  const [showConfetti, setShowConfetti] = useState(false);
  const t = useTranslations("welcome");
  const [version, setVersion] = useState<string | undefined>(undefined);

  useEffect(() => {
    // 页面加载后开始撒花动画
    const timer = setTimeout(() => {
      setShowConfetti(true);
    }, 500);

    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const versionParam = urlParams.get("version");
      setVersion(versionParam || undefined);
    }

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (version) {
      try {
        const installData = {
          version
        };

        // Default API call
        fetch("/api/install", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(installData),
        }).then((response) => {
          if (!response.ok) {
            throw new Error("Failed to install info");
          }
        }).catch((error) => {
          console.error("Error submitting install info:", error);
        })
        // Reset form after successful submission
      } catch (error) {
        console.error("Error submitting install info:", error);
      } finally {
      }
    }
  }, [version]);

  const handleGoToWebsite = () => {
    window.open("https://videoroll.app", "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(120,119,198,0.3),_transparent_50%)]" />

      {/* 撒花动画 */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {/* 彩色圆点撒花 */}
          {Array.from({ length: 30 }).map((_, i) => (
            <Confetti key={`confetti-${i}`} delay={i * 0.1} />
          ))}
          {/* 星星撒花 */}
          {Array.from({ length: 15 }).map((_, i) => (
            <Star key={`star-${i}`} delay={i * 0.15} />
          ))}
        </div>
      )}

      {/* 主要内容 */}
      <motion.div
        className="text-center z-20 px-6 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        {/* Logo 或图标区域 */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.5,
          }}
        >
          <div className="w-24 h-24 mx-auto rounded-4 flex items-center justify-center shadow-2xl p-2">
            <Image
              src={logo}
              alt="Video Roll Logo"
              width={80}
              height={80}
              className="rounded-2"
              priority
            />
          </div>
        </motion.div>

        {/* 欢迎文字 */}
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
            {t("congratulations")}
          </span>
          <br />
          <span className="text-white">{t("appName")}</span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-gray-300 mb-12 font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          {t("subtitle")}
        </motion.p>

        {/* 跳转按钮 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <motion.button
            onClick={handleGoToWebsite}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t("exploreButton")}
          </motion.button>
        </motion.div>

        {/* 底部装饰 */}
        <motion.div
          className="mt-16 flex justify-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
        >
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-purple-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* 底部渐变装饰 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );
}
