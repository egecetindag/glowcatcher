import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import DealCard from "@/components/deal-card/DealCard";
import CategoryFilter from "@/components/CategoryFilter";
import { getUser } from "@/app/actions/auth/getUser";

const CATEGORIES = [
  "All",
  "Skincare",
  "Makeup",
  "Haircare",
  "Fragrance",
  "Tools",
  "Health",
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tab?: string }>;
}) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { category, tab = "all" } = await searchParams;
  let query = supabase
    .from("deals")
    .select("*, profiles(username, avatar_url)")
    .eq("status", "approved");

  if (category && category !== "All") {
    query = query.eq("category", category);
  }

  if (tab === "most-glowing") {
    query = query.order("glow_count", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const [{ data: deals }, user] = await Promise.all([query, getUser()]);
  const isAdmin = user?.role === "admin";

  return (
    <div>
      {/* Hero */}
      <section className="mb-10 pt-4">
        {/* <p className="text-xs font-medium uppercase tracking-widest text-on-surface-variant mb-3">
          Editor&apos;s Choice
        </p> */}
        <h1 className="font-serif text-4xl font-bold text-on-surface leading-tight mb-3">
          Radiance is just
          <br />a deal away.
        </h1>
        <p className="text-on-surface-variant text-sm mb-6 max-w-xs leading-relaxed">
          Discover the best beauty offers!
        </p>
        {/* <Button variant="glow" size="lg" asChild>
          <Link href="#deals">Explore Trending</Link>
        </Button> */}
      </section>

      {/* Category filter */}
      <div className="mb-4">
        <CategoryFilter categories={CATEGORIES} active={category || "All"} />
      </div>

      {/* Most Glowing / All tabs */}
      <div className="flex gap-1 mb-4 bg-surface-container-low rounded-full p-1 w-fit">
        <Link
          href={`/?${category ? `category=${category}&` : ""}tab=most-glowing`}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
            tab === "most-glowing"
              ? "bg-surface-container-lowest text-on-surface shadow-sm"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          ✦ Most Glowing
        </Link>
        <Link
          href={`/?${category ? `category=${category}&` : ""}tab=all`}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
            tab === "all"
              ? "bg-surface-container-lowest text-on-surface shadow-sm"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          All
        </Link>
      </div>

      {/* Deals feed */}
      <div id="deals" className="bg-surface-container-low rounded-2xl p-4">
        {deals && deals.length > 0 ? (
          <div className="flex flex-col gap-3">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} isAdmin={isAdmin} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-on-surface-variant">
            <p className="text-4xl mb-3">✦</p>
            <p className="text-sm">
              No deals found. Be the first to submit one!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
