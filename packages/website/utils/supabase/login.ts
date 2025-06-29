import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function loginWithGoogle(origin: string) {
    const supabase = await createClient();

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

export async function loginWithGithub(origin: string) {
    const supabase = await createClient();

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

export async function signout() {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
        return Promise.reject(error.message || "Sign out failed.");
    }
    
    // Redirect to home page after successful sign out
    redirect("/");
}