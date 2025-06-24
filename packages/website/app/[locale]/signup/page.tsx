import React from "react";
import { signup, loginWithGoogle, loginWithGithub } from "./actions";
import Auth from "@/components/ui/Auth";
import SignLayout from "@/components/ui/SignLayout";
// import { Title } from "@mantine/core";
// import { notifications } from "@mantine/notifications";

export default async function SignupPage() {
  return (
    <SignLayout>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-8">Sign up to Video Roll</h1>
        <Auth
          type="signup"
          onSubmit={signup}
          onGoogleSignin={loginWithGoogle}
          onGithubSignin={loginWithGithub}
          submitText="Sign up"
        ></Auth>
      </div>
    </SignLayout>
  );
}
