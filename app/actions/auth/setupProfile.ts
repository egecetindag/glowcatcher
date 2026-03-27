"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function setupProfile(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const skip = formData.get("skip") === "true";

  if (skip) {
    await supabase
      .from("profiles")
      .update({ profile_completed: true })
      .eq("id", user.id);

    redirect("/");
  }

  const username = formData.get("username") as string;
  const bio = formData.get("bio") as string;
  const avatarFile = formData.get("avatar") as File;

  let avatar_url = null;

  if (avatarFile && avatarFile.size > 0) {
    const fileExt = avatarFile.name.split(".").pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatarFile, { upsert: true });

    if (!uploadError) {
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      avatar_url = data.publicUrl;
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      username,
      bio,
      avatar_url,
      profile_completed: true,
    })
    .eq("id", user.id);

  if (error) throw new Error(error.message);
  redirect("/");
}
