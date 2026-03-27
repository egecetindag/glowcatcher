"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function getUser() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, avatar_url, role, profile_completed")
    .eq("id", user.id)
    .single();

  return { ...user, ...profile };
}
