"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

import { SEARCH_PAGE_SIZE } from "./searchConfig";

type SearchOptions = {
  sort?: string;
  category?: string;
  date?: string;
  page?: number;
};

export async function searchDeals(query: string, options: SearchOptions = {}) {
  const { sort = "votes", category, date, page = 1 } = options;
  const offset = (page - 1) * SEARCH_PAGE_SIZE;

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  let q = supabase
    .from("deals")
    .select("*, profiles(username, avatar_url)", { count: "exact" })
    .eq("status", "approved")
    .or(
      `title.ilike.%${query}%,description.ilike.%${query}%,store.ilike.%${query}%`,
    );

  if (category) q = q.eq("category", category);

  if (date === "7d") {
    q = q.gte(
      "created_at",
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    );
  } else if (date === "30d") {
    q = q.gte(
      "created_at",
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    );
  }

  if (sort === "recent") q = q.order("created_at", { ascending: false });
  else if (sort === "price_high") q = q.order("price", { ascending: false });
  else if (sort === "price_low") q = q.order("price", { ascending: true });
  else q = q.order("glow_count", { ascending: false });

  q = q.range(offset, offset + SEARCH_PAGE_SIZE - 1);

  const { data, count, error } = await q;
  if (error) throw new Error(error.message);
  return { deals: data ?? [], total: count ?? 0 };
}
