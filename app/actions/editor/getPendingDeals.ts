"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function getPendingDeals() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase
    .from("deals")
    .select("*, profiles(username)")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}
