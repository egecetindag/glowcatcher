import { getDeal } from "@/app/actions/deals/getDeal";
import { getComments } from "@/app/actions/comments";
import { getUser } from "@/app/actions/auth/getUser";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import GlowVote from "@/components/deal-card/GlowVote";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import CommentSection from "@/components/comments/CommentsSection";
import ExpireButton from "@/components/deal-card/ExpireButton";
import ActivateButton from "@/components/deal-card/ActivateButton";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const deal = await getDeal(id);
  if (!deal) return {};

  const description = deal.description
    ? deal.description.slice(0, 160)
    : `${deal.store} · £${deal.price}${deal.original_price ? ` (was £${deal.original_price})` : ""}`;

  return {
    title: `${deal.title} — GlowCatcher`,
    description,
    openGraph: {
      title: deal.title,
      description,
      url: `https://glowcatcher.co.uk/deals/${id}`,
      siteName: "GlowCatcher",
      ...(deal.image_url && {
        images: [
          { url: deal.image_url, width: 1200, height: 630, alt: deal.title },
        ],
      }),
      type: "website",
    },
    twitter: {
      card: deal.image_url ? "summary_large_image" : "summary",
      title: deal.title,
      description,
      ...(deal.image_url && { images: [deal.image_url] }),
      site: "@glowcatcheruk",
    },
  };
}

export default async function DealPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const [deal, comments, user] = await Promise.all([
    getDeal(id),
    getComments(id),
    getUser(),
  ]);

  if (!deal) notFound();

  const isExpired = deal.status === "expired";
  const isAdmin = user?.role === "admin";
  const score = deal.glow_count - (deal.down_count ?? 0);
  const discount = deal.original_price
    ? Math.round(
        ((deal.original_price - deal.price) / deal.original_price) * 100,
      )
    : null;

  return (
    <div className="max-w-200 mx-auto flex flex-col gap-8">
      {/* Deal card */}
      <div
        className={`bg-surface-container-lowest rounded-2xl overflow-hidden ${isExpired ? "grayscale opacity-60" : ""}`}
      >
        {/* Image */}
        {deal.image_url && (
          <div className="relative w-full aspect-video bg-surface-container-low">
            <Image
              src={deal.image_url}
              alt={deal.title}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        )}

        <div className="p-6 flex flex-col gap-4">
          {/* Vote + badges + time */}
          <div className="flex items-center gap-2 flex-wrap">
            <GlowVote
              dealId={deal.id}
              initialUp={deal.glow_count}
              initialDown={deal.down_count ?? 0}
            />
            {discount && <Badge variant="discount">-{discount}%</Badge>}
            {isExpired && <Badge variant="matte">Expired</Badge>}
            <span className="text-xs text-on-surface-variant ml-auto">
              {formatDistanceToNow(new Date(deal.created_at), {
                addSuffix: true,
              })}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-2xl font-bold text-on-surface leading-snug">
            {deal.title}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-primary">
              £{deal.price}
            </span>
            {deal.original_price && (
              <span className="text-base text-on-surface-variant line-through">
                £{deal.original_price}
              </span>
            )}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 text-sm text-on-surface-variant flex-wrap">
            <span className="font-medium text-on-surface">{deal.store}</span>
            {deal.category && <Badge variant="matte">{deal.category}</Badge>}
            {deal.voucher_code && (
              <span className="font-mono bg-surface-container-low px-2 py-0.5 rounded text-xs">
                {deal.voucher_code}
              </span>
            )}
            {deal.expires_at && (
              <span className="text-xs">
                Expires{" "}
                {formatDistanceToNow(new Date(deal.expires_at), {
                  addSuffix: true,
                })}
              </span>
            )}
          </div>

          {/* Posted by */}
          {deal.profiles && (
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <span>Posted by</span>
              <span className="font-medium text-on-surface">
                {deal.profiles.username}
              </span>
            </div>
          )}

          {/* Description */}
          {deal.description && (
            <p className="text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/15 pt-4">
              {deal.description}
            </p>
          )}

          {/* Get deal button */}
          <Button variant="glow" size="lg" asChild className="w-full mt-2">
            <Link href={deal.url} target="_blank" rel="noopener noreferrer">
              Get deal →
            </Link>
          </Button>
          {isAdmin && !isExpired && <ExpireButton dealId={deal.id} />}
        </div>
      </div>
      {isAdmin && isExpired && <ActivateButton dealId={deal.id} />}

      {/* Comments */}
      <CommentSection
        dealId={deal.id}
        comments={comments ?? []}
        currentUser={user ?? null}
      />
    </div>
  );
}
