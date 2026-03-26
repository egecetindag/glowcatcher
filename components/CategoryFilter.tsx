"use client";

import { useRouter } from "next/navigation";

export default function CategoryFilter({
  categories,
  active,
}: {
  categories: string[];
  active: string;
}) {
  const router = useRouter();

  return (
    <div className="flex gap-2 flex-wrap">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => router.push(cat === "All" ? "/" : `/?category=${cat}`)}
          className={`px-4 py-1.5 rounded-full text-sm transition ${
            active === cat
              ? "bg-amber-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
