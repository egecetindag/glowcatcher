"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateDeal(
  dealId: string,
  fields: {
    title: string;
    store: string;
    price: string;
    original_price: string;
    url: string;
    image_url: string;
    voucher_code: string;
    description: string;
    category: string;
    expires_at: string;
  },
) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { error } = await supabase
    .from("deals")
    .update({
      title: fields.title,
      store: fields.store,
      price: Number(fields.price),
      original_price: fields.original_price ? Number(fields.original_price) : null,
      url: fields.url,
      image_url: fields.image_url || null,
      voucher_code: fields.voucher_code || null,
      description: fields.description || null,
      category: fields.category || null,
      expires_at: fields.expires_at || null,
    })
    .eq("id", dealId);

  if (error) throw new Error(error.message);
  revalidatePath("/editor");
}
