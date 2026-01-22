"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@website-next/auth/supabase/server";
import {
  loginWithGoogle as google,
  loginWithGithub as github,
} from "@website-next/auth/supabase/login";
import { getAuthConfig } from "@/lib/auth-init";

export async function login(formData: FormData, locale: string = 'en', callback?: () => void | Promise<void>) {
  const config = getAuthConfig();
  const supabase = await createClient(config);

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: { captchaToken: formData.get("captchaToken") as string },
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // Return error object instead of Promise.reject
    return { error: 'Invalid email or password' };
  }

  return;
}

export async function signinRedirect(locale: string = 'en') {
  revalidatePath(`/console/${locale}`, "layout");
  redirect(`/console/${locale}`);
  // 开发环境的重定向在客户端组件中处理
}

export async function loginWithGoogle(origin: string) {
  const config = getAuthConfig();
  return google(origin, config);
}

export async function loginWithGithub(origin: string) {
  const config = getAuthConfig();
  return github(origin, config);
}
