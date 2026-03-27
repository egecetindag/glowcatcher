"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function rejectDeal(dealId: string) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { error } = await supabase
    .from("deals")
    .update({ status: "rejected" })
    .eq("id", dealId);

  if (error) throw new Error(error.message);
  revalidatePath("/editor");
}
