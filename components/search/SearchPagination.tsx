"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = {
  q: string;
  sort: string;
  category: string;
  date: string;
  currentPage: number;
  totalPages: number;
};

export default function SearchPagination({
  q,
  sort,
  category,
  date,
  currentPage,
  totalPages,
}: Props) {
  const router = useRouter();

  if (totalPages <= 1) return null;

  function goTo(page: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (sort) params.set("sort", sort);
    if (category) params.set("category", category);
    if (date) params.set("date", date);
    params.set("page", String(page));
    router.push(`/search?${params.toString()}`);
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1,
  );

  return (
    <div className="flex items-center justify-center gap-1 pt-2">
      <Button
        variant="matte"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => goTo(currentPage - 1)}
      >
        ←
      </Button>

      {visible.reduce<(number | "…")[]>((acc, p, i) => {
        if (i > 0 && p - (visible[i - 1] as number) > 1) acc.push("…");
        acc.push(p);
        return acc;
      }, []).map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-2 text-sm text-on-surface-variant">
            …
          </span>
        ) : (
          <Button
            key={p}
            variant={p === currentPage ? "glow" : "matte"}
            size="sm"
            onClick={() => goTo(p as number)}
          >
            {p}
          </Button>
        ),
      )}

      <Button
        variant="matte"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => goTo(currentPage + 1)}
      >
        →
      </Button>
    </div>
  );
}
