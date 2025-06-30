"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { loginWithGoogle as google, loginWithGithub as github } from '@/utils/supabase/login';

export async function signup(formData: FormData, locale: string = 'en') {
    const supabase = await createClient();

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
    return google(origin);
}

export async function loginWithGithub(origin: string) {
    return github(origin);
}
