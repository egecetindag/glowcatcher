"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm_password") as string;

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);

  redirect("/auth/verify");
}
