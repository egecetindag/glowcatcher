"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { formatDistanceToNow } from "date-fns";
import GlowVote from "./GlowVote";
import { expireDeal } from "@/app/actions/editor";

type Deal = {
  id: string;
  title: string;
  store: string;
  url: string;
  price: number;
  original_price?: number;
  glow_count: number;
  down_count: number;
  category: string;
  image_url?: string;
  description?: string;
  created_at: string;
  status?: string;
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

export default function DealCard({
  deal,
  isAdmin = false,
}: {
  deal: Deal;
  isAdmin?: boolean;
}) {
  const router = useRouter();
  const [expiring, setExpiring] = useState(false);
  const score = deal.glow_count - (deal.down_count ?? 0);
  const rating = getGlowRating(score);
  const discount = deal.original_price
    ? Math.round(
        ((deal.original_price - deal.price) / deal.original_price) * 100,
      )
    : null;
  const isExpired = deal.status === "expired";

  async function handleExpire(e: React.MouseEvent) {
    e.stopPropagation();
    setExpiring(true);
    try {
      await expireDeal(deal.id);
    } finally {
      setExpiring(false);
    }
  }

  return (
    <div
      onClick={() => router.push(`/deals/${deal.id}`)}
      className={`bg-surface-container-lowest rounded-xl overflow-hidden flex cursor-pointer hover:shadow-[0_8px_24px_oklch(0.20_0.04_345/5%)] transition-shadow ${isExpired ? "grayscale opacity-60" : ""}`}
    >
      {/* Left — image */}
      <div className="relative w-32 shrink-0 bg-surface-container-low">
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
      </div>

      {/* Right — content */}
      <div className="flex flex-col gap-2 p-4 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <GlowVote
            dealId={deal.id}
            initialUp={deal.glow_count}
            initialDown={deal.down_count ?? 0}
          />
          <Badge variant={rating.variant}>{rating.label}</Badge>
          {discount && <Badge variant="discount">-{discount}%</Badge>}
          {isExpired && <Badge variant="matte">Expired</Badge>}
          <span className="text-xs text-on-surface-variant ml-auto">
            {formatDistanceToNow(new Date(deal.created_at), {
              addSuffix: true,
            })}
          </span>
        </div>

        <h2 className="font-serif text-base font-semibold text-on-surface leading-snug hover:text-primary transition-colors line-clamp-2">
          {deal.title}
        </h2>

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
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/profile/${deal.profiles!.username}`);
                }}
                className="flex items-center gap-1"
              >
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

        {deal.description && (
          <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
            {deal.description}
          </p>
        )}

        <div className="mt-auto pt-1 flex items-center gap-2 self-end">
          {isAdmin && !isExpired && (
            <Button
              variant="destructive"
              size="sm"
              disabled={expiring}
              isLoading={expiring}
              onClick={handleExpire}
            >
              Mark as Expired
            </Button>
          )}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              window.open(deal.url, "_blank", "noopener,noreferrer");
            }}
            className="inline-flex items-center gap-1.5 text-xs font-medium"
          >
            Get The Deal →
          </Button>
        </div>
      </div>
    </div>
  );
}
