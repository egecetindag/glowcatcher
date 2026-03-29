import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data: deals } = await supabase
    .from("deals")
    .select("id, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  const dealUrls =
    deals?.map((deal) => ({
      url: `https://glowcatcher.co.uk/deals/${deal.id}`,
      lastModified: new Date(deal.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })) ?? [];

  return [
    {
      url: "https://glowcatcher.co.uk",
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: "https://glowcatcher.co.uk/submit",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...dealUrls,
  ];
}
