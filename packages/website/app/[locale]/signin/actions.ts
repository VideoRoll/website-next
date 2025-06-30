/*
 * @Author: gomi gxy880520@qq.com
 * @Date: 2024-10-16 10:34:26
 * @LastEditors: gomi gxy880520@qq.com
 * @LastEditTime: 2025-06-30 09:37:08
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

export async function login(formData: FormData) {
  const supabase = createClient();
  // const formData = JSON.parse(value);

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: { captchaToken: formData.get("captchaToken") as string },
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // return JSON.stringify(error)
    return Promise.reject(error.message || "An error occurred during signin");
  }

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard");
}

export async function loginWithGoogle(origin: string) {
  return google(origin);
}

export async function loginWithGithub(origin: string) {
  return github(origin);
}
