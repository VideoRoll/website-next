import React from "react";
// import { motion } from "framer-motion";
import Navbar from "@/components/ui/NavBar";
import { getUserServerSideProps } from "@/utils/auth-helpers/props";
import { setRequestLocale } from 'next-intl/server';
import { Locale } from 'next-intl';
import DownloadVideo from "@/components/ui/DownloadVideo";

type Props = {
  params: { locale: Locale };
};

export default async function Page({ params }: Props) {
  const paramsData = await params;
  // 设置当前请求的 locale
  setRequestLocale(paramsData.locale);

  const { currentUser } = await getUserServerSideProps();

  return (
    <main style={{ height: "100%" }} className="bg-background">
      <Navbar currentUser={currentUser} ></Navbar>
      <DownloadVideo></DownloadVideo>
    </main>
  );
}
