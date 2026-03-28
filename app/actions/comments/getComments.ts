"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function getComments(dealId: string) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase
    .from("comments")
    .select(
      "*, profiles(username, avatar_url), comment_reactions(emoji, user_id)",
    )
    .eq("deal_id", dealId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  // Tüm comment'leri çektik, şimdi ağaç yapısına dönüştür
  const all = data ?? [];
  const parents = all.filter((c) => !c.parent_id);
  const replies = all.filter((c) => c.parent_id);

  // Her parent'a kendi reply'larını ekle
  return parents.map((parent) => ({
    ...parent,
    replies: replies.filter((r) => r.parent_id === parent.id),
  }));
}
