"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function GlowVote({
  dealId,
  initialUp,
  initialDown,
}: {
  dealId: string;
  initialUp: number;
  initialDown: number;
}) {
  const [up, setUp] = useState(initialUp);
  const [down, setDown] = useState(initialDown);
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUserVote() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("glows")
        .select("type")
        .eq("deal_id", dealId)
        .eq("user_id", user.id)
        .single();

      if (data) setVote(data.type as "up" | "down");
    }

    fetchUserVote();
  }, [dealId]);

  const score = up - down;

  async function handleVote(type: "up" | "down") {
    if (loading) return;
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/auth/login";
      return;
    }

    // Aynı oya tekrar tıklarsa kaldır
    if (vote === type) {
      await supabase
        .from("glows")
        .delete()
        .eq("deal_id", dealId)
        .eq("user_id", user.id);

      if (type === "up") setUp((u) => u - 1);
      else setDown((d) => d - 1);
      setVote(null);
      setLoading(false);
      await supabase.rpc("update_glow_counts", { deal_id: dealId });
      return;
    }

    // Önceki oyu kaldır
    if (vote) {
      await supabase
        .from("glows")
        .delete()
        .eq("deal_id", dealId)
        .eq("user_id", user.id);

      if (vote === "up") setUp((u) => u - 1);
      else setDown((d) => d - 1);
    }

    // Yeni oyu ekle
    await supabase.from("glows").insert({
      deal_id: dealId,
      user_id: user.id,
      type,
    });

    if (type === "up") setUp((u) => u + 1);
    else setDown((d) => d + 1);
    setVote(type);
    setLoading(false);
    await supabase.rpc("update_glow_counts", { deal_id: dealId });
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      className="flex items-center gap-1 bg-surface-container-low rounded-full px-1 py-0.5"
    >
      <button
        onClick={() => handleVote("down")}
        disabled={loading}
        className={`w-6 h-6 rounded-full flex items-center justify-center transition text-sm ${
          vote === "down"
            ? "bg-primary text-on-primary"
            : "text-on-surface-variant hover:text-primary"
        }`}
      >
        ↓
      </button>
      <span
        className={`text-xs font-semibold min-w-[2rem] text-center ${
          score > 0
            ? "text-primary"
            : score < 0
              ? "text-red-500"
              : "text-on-surface-variant"
        }`}
      >
        {score > 0 ? "✦" : ""}
        {score}
      </span>
      <button
        onClick={() => handleVote("up")}
        disabled={loading}
        className={`w-6 h-6 rounded-full flex items-center justify-center transition text-sm ${
          vote === "up"
            ? "bg-primary text-on-primary"
            : "text-on-surface-variant hover:text-primary"
        }`}
      >
        ↑
      </button>
    </div>
  );
}
