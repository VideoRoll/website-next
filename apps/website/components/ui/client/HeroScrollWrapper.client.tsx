"use client";

import React from "react";
import { useScroll, useTransform } from "framer-motion";
import HeroTitleSection from "@/components/ui/client/HeroTitleSection.client";
import CanvasStar from "./CanvasStar";

interface HeroScrollWrapperProps {
  title: string;
  subtitle: string;
  usersTrust: string;
  featured: string;
  chromeText: string;
  edgeText: string;
  firefoxText: string;
  quarkText: string;
  animationPrefix: string;
  texts: { text: string; color: string }[];
}

export default function HeroScrollWrapper({
  title,
  subtitle,
  usersTrust,
  featured,
  chromeText,
  edgeText,
  firefoxText,
  quarkText,
  animationPrefix,
  texts,
}: HeroScrollWrapperProps) {
  const { scrollY } = useScroll();
  const iconTranstion3 = useTransform(scrollY, [0, 100], [0, -40]);

  return (
    <>
      {/* <CanvasStar></CanvasStar> */}
      <HeroTitleSection
        scrollY={scrollY}
        iconTranstion3={iconTranstion3}
        title={title}
        subtitle={subtitle}
        usersTrust={usersTrust}
        featured={featured}
        chromeText={chromeText}
        edgeText={edgeText}
        firefoxText={firefoxText}
        quarkText={quarkText}
        animationPrefix={animationPrefix}
        texts={texts}
      />
    </>
  );
}
