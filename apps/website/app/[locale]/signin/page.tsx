import React from "react";
import { login, loginWithGoogle, loginWithGithub, signinRedirect } from "./actions";
// import { loginWithGoogle, loginWithGithub } from "@/utils/supabase/login";
import Auth from "@/components/ui/client/Auth";
import SignLayout from "@/components/ui/server/SignLayout";
import { getTranslations } from 'next-intl/server';

export default async function SigninPage({ params }: { params: { locale: string } }) {
  const paramsData = await params;
  
  const t = await getTranslations({ locale: paramsData.locale, namespace: 'auth' });
  
  return (
    <SignLayout>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-8 text-left w-full max-w-xs">{t('signinTitle')}</h1>
        <Auth
          type="signin"
          onSubmit={login}
          redirectCallback={signinRedirect}
          onGoogleSignin={loginWithGoogle}
          onGithubSignin={loginWithGithub}
        ></Auth>
      </div>
    </SignLayout>
  );
}
