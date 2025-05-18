import React from "react";
import { signup, loginWithGoogle, loginWithGithub } from "./actions";
import Auth from "@/components/ui/Auth";
// import { Title } from "@mantine/core";
// import { notifications } from "@mantine/notifications";

export default async function SignupPage() {
    return (
        <div>
            <div>Sign up to Video Roll</div>
            <Auth
                type="signup"
                onSubmit={signup}
                onGoogleSignin={loginWithGoogle}
                onGithubSignin={loginWithGithub}
                submitText="Sign up"
            ></Auth>
        </div>
    );
}
