"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "../../utils/supabase/server";

export async function login(value: string) {
    const supabase = createClient();
    const formData = JSON.parse(value);

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.email as string,
        password: formData.password as string,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        redirect("/error");
    }

    revalidatePath("/", "layout");
    redirect("/");
}

export async function signup(formData: FormData) {
    const supabase = createClient();

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
        redirect("/error");
    }

    revalidatePath("/", "layout");
    redirect("/");
}

export async function loginWithGoogle() {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: "http://localhost:3000/auth/callback",
        },
    });

    if (data.url) {
        redirect(data.url); // use the redirect API for your server framework
    }
}
