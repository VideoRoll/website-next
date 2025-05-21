import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";
import logo from "./icons/logo.png";
import { i18n } from "@/lib/i18n";

export function baseOptions(locale: string): BaseLayoutProps {
  return {
    i18n,
    nav: {
      title: (
        <div className="flex flex-row items-center">
          <Image
            src={logo}
            alt="video roll logo"
            width={20}
            height={20}
            className="mr-2"
          ></Image>
          Video Roll
        </div>
      ),
      url: "https://videoroll.app",
    },
    // sidebar: {
    //   tabs: false
    // },
    githubUrl: "https://github.com",
    links: [
      // {
      //   type: 'main',
      //   text: locale === 'cn' ? '文档' : 'Documentation',
      //   url: `/${locale}/docs`,
      // },
    ],
  };
}
