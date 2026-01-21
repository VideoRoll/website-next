import React from "react";
// import { motion } from "framer-motion";
import Navbar from "@/components/ui/client/NavBar";
import { getUserServerSideProps } from "@website-next/auth/auth-helpers/props";
import Dashboard from "./Dashboard";
import { setRequestLocale } from 'next-intl/server';
import { Locale } from 'next-intl';
import {redirect} from 'next/navigation';
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

  if (!currentUser) {
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (isDevelopment) {
      redirect(`http://localhost:3134/${paramsData.locale}/signin`);
    } else {
      redirect(`/${paramsData.locale}/signin`);
    }
  }

  return (
    <main style={{ height: "100%" }} className="bg-background">
      <Navbar currentUser={currentUser} ></Navbar>
      <Dashboard currentUser={currentUser}></Dashboard>
    </main>
  );
}
