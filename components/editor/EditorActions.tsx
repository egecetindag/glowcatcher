"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { approveDeal, rejectDeal, deleteDeal } from "@/app/actions/editor";

export default function EditorActions({ dealId }: { dealId: string }) {
  const [loading, setLoading] = useState<
    "approve" | "reject" | "delete" | null
  >(null);
  const [done, setDone] = useState(false);

  async function handle(action: "approve" | "reject" | "delete") {
    setLoading(action);
    try {
      if (action === "approve") await approveDeal(dealId);
      if (action === "reject") await rejectDeal(dealId);
      if (action === "delete") await deleteDeal(dealId);
      setDone(true);
    } finally {
      setLoading(null);
    }
  }

  if (done) {
    return (
      <div className="flex items-center justify-center py-2">
        <p className="text-xs text-muted-foreground">Done ✦</p>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="glow"
        size="sm"
        className="flex-1"
        disabled={!!loading}
        onClick={() => handle("approve")}
      >
        {loading === "approve" ? "Approving..." : "✦ Approve"}
      </Button>
      <Button
        variant="dewy"
        size="sm"
        className="flex-1"
        disabled={!!loading}
        onClick={() => handle("reject")}
      >
        {loading === "reject" ? "Rejecting..." : "Reject"}
      </Button>
      <Button
        variant="destructive"
        size="sm"
        disabled={!!loading}
        onClick={() => handle("delete")}
      >
        {loading === "delete" ? "..." : "Delete"}
      </Button>
    </div>
  );
}
