"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function toggleReaction(
  commentId: string,
  emoji: string,
  dealId: string,
) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: existing } = await supabase
    .from("comment_reactions")
    .select("id")
    .eq("comment_id", commentId)
    .eq("user_id", user.id)
    .eq("emoji", emoji)
    .single();

  if (existing) {
    await supabase.from("comment_reactions").delete().eq("id", existing.id);
  } else {
    await supabase.from("comment_reactions").insert({
      comment_id: commentId,
      user_id: user.id,
      emoji,
    });
  }

  revalidatePath(`/deals/${dealId}`);
}
