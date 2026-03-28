"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function getProfile(username: string) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error) return null;
  return data;
}
