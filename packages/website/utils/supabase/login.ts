import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function loginWithGoogle(origin: string) {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${origin}/auth/callback?next=/`,
        },
    });

    if (error) {
        return Promise.reject(error);
    }

    if (data.url) {
        return Promise.resolve().then(() => {
            redirect(data.url); // use the redirect API for your server framework
        })
    }
}

export async function loginWithGithub(origin: string) {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
            redirectTo: `${origin}/auth/callback`,
        },
    });

    if (error) {
        return Promise.reject(error);
    }

    if (data.url) {
        return Promise.resolve().then(() => {
            redirect(data.url); // use the redirect API for your server framework
        })
    }
}