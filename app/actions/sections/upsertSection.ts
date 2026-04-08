"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

async function resolveImageUrl(supabase: Awaited<ReturnType<typeof createClient>>, formData: FormData) {
  const imageFile = formData.get("image_file") as File | null;
  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split(".").pop();
    const path = `sections/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("deal-images").upload(path, imageFile, { upsert: true });
    if (!error) {
      return supabase.storage.from("deal-images").getPublicUrl(path).data.publicUrl;
    }
  }
  return (formData.get("image_url") as string) || null;
}

export async function createSection(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const image_url = await resolveImageUrl(supabase, formData);

  const { error } = await supabase.from("sections").insert({
    title: formData.get("title") as string,
    subtitle: (formData.get("subtitle") as string) || null,
    image_url,
    link: (formData.get("link") as string) || null,
    order_index: Number(formData.get("order_index") ?? 0),
  });

  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/editor/sections");
}

export async function updateSection(id: string, formData: FormData) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const image_url = await resolveImageUrl(supabase, formData);

  const { error } = await supabase
    .from("sections")
    .update({
      title: formData.get("title") as string,
      subtitle: (formData.get("subtitle") as string) || null,
      image_url,
      link: (formData.get("link") as string) || null,
      order_index: Number(formData.get("order_index") ?? 0),
      is_active: formData.get("is_active") === "true",
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/editor/sections");
}

export async function deleteSection(id: string) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { error } = await supabase.from("sections").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/editor/sections");
}
