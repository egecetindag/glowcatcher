"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function getDeal(id: string) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase
    .from("deals")
    .select("*, profiles(username, avatar_url)")
    .eq("id", id)
    .in("status", ["approved", "expired"])
    .single();

  if (error) throw new Error(error.message);
  return data;
}
