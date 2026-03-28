"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { approveDeal } from "@/app/actions/editor";

export default function ActivateButton({ dealId }: { dealId: string }) {
  const [loading, setLoading] = useState(false);

  async function handle() {
    setLoading(true);
    try {
      await approveDeal(dealId);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      className=" w-[90%] mx-auto bg-green-700 hover:bg-green-600 text-white"
      disabled={loading}
      isLoading={loading}
      onClick={handle}
    >
      Mark as Active
    </Button>
  );
}
