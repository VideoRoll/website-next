import React from "react";
import { login, loginWithGoogle, loginWithGithub } from "./actions";
// import { loginWithGoogle, loginWithGithub } from "@/utils/supabase/login";
import Auth from "@/components/ui/Auth";
// import { Title } from "@mantine/core";
// import { notifications } from "@mantine/notifications";

export default async function SigninPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div>Sign in to Video Roll</div>
            <Auth
                type="signin"
                onSubmit={login}
                onGoogleSignin={loginWithGoogle}
                onGithubSignin={loginWithGithub}
                submitText="Sign in"
            ></Auth>
        </div>
    );
}
