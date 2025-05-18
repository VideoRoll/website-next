"use client";

import React, { useEffect, useState, ReactNode } from "react";
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

  useEffect(() => {
    console.log('-----texts', texts);
    if (texts.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, interval);
    return () => {
      console.log('-----clearInterval');
      return clearInterval(timer);
    }
  }, [texts, interval]);

  return (
    <div
      className={`relative flex flex-wrap items-center ${className || ""}`}
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
      <span className="relative h-10 flex items-center w-auto flex-wrap">
        <AnimatePresence mode="wait">
          <motion.span
            key={texts[index].text}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.5 }}
            className="w-full text-center whitespace-nowrap"
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