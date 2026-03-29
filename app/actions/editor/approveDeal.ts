"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { resend } from "@/lib/resend";

export async function approveDeal(dealId: string) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data: deal } = await supabase
    .from("deals")
    .select("*, profiles(username)")
    .eq("id", dealId)
    .single();

  const { error } = await supabase
    .from("deals")
    .update({ status: "approved" })
    .eq("id", dealId);

  if (error) throw new Error(error.message);

  // Alert kontrolü TODO: Bunu daha optimize yap, tek seferde tüm eşleşen alertleri ve kullanıcı emaillerini çek
  if (deal) {
    const searchText =
      `${deal.title} ${deal.store} ${deal.category} ${deal.description ?? ""}`.toLowerCase();
    const { data: alerts } = await supabase
      .from("alerts")
      .select("*, profiles(email)");
    const matchingAlerts = (alerts ?? []).filter((alert) =>
      searchText.includes(alert.keyword.toLowerCase()),
    );
    if (matchingAlerts && matchingAlerts.length > 0) {
      // Her alert sahibine email at
      const userIds = [...new Set(matchingAlerts.map((a) => a.user_id))];

      for (const userId of userIds) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("email")
          .eq("id", userId)
          .single();

        if (!profile?.email) continue;

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL!,
          to: profile.email,
          subject: `✦ New deal alert: ${deal.title}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #b90a5a;">✦ GlowCatcher Alert</h1>
              <p>A deal matching your alert just went live!</p>
              
              <div style="background: #f9f9fa; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <h2 style="margin: 0 0 8px;">${deal.title}</h2>
                <p style="color: #b90a5a; font-size: 24px; font-weight: bold; margin: 0;">
                  £${deal.price}
                  ${deal.original_price ? `<span style="color: #888; font-size: 16px; text-decoration: line-through; margin-left: 8px;">£${deal.original_price}</span>` : ""}
                </p>
                <p style="color: #666; margin: 8px 0 0;">${deal.store}</p>
              </div>

              ${deal.description ? `<p style="color: #444;">${deal.description}</p>` : ""}
              
              <a href="https://glowcatcher.co.uk/deals/${deal.id}" 
                style="display: inline-block; background: #b90a5a; color: white; padding: 12px 24px; border-radius: 100px; text-decoration: none; font-weight: 500; margin-top: 16px;">
                Get this deal →
              </a>

              <p style="color: #999; font-size: 12px; margin-top: 32px;">
                You're receiving this because you set up an alert on GlowCatcher. 
                <a href="https://glowcatcher.co.uk/alerts" style="color: #b90a5a;">Manage alerts</a>
              </p>
            </div>
          `,
        });
      }
    }
  }

  revalidatePath("/editor");
  revalidatePath("/");
}
