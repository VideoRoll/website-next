"use client";

import React, { useEffect, useState, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimationTextProps {
  texts: { text: string; color?: string }[];
  interval?: number;
  className?: string;
  prefix?: ReactNode;
  prefixColor?: string;
  prefixClass?: string
}

const AnimationText: React.FC<AnimationTextProps> = ({
  texts,
  interval = 2000,
  className,
  prefix,
  prefixColor,
  prefixClass
}) => {
  const [index, setIndex] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const isActiveRef = useRef<boolean>(true);

  useEffect(() => {
    // 如果只有一个或没有文本，不需要轮播
    if (texts.length <= 1) return;

    isActiveRef.current = true;
    lastUpdateTimeRef.current = Date.now();

    // 使用 requestAnimationFrame 实现基于时间的动画循环
    const animate = () => {
      if (!isActiveRef.current) return;

      const currentTime = Date.now();
      const elapsed = currentTime - lastUpdateTimeRef.current;

      // 如果已经过了指定的时间间隔，切换文本
      if (elapsed >= interval) {
        setIndex((prev) => (prev + 1) % texts.length);
        lastUpdateTimeRef.current = currentTime;
      }

      // 继续下一帧
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // 开始动画循环
    animationFrameRef.current = requestAnimationFrame(animate);

    // 清理函数
    return () => {
      isActiveRef.current = false;
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [texts, interval]);

  return (
    <div
      className={`relative flex flex-wrap items-center justify-center ${className || ""}`}
    //   style={{ lineHeight: "2.5rem" }}
    >
      {prefix && (
        <span
          className={`mr-2 ${prefixClass}`}
          style={prefixColor ? { color: prefixColor } : {}}
        >
          {prefix}
        </span>
      )}
      <span className="relative h-10 flex items-center justify-center w-auto flex-wrap">
        <AnimatePresence mode="wait">
          <motion.span
            key={texts[index].text}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.5 }}
            className="text-center whitespace-nowrap"
            style={texts[index].color ? { color: texts[index].color } : {}}
          >
            {texts[index].text}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
};

export default AnimationText;