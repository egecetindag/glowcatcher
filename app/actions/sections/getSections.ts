"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function getSections() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getAllSections() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}
