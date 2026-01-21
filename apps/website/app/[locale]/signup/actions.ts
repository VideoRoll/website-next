"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@website-next/auth/supabase/server";
import { loginWithGoogle as google, loginWithGithub as github } from '@website-next/auth/supabase/login';
import { getAuthConfig } from "@/lib/auth-init";

export async function signup(formData: FormData, locale: string = 'en') {
    const config = getAuthConfig();
    const supabase = await createClient(config);

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        options: { 
            captchaToken: formData.get('captchaToken') as string
        },
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
        // Return error object instead of Promise.reject
        return { error: error.message || "An error occurred during signup." };
    }

    return;
}

export async function signupRedirect(locale: string = 'en') {
    revalidatePath(`/${locale}/confirm-email`, "layout");
    redirect(`/${locale}/confirm-email`);
}

export async function loginWithGoogle(origin: string) {
    const config = getAuthConfig();
    return google(origin, config);
}

export async function loginWithGithub(origin: string) {
    const config = getAuthConfig();
    return github(origin, config);
}
