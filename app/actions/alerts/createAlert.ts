"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function createAlert(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const keyword = formData.get("keyword") as string;
  const category = (formData.get("category") as string) || null;
  const max_price = formData.get("max_price")
    ? Number(formData.get("max_price"))
    : null;

  const { error } = await supabase.from("alerts").insert({
    user_id: user.id,
    keyword,
    category,
    max_price,
  });

  if (error) throw new Error(error.message);
}

export async function deleteAlert(alertId: string) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("alerts")
    .delete()
    .eq("id", alertId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
}

export async function getUserAlerts() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("alerts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}
