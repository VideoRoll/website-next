import React from "react";
// import { motion } from "framer-motion";
import Navbar from "@/components/ui/NavBar";
import { getUserServerSideProps } from "@/utils/auth-helpers/props";
import Hero from "@/components/ui/Hero.tsx";
import { setRequestLocale } from 'next-intl/server';
import { Locale } from 'next-intl';

type Props = {
  params: { locale: Locale };
};

export default async function Page({ params }: Props) {
  // 设置当前请求的 locale
  setRequestLocale(params.locale);

  const { currentUser, error } = await getUserServerSideProps();

  return (
    <main style={{ height: "100%" }} className="bg-background">
      <Navbar currentUser={currentUser} error={error}></Navbar>
      <Hero></Hero>
      {/* <FeatureVideo></FeatureVideo> */}
    </main>
  );
}
