"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signOut() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  await supabase.auth.signOut();
  redirect("/auth/login");
}
