"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
        <Button
          key={cat}
          variant={active === cat ? "glow" : "matte"}
          size="pill"
          onClick={() => router.push(cat === "All" ? "/" : `/?category=${cat}`)}
        >
          {cat}
        </Button>
      ))}
    </div>
  );
}
