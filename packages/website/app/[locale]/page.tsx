import React from "react";
import Navbar from "@/components/ui/client/NavBar";
import { getUserServerSideProps } from "@/utils/auth-helpers/props";
import Hero from "@/components/ui/server/Hero.tsx";
import { setRequestLocale } from 'next-intl/server';
import { Locale } from 'next-intl';
import Footer from "@/components/ui/client/Footer";

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
      <Hero></Hero>
      <Footer></Footer>
      {/* <FeatureVideo></FeatureVideo> */}
    </main>
  );
}
