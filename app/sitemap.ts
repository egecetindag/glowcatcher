import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  const { data: deals } = await supabase
    .from("deals")
    .select("slug, created_at, store")
    .in("status", ["approved", "expired"])
    .order("created_at", { ascending: false });

  const dealUrls =
    deals?.map((deal) => ({
      url: `https://glowcatcher.co.uk/deals/${deal.slug}`,
      lastModified: new Date(deal.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })) ?? [];

  const stores = [
    ...new Set((deals ?? []).map((d) => d.store).filter(Boolean)),
  ];
  const storeUrls = stores.map((store) => ({
    url: `https://glowcatcher.co.uk/sale/${store.toLowerCase().replace(/\s+/g, "-")}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

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
    ...storeUrls,
    ...dealUrls,
  ];
}
