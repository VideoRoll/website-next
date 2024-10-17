"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function signup(formData: FormData) {
    const supabase = createClient();

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        options: { captchaToken: formData.get('captchaToken') as string },
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
        // return JSON.stringify(error)
        return Promise.reject(error);
    }

    return Promise.resolve().then(() => {
        revalidatePath("/signin", "layout");
        redirect("/signin");
    });
}

export async function loginWithGoogle(origin: string) {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${origin}/auth/callback`,
        },
    });

    if (error) {
        return;
    }

    if (data.url) {
        redirect(data.url); // use the redirect API for your server framework
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
        return;
    }

    if (data.url) {
        redirect(data.url); // use the redirect API for your server framework
    }
}
