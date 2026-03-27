import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import GlowVote from "./GlowVote";

type Deal = {
  id: string;
  title: string;
  store: string;
  price: number;
  original_price?: number;
  glow_count: number;
  down_count: number;
  category: string;
  image_url?: string;
  description?: string;
  created_at: string;
  profiles?: {
    username: string;
    avatar_url?: string;
  };
};

function getGlowRating(score: number) {
  if (score >= 100)
    return { label: "✦ Blinding", variant: "blinding" as const };
  if (score >= 50) return { label: "Glowing", variant: "glowing" as const };
  if (score >= 20) return { label: "Dewy", variant: "dewy" as const };
  if (score < 0) return { label: "Cold", variant: "matte" as const };
  return { label: "Matte", variant: "matte" as const };
}

export default function DealCard({ deal }: { deal: Deal }) {
  const score = deal.glow_count - (deal.down_count ?? 0);
  const rating = getGlowRating(score);
  const discount = deal.original_price
    ? Math.round(
        ((deal.original_price - deal.price) / deal.original_price) * 100,
      )
    : null;

  return (
    <div className="bg-surface-container-lowest rounded-xl overflow-hidden flex gap-0 hover:shadow-[0_8px_24px_oklch(0.20_0.04_345/5%)] transition-shadow">
      {/* Left — image */}
      <Link
        href={`/deals/${deal.id}`}
        className="relative w-32 shrink-0 bg-surface-container-low"
      >
        {deal.image_url ? (
          <Image
            src={deal.image_url}
            alt={deal.title}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl text-on-surface-variant">
            ✦
          </div>
        )}
      </Link>

      {/* Right — content */}
      <div className="flex flex-col gap-2 p-4 flex-1 min-w-0">
        {/* Top row — score + badges + time */}
        <div className="flex items-center gap-2 flex-wrap">
          <GlowVote
            dealId={deal.id}
            initialUp={deal.glow_count}
            initialDown={deal.down_count ?? 0}
          />
          <Badge variant={rating.variant}>{rating.label}</Badge>
          {discount && <Badge variant="discount">-{discount}%</Badge>}
          <span className="text-xs text-on-surface-variant ml-auto">
            {formatDistanceToNow(new Date(deal.created_at), {
              addSuffix: true,
            })}
          </span>
        </div>

        {/* Title */}
        <Link href={`/deals/${deal.id}`}>
          <h2 className="font-serif text-base font-semibold text-on-surface leading-snug hover:text-primary transition-colors line-clamp-2">
            {deal.title}
          </h2>
        </Link>

        {/* Price + store + posted by */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-lg font-semibold text-primary">
            £{deal.price}
          </span>
          {deal.original_price && (
            <span className="text-xs text-on-surface-variant line-through">
              £{deal.original_price}
            </span>
          )}
          <span className="text-xs text-on-surface-variant">·</span>
          <span className="text-xs font-medium text-on-surface">
            {deal.store}
          </span>
          {deal.profiles && (
            <>
              <span className="text-xs text-on-surface-variant">·</span>
              <div className="flex items-center gap-1">
                <Avatar className="w-4 h-4">
                  <AvatarImage src={deal.profiles.avatar_url ?? undefined} />
                  <AvatarFallback className="text-[8px] bg-pink-100 text-pink-700">
                    {deal.profiles.username?.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-on-surface-variant">
                  {deal.profiles.username}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Description snippet */}
        {deal.description && (
          <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
            {deal.description}
          </p>
        )}

        {/* Get deal button */}
        <div className="mt-auto pt-1">
          <Link
            href={deal.id ? `/deals/${deal.id}` : "#"}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
          >
            Get deal →
          </Link>
        </div>
      </div>
    </div>
  );
}
