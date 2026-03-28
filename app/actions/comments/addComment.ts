"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function addComment(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const deal_id = formData.get("deal_id") as string;
  const content = formData.get("content") as string;
  const parent_id = formData.get("parent_id") as string | null;

  const { error } = await supabase.from("comments").insert({
    deal_id,
    user_id: user.id,
    content,
    parent_id: parent_id || null,
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/deals/${deal_id}`);
}
