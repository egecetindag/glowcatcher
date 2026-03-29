"use client";

import { useRouter } from "next/navigation";

const CATEGORIES = [
  "Skincare",
  "Makeup",
  "Haircare",
  "Fragrance",
  "Tools",
  "Health",
];

const SORT_OPTIONS = [
  { value: "votes", label: "Most voted" },
  { value: "recent", label: "Most recent" },
  { value: "price_high", label: "Price: high to low" },
  { value: "price_low", label: "Price: low to high" },
];

const DATE_OPTIONS = [
  { value: "all", label: "All time" },
  { value: "30d", label: "Last 30 days" },
  { value: "7d", label: "Last 7 days" },
];

type Props = {
  q: string;
  sort: string;
  category: string;
  date: string;
};

export default function SearchFilters({ q, sort, category, date }: Props) {
  const router = useRouter();

  function update(key: string, value: string) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (key !== "sort") params.set("sort", sort);
    if (key !== "category") params.set("category", category);
    if (key !== "date") params.set("date", date);
    if (value) params.set(key, value);
    params.delete("page");
    router.push(`/search?${params.toString()}`);
  }

  return (
    <aside className="flex flex-col gap-6">
      {/* Sort */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
          Sort by
        </p>
        <div className="flex flex-col gap-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update("sort", opt.value)}
              className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                sort === opt.value
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
          Category
        </p>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => update("category", "")}
            className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
              !category
                ? "bg-primary/10 text-primary font-medium"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => update("category", cat === category ? "" : cat)}
              className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                category === cat
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Date */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
          Date
        </p>
        <div className="flex flex-col gap-1">
          {DATE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update("date", opt.value)}
              className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                (date || "all") === opt.value
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
