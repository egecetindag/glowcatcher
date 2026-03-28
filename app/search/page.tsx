import { searchDeals } from "@/app/actions/deals/searchDeals";
import { SEARCH_PAGE_SIZE } from "@/app/actions/deals/searchConfig";
import { getUser } from "@/app/actions/auth/getUser";
import DealCard from "@/components/deal-card/DealCard";
import SearchFilters from "@/components/search/SearchFilters";
import SearchPagination from "@/components/search/SearchPagination";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    sort?: string;
    category?: string;
    date?: string;
    page?: string;
  }>;
}) {
  const { q = "", sort = "votes", category = "", date = "all", page: pageStr = "1" } =
    await searchParams;
  const page = Math.max(1, parseInt(pageStr) || 1);

  if (!q) {
    return (
      <div className="text-center py-20 text-on-surface-variant">
        <i className="fi fi-rr-search text-4xl leading-none mb-4 block" />
        <p className="text-sm">Type something to search deals</p>
      </div>
    );
  }

  const [{ deals, total }, user] = await Promise.all([
    searchDeals(q, { sort, category, date, page }),
    getUser(),
  ]);
  const isAdmin = user?.role === "admin";
  const totalPages = Math.ceil(total / SEARCH_PAGE_SIZE);

  return (
    <div className="max-w-200 mx-auto">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-on-surface">
          Results for &ldquo;{q}&rdquo;
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          {total} deal{total !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="flex gap-8 items-start">
        {/* Filters sidebar */}
        <div className="hidden md:block w-44 shrink-0 sticky top-6">
          <SearchFilters q={q} sort={sort} category={category} date={date} />
        </div>

        {/* Results */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {deals.length > 0 ? (
            <>
              {deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} isAdmin={isAdmin} />
              ))}
              <SearchPagination
                q={q}
                sort={sort}
                category={category}
                date={date}
                currentPage={page}
                totalPages={totalPages}
              />
            </>
          ) : (
            <div className="text-center py-20 text-on-surface-variant">
              <i className="fi fi-rr-face-sad text-4xl leading-none mb-4 block" />
              <p className="text-sm">No deals found for &ldquo;{q}&rdquo;</p>
              <p className="text-xs mt-1">Try different keywords or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
