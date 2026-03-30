"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function getUserVotes(
  dealIds: string[],
): Promise<Record<string, "up" | "down">> {
  if (!dealIds.length) return {};

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return {};

  const { data } = await supabase
    .from("glows")
    .select("deal_id, type")
    .eq("user_id", user.id)
    .in("deal_id", dealIds);

  if (!data) return {};
  return Object.fromEntries(data.map((r) => [r.deal_id, r.type as "up" | "down"]));
}
