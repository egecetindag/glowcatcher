import { createClient } from "@/lib/supabase/client";

export async function getUserVote(dealId: string): Promise<"up" | "down" | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("glows")
    .select("type")
    .eq("deal_id", dealId)
    .eq("user_id", user.id)
    .maybeSingle();

  return (data?.type as "up" | "down") ?? null;
}
