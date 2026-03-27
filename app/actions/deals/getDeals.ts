"use server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function getDeals(category?: string) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  let query = supabase
    .from("deals")
    .select("*")
    .eq("status", "approved")
    .order("glow_count", { ascending: false });

  if (category && category !== "All") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data;
}
