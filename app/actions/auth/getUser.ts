"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export type CurrentUser = {
  id: string;
  email?: string;
  username?: string;
  avatar_url?: string;
  role?: string;
  profile_completed?: boolean;
};

export async function getUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, avatar_url, role, profile_completed")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email,
    ...profile,
  };
}
