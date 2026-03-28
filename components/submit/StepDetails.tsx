import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { submitDeal } from "@/app/deals/submitDeal";
import type { DealFormData } from "@/app/submit/page";
import { useState } from "react";

const CATEGORIES = [
  "Skincare",
  "Makeup",
  "Haircare",
  "Fragrance",
  "Tools",
  "Body",
];

type Props = {
  data: DealFormData;
  updateFields: (fields: Partial<DealFormData>) => void;
  onBack: () => void;
};

export default function StepDetails({ data, updateFields, onBack }: Props) {
  const [pending, setPending] = useState(false);

  async function handleSubmit() {
    setPending(true);
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v !== null) formData.append(k, v as string | File);
    });
    await submitDeal(formData);
    setPending(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Final details</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Help the community understand why this deal is worth catching
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description">Why is this worth sharing?</Label>
          <Textarea
            id="description"
            value={data.description}
            onChange={(e) => updateFields({ description: e.target.value })}
            placeholder="e.g. Lowest price ever, usually £80 — great for gifting"
            rows={4}
            className="resize-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>
            Category <span className="text-pink-500">*</span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => updateFields({ category: cat })}
                className={`px-4 py-1.5 rounded-full text-sm transition border ${
                  data.category === cat
                    ? "bg-amber-500 text-amber-900 border-amber-500"
                    : "border-border text-muted-foreground hover:border-amber-300 hover:text-amber-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="expires_at">Expiry date</Label>
          <Input
            id="expires_at"
            type="date"
            value={data.expires_at}
            onChange={(e) => updateFields({ expires_at: e.target.value })}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="matte" className="w-full" onClick={onBack} size="lg">
          Back
        </Button>
        <Button
          variant="glow"
          className="w-full"
          onClick={handleSubmit}
          disabled={!data.category}
          size="lg"
          isLoading={pending}
        >
          Submit deal ✦
        </Button>
      </div>
    </div>
  );
}
