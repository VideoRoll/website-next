import { redirect } from "next/navigation";
import { createClient } from "./server";
import type { AuthConfig } from "../config";

export async function loginWithGoogle(origin: string, config: AuthConfig) {
    const supabase = await createClient(config);

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${origin}/auth/callback?next=/`,
        },
    });

    if (error) {
        return Promise.reject(error.message || "Google OAuth authentication failed.");
    }

    if (data.url) {
        // 直接重定向，不要包装在 Promise 中
        redirect(data.url);
    }
}

export async function loginWithGithub(origin: string, config: AuthConfig) {
    const supabase = await createClient(config);

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
            redirectTo: `${origin}/auth/callback`,
        },
    });

    if (error) {
        return Promise.reject(error.message || "GitHub OAuth authentication failed.");
    }

    if (data.url) {
        // 直接重定向，不要包装在 Promise 中
        redirect(data.url);
    }
}

export async function signout(config: AuthConfig) {
    const supabase = await createClient(config);
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
        return Promise.reject(error.message || "Sign out failed.");
    }
    
    // Redirect to home page after successful sign out
    redirect("/");
}