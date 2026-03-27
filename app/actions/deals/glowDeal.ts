"use server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
export async function glowDeal(dealId: string) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("glows").insert({
    deal_id: dealId,
    user_id: user.id,
  });

  if (error) throw new Error(error.message);

  await supabase.rpc("increment_glow", { deal_id: dealId });
}
