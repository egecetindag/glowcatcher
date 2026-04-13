"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import DealCard from "@/components/deal-card/DealCard";
import { getDeals } from "@/app/actions/deals/getDeals";
import { getUserVotes } from "@/app/actions/deals/getUserVotes";
const FEED_PAGE_SIZE = 10;
type Deal = {
  id: string;
  [key: string]: unknown;
};

type Props = {
  initialDeals: Deal[];
  initialVotes: Record<string, "up" | "down">;
  isAdmin: boolean;
  category?: string;
  tab?: string;
  store?: string;
};

export default function DealFeed({
  initialDeals,
  initialVotes,
  isAdmin,
  category,
  tab,
  store,
}: Props) {
  const [deals, setDeals] = useState(initialDeals);
  const [votes, setVotes] = useState(initialVotes);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(
    initialDeals.length === FEED_PAGE_SIZE,
  );
  const [isPending, startTransition] = useTransition();
  const sentinelRef = useRef<HTMLDivElement>(null);
  function loadMore() {
    startTransition(async () => {
      const newDeals = await getDeals(category, tab, page, store);
      if (newDeals.length === 0) {
        setHasMore(false);
        return;
      }

      const newVotes = await getUserVotes(newDeals.map((d) => d.id));
      setVotes((prev) => ({ ...prev, ...newVotes }));
      setDeals((prev) => [...prev, ...newDeals]);
      setPage((p) => p + 1);
      if (newDeals.length < FEED_PAGE_SIZE) setHasMore(false);
    });
  }

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isPending) {
          loadMore();
        }
      },
      { rootMargin: "200px" },
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, isPending, page]);

  return (
    <div className="flex flex-col gap-3">
      {deals.map((deal) => (
        <DealCard
          key={deal.id}
          deal={deal as Parameters<typeof DealCard>[0]["deal"]}
          isAdmin={isAdmin}
          initialVote={votes[deal.id] ?? null}
        />
      ))}

      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-4">
          {isPending && (
            <span className="text-xs text-on-surface-variant animate-pulse">
              Loading...
            </span>
          )}
        </div>
      )}

      {!hasMore && deals.length > 0 && (
        <p className="text-center text-xs text-on-surface-variant py-4">
          ✦ All caught up
        </p>
      )}
    </div>
  );
}
