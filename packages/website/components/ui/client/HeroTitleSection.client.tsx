"use client";

import React from "react";
import { motion, useTransform } from "framer-motion";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import Chrome from "@/components/icons/Chrome";
import Edge from "@/components/icons/Edge";
import Firefox from "@/components/icons/Firefox";
import Quark from "@/components/icons/Quark";
import AnimationText from "@/components/ui/client/AnimationText";
import { IconChevronDown, IconAward } from "@tabler/icons-react";
import { useLocale } from "next-intl";

interface HeroTitleSectionProps {
  scrollY: any;
  iconTranstion3: any;
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

export default function HeroTitleSection({
  scrollY,
  iconTranstion3,
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
}: HeroTitleSectionProps) {
  const locale = useLocale();
  const isChinese = locale === "zh";

  return (
    <div className="ms:w-full flex-1 flex flex-col items-center text-center z-10 pb-4">
      <div
        // style={{ y: iconTranstion3 }}
        // initial={{ opacity: 0, x: -60 }}
        // whileInView={{ opacity: 1, x: 0 }}
        // transition={{ duration: 0.7 }}
        className={`flex flex-col items-center font-extrabold text-3xl md:text-5xl lg:text-6xl mb-6 ${
          isChinese ? "tracking-widest" : ""
        }`}
      >
        <p className={`mb-4 ${isChinese ? "tracking-widest" : ""}`}>{title}</p>
        <AnimationText
          className={`text-2xl w-full md:text-4xl ${
            isChinese ? "tracking-widest" : ""
          }`}
          prefix={animationPrefix}
          prefixColor="#fff"
          texts={texts}
        />
      </div>
      <div
        // style={{ y: iconTranstion3 }}
        // initial={{ opacity: 0, x: -40 }}
        // whileInView={{ opacity: 1, x: 0 }}
        // transition={{ duration: 0.7, delay: 0.2 }}
        className={`text-base md:text-xl text-gray-400 dark:text-gray-300 max-w-xl mb-6 mx-auto ${
          isChinese ? "tracking-wide" : ""
        }`}
      >
        {subtitle}
      </div>

      {/* 精选标识和用户数量 */}
      <div
        // style={{ y: iconTranstion3 }}
        // initial={{ opacity: 0, x: -40 }}
        // whileInView={{ opacity: 1, x: 0 }}
        // transition={{ duration: 0.7, delay: 0.3 }}
        className="flex flex-col items-center justify-center gap-3 mb-8"
      >
        {/* 用户数量 */}
        <div className="flex items-center gap-2">
          <span className="text-base md:text-lg font-medium tracking-widest text-gray-400 dark:text-gray-300">
            {usersTrust.split(/(\d+[,\d]*\+?)/).map((part, index) => {
              // 检查是否是数字部分（包含数字、逗号和加号）
              const isNumber = /^\d+[,\d]*\+?$/.test(part);
              return (
                <span
                  key={index}
                  className={isNumber ? "text-secondary-700" : ""}
                >
                  {part}
                </span>
              );
            })}
          </span>
        </div>
        {/* 精选标识 - 带边框的圆角矩形 */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-white/30 dark:border-gray-600/30">
          {/* 徽标图标 */}
          <IconAward
            size={20}
            className="text-blue-500 dark:text-blue-400 flex-shrink-0"
          />
          {/* 渐变色文案 */}
          <span className="text-sm font-medium bg-gradient-to-r from-[#40ffaa] via-[#4079ff] to-[#40ffaa] bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient whitespace-nowrap">
            {featured}
          </span>
        </div>
      </div>

      <div // style={{ y: iconTranstion3 }}
        className="flex flex-wrap justify-center gap-4 items-center"
      >
        <Button
          color="primary"
          radius="md"
          variant="shadow"
          size="lg"
          className="min-w-[200px]"
          startContent={<Chrome size={22} />}
          onPress={() =>
            window.open(
              "https://chromewebstore.google.com/detail/cokngoholafkeghnhhdlmiadlojpindm",
              "_blank"
            )
          }
        >
          {chromeText}
        </Button>
        <Dropdown placement="bottom" trigger="press">
          <DropdownTrigger>
            <Button
              color="primary"
              radius="md"
              variant="bordered"
              size="lg"
              endContent={<IconChevronDown size={18} />}
            >
              {isChinese ? "其他平台" : "Other Platforms"}
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Other platforms">
            <DropdownItem
              key="edge"
              startContent={<Edge size={20} />}
              onPress={() =>
                window.open(
                  "https://microsoftedge.microsoft.com/addons/detail/video-roll/indeeigndpaahbcegcanpmbenmkbkmmn",
                  "_blank"
                )
              }
            >
              {edgeText}
            </DropdownItem>
            <DropdownItem
              key="firefox"
              startContent={
                <Firefox size={20} style={{ transform: "scale(0.8)" }} />
              }
              onPress={() =>
                window.open(
                  "https://addons.mozilla.org/en-US/firefox/addon/videoroll/",
                  "_blank"
                )
              }
            >
              {firefoxText}
            </DropdownItem>

            <DropdownItem
              key="quark"
              startContent={<Quark size={20} />}
              onPress={() =>
                window.open(
                  "https://extensions.quark.cn/?utm_source=ext_extensions_menu&entry=ext_panel&category_id=5#/details/cokngoholafkeghnhhdlmiadlojpindm",
                  "_blank"
                )
              }
            >
              {quarkText}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}
