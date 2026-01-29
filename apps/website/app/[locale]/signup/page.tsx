import React from "react";
import { signup, loginWithGoogle, loginWithGithub, signupRedirect } from "./actions";
import Auth from "@/components/ui/client/Auth";
import SignLayout from "@/components/ui/server/SignLayout";
import { getTranslations } from 'next-intl/server';
import { getUserServerSideProps } from "@website-next/auth/auth-helpers/props";
import { getAuthConfig } from "@/lib/auth-init";
import { redirect } from "next/navigation";

export default async function SignupPage({ params }: { params: { locale: string } }) {
  const paramsData = await params;

  const consoleUrl = process.env.NODE_ENV === "development" ? `http://localhost:3134/console` : `/console`;

  // 检查用户是否已登录
  const config = getAuthConfig();
  const { currentUser } = await getUserServerSideProps(config);
  
  // 如果已登录，重定向到 console
  if (currentUser) {
    redirect(consoleUrl);
  }

  const t = await getTranslations({ locale: paramsData.locale, namespace: 'auth' });

  return (
    <SignLayout>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-8 text-left w-full max-w-xs">{t('signupTitle')}</h1>
        <Auth
          type="signup"
          onSubmit={signup}
          redirectCallback={signupRedirect}
          onGoogleSignin={loginWithGoogle}
          onGithubSignin={loginWithGithub}
        ></Auth>
      </div>
    </SignLayout>
  );
}
