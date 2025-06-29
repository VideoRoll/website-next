import React from "react";
import Navbar from "@/components/ui/NavBar";
import { getUserServerSideProps } from "@/utils/auth-helpers/props";
import { setRequestLocale } from 'next-intl/server';
import { Locale } from 'next-intl';
import Footer from "@/components/ui/Footer";
import Pricing from "@/components/ui/Pricing";

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
      <Pricing></Pricing>
      <Footer></Footer>
      {/* <FeatureVideo></FeatureVideo> */}
    </main>
  );
}
