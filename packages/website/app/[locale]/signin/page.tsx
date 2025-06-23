/*
 * @Author: gomi gxy880520@qq.com
 * @Date: 2024-10-10 18:00:26
 * @LastEditors: gomi gxy880520@qq.com
 * @LastEditTime: 2025-06-23 22:57:29
 * @FilePath: \website-next\packages\website\app\[locale]\signin\page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from "react";
import { login, loginWithGoogle, loginWithGithub } from "./actions";
// import { loginWithGoogle, loginWithGithub } from "@/utils/supabase/login";
import Auth from "@/components/ui/Auth";
import SignLayout from "@/components/ui/SignLayout";
// import { Title } from "@mantine/core";
// import { notifications } from "@mantine/notifications";

export default async function SigninPage() {
  return (
    <SignLayout>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-8">Sign in to Video Roll</h1>
        <Auth
          type="signin"
          onSubmit={login}
          onGoogleSignin={loginWithGoogle}
          onGithubSignin={loginWithGithub}
          submitText="Sign in"
        ></Auth>
      </div>
    </SignLayout>
  );
}
