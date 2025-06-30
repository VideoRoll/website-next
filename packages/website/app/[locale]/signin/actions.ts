/*
 * @Author: gomi gxy880520@qq.com
 * @Date: 2024-10-16 10:34:26
 * @LastEditors: gomi gxy880520@qq.com
 * @LastEditTime: 2025-06-30 10:11:03
 * @FilePath: \website-next\packages\website\app\[locale]\signin\actions.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import {
  loginWithGoogle as google,
  loginWithGithub as github,
} from "@/utils/supabase/login";

export async function login(formData: FormData, locale: string = 'en', callback?: Function) {
  const supabase = await createClient();

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
    return { error: error.message || "An error occurred during signin" };
  }

  return;
}

export async function signinRedirect(locale: string = 'en') {
  revalidatePath(`/${locale}/dashboard`, "layout");
  redirect(`/${locale}/dashboard`);
}

export async function loginWithGoogle(origin: string) {
  return google(origin);
}

export async function loginWithGithub(origin: string) {
  return github(origin);
}
