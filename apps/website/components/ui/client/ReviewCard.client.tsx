"use client";

import React from "react";
import { motion } from "framer-motion";
import { IconStarFilled } from "@tabler/icons-react";

interface ReviewCardProps {
  user: string;
  comment: string;
  stars: number;
  avatar: string;
  delay: number;
}

export default function ReviewCard({
  user,
  comment,
  stars,
  avatar,
  delay,
}: ReviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="group relative overflow-hidden"
    >
      <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-900/10 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 hover:border-purple-500/30 transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
              {avatar}
            </div>
            <div>
              <h4 className="font-semibold group-hover:text-purple-200 transition-colors duration-300">
                {user}
              </h4>
              <div className="flex gap-1 text-yellow-400">
                {Array.from({ length: stars }).map((_, i) => (
                  <IconStarFilled key={i} size={14} />
                ))}
              </div>
            </div>
          </div>

          <blockquote className="text-gray-500 dark:text-gray-300 leading-relaxed text-sm italic">
            "{comment}"
          </blockquote>
        </div>

        <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
}

