import type { Metadata } from "next";
// import { notFound } from "next/navigation";
// import { getUser } from "@/app/actions/auth/getUser";
import { getUserVotes } from "@/app/actions/deals/getUserVotes";
import DealFeed from "@/components/deal-feed/DealFeed";
import { getDeals } from "@/app/deals";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ store: string }>;
}): Promise<Metadata> {
  const { store } = await params;
  const title = `${store} Sale & Discount Codes — GlowCatcher`;
  const description = `Find the best ${store} beauty deals and discount codes, updated daily on GlowCatcher.`;
  return {
    title,
    description,
    alternates: { canonical: `https://glowcatcher.co.uk/sale/${store}` },
    openGraph: { title, description, siteName: "GlowCatcher" },
  };
}

export default async function StorePage({
  params,
}: {
  params: Promise<{ store: string }>;
}) {
  const { store } = await params;
  const deals = await getDeals(undefined, "All", 0, store);

  const [voteMap] = await Promise.all([getUserVotes(deals.map((d) => d.id))]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold text-on-surface">
          {store} Sale
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          The best {store} beauty deals, caught fresh daily.
        </p>
      </div>

      <div className="bg-surface-container-low rounded-2xl p-4">
        <DealFeed
          initialDeals={deals}
          initialVotes={voteMap}
          isAdmin={false}
          store={store}
        />
      </div>
    </div>
  );
}
