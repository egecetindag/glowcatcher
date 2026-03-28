"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function submitDeal(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const original_price = formData.get("original_price");

  let image_url = (formData.get("image_url") as string) || null;
  const imageFile = formData.get("image_file") as File | null;
  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split(".").pop();
    const path = `deals/${user.id}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("deal-images")
      .upload(path, imageFile, { upsert: true });
    if (!uploadError) {
      const { data: urlData } = supabase.storage
        .from("deal-images")
        .getPublicUrl(path);
      image_url = urlData.publicUrl;
    }
  }

  const { error } = await supabase.from("deals").insert({
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    price: Number(formData.get("price")),
    original_price: original_price ? Number(original_price) : null,
    store: formData.get("store") as string,
    category: formData.get("category") as string,
    url: formData.get("url") as string,
    image_url,
    voucher_code: (formData.get("voucher_code") as string) || null,
    expires_at: (formData.get("expires_at") as string) || null,
    user_id: user.id,
    status: "pending",
  });

  if (error) throw new Error(error.message);
  redirect("/?submitted=true");
}
