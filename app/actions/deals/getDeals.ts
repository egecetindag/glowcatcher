"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

const FEED_PAGE_SIZE = 10;

export async function getDeals(category?: string, tab?: string, page = 0) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const offset = page * FEED_PAGE_SIZE;

  let query = supabase
    .from("deals")
    .select("*, profiles(username, avatar_url)")
    .eq("status", "approved");

  if (category && category !== "All") {
    query = query.eq("category", category);
  }

  if (tab === "most-glowing") {
    query = query.order("glow_count", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query.range(
    offset,
    offset + FEED_PAGE_SIZE - 1,
  );
  if (error) throw new Error(error.message);
  return data ?? [];
}
