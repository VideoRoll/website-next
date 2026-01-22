import React from "react";
// import { motion } from "framer-motion";
import Navbar from "@/components/ui/client/NavBar";
import { getUserServerSideProps } from "@website-next/auth/auth-helpers/props";
import { setRequestLocale } from 'next-intl/server';
import { Locale } from 'next-intl';
import DownloadVideo from "@/components/ui/client/DownloadVideo";
import { getAuthConfig } from "@/lib/auth-init";

type Props = {
  params: { locale: Locale };
};

export default async function Page({ params }: Props) {
  const paramsData = await params;
  // 设置当前请求的 locale
  setRequestLocale(paramsData.locale);

  const config = getAuthConfig();
  const { currentUser } = await getUserServerSideProps(config);

  return (
    <main style={{ height: "100%" }} className="bg-background">
      <Navbar currentUser={currentUser} ></Navbar>
      <DownloadVideo></DownloadVideo>
    </main>
  );
}
