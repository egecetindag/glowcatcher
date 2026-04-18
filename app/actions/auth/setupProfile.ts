"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function setupProfile(_: unknown, formData: FormData) {
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
  const bio = (formData.get("bio") as string) || null;
  const avatarFile = formData.get("avatar") as File;

  let avatar_url = null;

  if (avatarFile && avatarFile.size > 0) {
    if (avatarFile.size > 2 * 1024 * 1024) {
      return { error: "Photo must be smaller than 2MB." };
    }

    const fileExt = avatarFile.name.split(".").pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatarFile, { upsert: true });

    if (uploadError) return { error: "Failed to upload photo. Please try again." };

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    avatar_url = data.publicUrl;
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

  if (error) {
    if (error.code === "23505") return { error: "This username is already taken." };
    return { error: error.message };
  }
  redirect("/");
}
