"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface ImageCardProps {
  src: any;
  alt: string;
  delay: number;
  rotation: number;
  transformOrigin: string;
  className?: string;
  isCenter?: boolean;
}

export default function ImageCard({
  src,
  alt,
  delay,
  rotation,
  transformOrigin,
  className = "w-48 md:w-64",
  isCenter = false,
}: ImageCardProps) {
  const filterStyle = isCenter
    ? "drop-shadow(0 0 40px rgba(147, 51, 234, 0.3)) drop-shadow(0 0 80px rgba(59, 130, 246, 0.2))"
    : "drop-shadow(0 0 30px rgba(147, 51, 234, 0.25)) drop-shadow(0 0 60px rgba(59, 130, 246, 0.15))";

  const glowBgClass = isCenter
    ? "absolute inset-0 bg-gradient-to-br from-purple-400/20 via-blue-500/20 to-indigo-500/25 rounded-2xl blur-xl -z-10 scale-110"
    : "absolute inset-0 bg-gradient-to-br from-purple-400/15 via-blue-500/15 to-indigo-500/20 rounded-2xl blur-xl -z-10 scale-110";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={isCenter ? "relative z-10 -mx-8" : "relative"}
      style={{ transformOrigin }}
    >
      <div
        className="relative transform"
        style={{
          transform: rotation !== 0 ? `rotate(${rotation}deg)` : undefined,
          filter: filterStyle,
        }}
      >
        <Image
          src={src}
          alt={alt}
          className={`${className} h-auto object-contain rounded-2xl`}
        />
        {/* 发光效果背景 */}
        <div className={glowBgClass} />
      </div>
    </motion.div>
  );
}

