"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { loginWithGoogle as google, loginWithGithub as github } from '@/utils/supabase/login';

export async function login(formData: FormData) {
    const supabase = createClient();
    // const formData = JSON.parse(value);

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        options: { captchaToken: formData.get('captchaToken') as string },
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        // return JSON.stringify(error)
        return Promise.reject(error);
    }

    return Promise.resolve().then(() => {
        revalidatePath("/", "layout");
        redirect("/");
    });
}

export async function loginWithGoogle(origin: string) {
    return google(origin);
}

export async function loginWithGithub(origin: string) {
    return github(origin);
}
