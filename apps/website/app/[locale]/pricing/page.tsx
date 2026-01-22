import React from "react";
import Navbar from "@/components/ui/client/NavBar";
import { getUserServerSideProps } from "@website-next/auth/auth-helpers/props";
import { setRequestLocale } from 'next-intl/server';
import { Locale } from 'next-intl';
import Footer from "@/components/ui/client/Footer";
import Pricing from "@/components/ui/client/Pricing";
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
      <Pricing></Pricing>
      <Footer></Footer>
      {/* <FeatureVideo></FeatureVideo> */}
    </main>
  );
}
