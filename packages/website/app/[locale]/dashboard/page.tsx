import React from "react";
// import { motion } from "framer-motion";
import Navbar from "@/components/ui/client/NavBar";
import { getUserServerSideProps } from "@/utils/auth-helpers/props";
import Dashboard from "./Dashboard";
import { setRequestLocale } from 'next-intl/server';
import { Locale } from 'next-intl';
import {redirect} from 'next/navigation';

type Props = {
  params: { locale: Locale };
};

export default async function Page({ params }: Props) {
  const paramsData = await params;
  // 设置当前请求的 locale
  setRequestLocale(paramsData.locale);

  const { currentUser } = await getUserServerSideProps();

  if (!currentUser) {
    redirect('/en/signin');
  }

  return (
    <main style={{ height: "100%" }} className="bg-background">
      <Navbar currentUser={currentUser} ></Navbar>
      <Dashboard currentUser={currentUser}></Dashboard>
    </main>
  );
}
