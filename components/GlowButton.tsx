"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function GlowButton({
  dealId,
  initialCount,
}: {
  dealId: string;
  initialCount: number;
}) {
  const [count, setCount] = useState(initialCount);
  const [glowed, setGlowed] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleGlow() {
    if (glowed || loading) return;
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/auth/login";
      return;
    }

    const { error } = await supabase.from("glows").insert({
      deal_id: dealId,
      user_id: user.id,
    });

    if (!error) {
      await supabase.rpc("increment_glow", { deal_id: dealId });
      setCount((c) => c + 1);
      setGlowed(true);
    }

    setLoading(false);
  }

  return (
    <Button
      variant={glowed ? "glow" : "matte"}
      size="pill"
      onClick={handleGlow}
      disabled={loading}
    >
      ✦ {count}
    </Button>
  );
}
