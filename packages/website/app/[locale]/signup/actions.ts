"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { loginWithGoogle as google, loginWithGithub as github } from '@/utils/supabase/login';

export async function signup(formData: FormData) {
    const supabase = await createClient();

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
    return google(origin);
}

export async function loginWithGithub(origin: string) {
    return github(origin);
}
