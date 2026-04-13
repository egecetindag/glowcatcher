"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

const FEED_PAGE_SIZE = 10;

export async function getDeals(
  category?: string,
  tab?: string,
  page = 0,
  store?: string,
) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const offset = page * FEED_PAGE_SIZE;

  let query = supabase
    .from("deals")
    .select("*, profiles(username, avatar_url)")
    .in("status", ["approved", "expired"]);

  if (category && category !== "All") {
    query = query.eq("category", category);
  }

  if (store) {
    query = query.ilike("store", store.replace(/-/g, " "));
  }

  if (tab === "most-glowing") {
    query = query.order("glow_count", { ascending: false });
  } else {
    query = query.order("updated_at", { ascending: false });
  }

  const { data, error } = await query.range(
    offset,
    offset + FEED_PAGE_SIZE - 1,
  );
  if (error) throw new Error(error.message);
  return data ?? [];
}
