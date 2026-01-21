import React from "react";
import { getUserServerSideProps } from "@website-next/auth/auth-helpers/props";
import { Overview } from "@/components/dashboard/Overview";
import { setRequestLocale } from 'next-intl/server';
import { Locale } from 'next-intl';
import { redirect } from "next/navigation";

type Props = {
  params: { locale: Locale };
};

export default async function Page({ params }: Props) {
  const paramsData = await params;
  // 设置当前请求的 locale
  setRequestLocale(paramsData.locale);

  return redirect(`/${paramsData.locale}/console/profile`);
}
