import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DealCard from "@/components/deal-card/DealCard";
import { getProfile, getProfileDeals } from "@/app/actions/profile";
import CategoryFilter from "@/components/CategoryFilter";
import { getUser } from "@/app/actions/auth/getUser";
import { CATEGORIES } from "@/app/actions/types";

export default async function PublicProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { username } = await params;
  const { category } = await searchParams;

  const [profile, user] = await Promise.all([getProfile(username), getUser()]);
  if (!profile) notFound();

  const deals = await getProfileDeals(profile.id, category);
  const isAdmin = user?.role === "admin";

  return (
    <div className="max-w-200 mx-auto flex flex-col gap-8">
      {/* Profile header */}
      <div className="flex items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={profile.avatar_url ?? undefined} />
          <AvatarFallback className="bg-pink-100 text-pink-700 text-xl">
            {profile.username?.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-serif text-2xl font-bold text-on-surface">
            {profile.username}&apos;s deals
          </h1>
          {profile.bio && (
            <p className="text-sm text-on-surface-variant mt-1">
              {profile.bio}
            </p>
          )}
          <p className="text-xs text-on-surface-variant mt-1">
            {deals?.length ?? 0} deals shared
          </p>
        </div>
      </div>

      {/* Category filter */}
      <CategoryFilter
        categories={CATEGORIES}
        active={category || "All"}
        basePath={`/profile/${username}`}
      />

      {/* Deals */}
      <div className="flex flex-col gap-3">
        {deals && deals.length > 0 ? (
          deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} isAdmin={isAdmin} />
          ))
        ) : (
          <div className="text-center py-20 text-on-surface-variant">
            <p className="text-4xl mb-3">✦</p>
            <p className="text-sm">No deals found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
