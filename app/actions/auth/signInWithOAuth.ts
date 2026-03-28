"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signInWithOAuth(provider: "google" | "apple") {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const headersList = await headers();
  const origin = headersList.get("origin") ?? "http://localhost:3000";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) throw new Error(error.message);
  if (data.url) redirect(data.url);
}
