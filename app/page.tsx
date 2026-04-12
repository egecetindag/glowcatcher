import Link from "next/link";
import DealFeed from "@/components/deal-feed/DealFeed";
import CategoryFilter from "@/components/CategoryFilter";
import { getUser } from "@/app/actions/auth/getUser";
import { getDeals } from "@/app/actions/deals/getDeals";
import { getUserVotes } from "@/app/actions/deals/getUserVotes";
import { CATEGORIES } from "@/app/actions/types";
import SectionsCarousel from "@/components/SectionCarousel";
import { getSections } from "./actions/sections/getSections";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tab?: string }>;
}) {
  const { category, tab = "all" } = await searchParams;

  const [deals, user, sections] = await Promise.all([
    getDeals(category, tab, 0),
    getUser(),
    getSections(),
  ]);
  const isAdmin = user?.role === "admin";
  const voteMap =
    deals.length > 0 ? await getUserVotes(deals.map((d) => d.id)) : {};

  return (
    <div>
      {/* Hero */}
      {/* <section className="mb-10 pt-1"> */}
      {/* <h1 className="font-serif text-4xl font-bold text-on-surface leading-tight">
          Glow for Less
        </h1> */}
      {/* <p className="text-on-surface-variant text-sm mb-1 max-w-xs leading-relaxed">
          Discover the best beauty offers!
        </p> */}
      {/* </section> */}

      {/* Sections carousel */}
      <SectionsCarousel sections={sections} />

      {/* Category filter */}
      {/* <div className="mb-4">
        <CategoryFilter categories={CATEGORIES} active={category || "All"} />
      </div> */}

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
        {deals.length > 0 ? (
          <DealFeed
            key={`${category ?? "all"}-${tab ?? "most-glowing"}`}
            initialDeals={deals}
            initialVotes={voteMap}
            isAdmin={isAdmin}
            category={category}
            tab={tab}
          />
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
