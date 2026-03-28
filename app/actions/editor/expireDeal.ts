// app/actions/editor/expireDeal.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function expireDeal(dealId: string) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { error } = await supabase
    .from("deals")
    .update({ status: "expired" })
    .eq("id", dealId);

  if (error) throw new Error(error.message);
  revalidatePath("/editor");
  revalidatePath("/");
}
