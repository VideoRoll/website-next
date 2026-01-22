"use client";

import React from "react";
import { motion } from "framer-motion";
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

interface FeatureCardProps {
  title: string;
  desc: string;
  delay: number;
  colSpan: number;
  showPlatforms?: boolean;
}

export default function FeatureCard({
  title,
  desc,
  delay,
  colSpan,
  showPlatforms = false,
}: FeatureCardProps) {
  const colSpanClass =
    colSpan === 1
      ? "md:col-span-1"
      : colSpan === 2
      ? "md:col-span-2"
      : "md:col-span-3";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`group relative overflow-hidden ${colSpanClass}`}
    >
      <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-900/10 backdrop-blur-sm rounded-2xl p-8 min-h-[200px] border border-gray-700/30 hover:border-purple-500/30 transition-all duration-500 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-4 group-hover:text-purple-200 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-500 dark:text-gray-300 leading-relaxed">
            {desc}
          </p>
        </div>
        {showPlatforms && (
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
                  className="shrink-0 w-12 h-12 flex items-center justify-center text-gray-400 group-hover:text-purple-300 transition-colors duration-300"
                >
                  {platform.icon}
                </div>
              ))}
          </div>
        )}
        <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
}

