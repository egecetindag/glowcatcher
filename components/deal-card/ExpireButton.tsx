"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { expireDeal } from "@/app/actions/editor";

export default function ExpireButton({ dealId }: { dealId: string }) {
  const [loading, setLoading] = useState(false);
  console.log("dealId in ExpireButton:", dealId);
  async function handle() {
    setLoading(true);
    try {
      await expireDeal(dealId);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={loading}
      isLoading={loading}
      onClick={handle}
    >
      Mark as Expired
    </Button>
  );
}
