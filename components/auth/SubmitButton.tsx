"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export default function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      variant="glow"
      size="lg"
      className="w-full uppercase tracking-widest mt-1"
      type="submit"
      isLoading={pending}
    >
      {label}
    </Button>
  );
}
