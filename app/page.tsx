import { createClient } from "@/lib/supabase";
import DealCard from "@/components/DealCard";
import CategoryFilter from "@/components/CategoryFilter";

const CATEGORIES = [
  "All",
  "Skincare",
  "Makeup",
  "Haircare",
  "Fragrance",
  "Tools",
  "Body",
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const supabase = createClient();
  const category = searchParams.category;

  let query = supabase
    .from("deals")
    .select("*")
    .eq("status", "approved")
    .order("glow_count", { ascending: false });

  if (category && category !== "All") {
    query = query.eq("category", category);
  }

  const { data: deals } = await query;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          Today's glowing deals
        </h1>
        <p className="text-gray-500 text-sm">
          Fresh beauty finds, caught by the community
        </p>
      </div>

      <CategoryFilter categories={CATEGORIES} active={category || "All"} />

      {deals && deals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">✦</p>
          <p className="text-sm">No deals found. Be the first to submit one!</p>
        </div>
      )}
    </div>
  );
}
