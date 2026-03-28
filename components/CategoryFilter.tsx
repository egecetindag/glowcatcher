"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CategoryFilter({
  categories,
  active,
  basePath = "/",
}: {
  categories: string[];
  active: string;
  basePath?: string;
}) {
  const router = useRouter();
  console.log("base", basePath);
  return (
    <div className="flex gap-2 flex-wrap">
      {categories.map((cat) => (
        <Button
          key={cat}
          variant={active === cat ? "glow" : "matte"}
          size="pill"
          onClick={() =>
            router.push(
              cat === "All" ? basePath : `${basePath}?category=${cat}`,
            )
          }
        >
          {cat}
        </Button>
      ))}
    </div>
  );
}
