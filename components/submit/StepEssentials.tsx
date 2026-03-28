import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DealFormData } from "@/app/submit/page";

type Props = {
  data: DealFormData;
  updateFields: (fields: Partial<DealFormData>) => void;
  onNext: () => void;
};

export default function StepEssentials({ data, updateFields, onNext }: Props) {
  function handleNext() {
    if (!data.title || !data.price || !data.store || !data.url) return;
    onNext();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Let&apos;s start with the essentials
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          The basics about your deal
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">
            Title <span className="text-pink-500">*</span>
          </Label>
          <Input
            id="title"
            value={data.title}
            onChange={(e) => updateFields({ title: e.target.value })}
            placeholder="e.g. Charlotte Tilbury Magic Cream 50ml"
            maxLength={120}
          />
          <p className="text-xs text-muted-foreground text-right">
            {data.title.length}/120
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="price">
              Price <span className="text-pink-500">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                £
              </span>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={data.price}
                onChange={(e) => updateFields({ price: e.target.value })}
                placeholder="0.00"
                className="pl-7"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="original_price">Original price</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                £
              </span>
              <Input
                id="original_price"
                type="number"
                min="0"
                step="0.01"
                value={data.original_price}
                onChange={(e) =>
                  updateFields({ original_price: e.target.value })
                }
                placeholder="0.00"
                className="pl-7"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="store">
            Store <span className="text-pink-500">*</span>
          </Label>
          <Input
            id="store"
            value={data.store}
            onChange={(e) => updateFields({ store: e.target.value })}
            placeholder="e.g. Boots, LOOKFANTASTIC, Sephora"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="url">
            Deal URL <span className="text-pink-500">*</span>
          </Label>
          <Input
            id="url"
            type="url"
            value={data.url}
            onChange={(e) => updateFields({ url: e.target.value })}
            placeholder="https://"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="voucher_code">Voucher code</Label>
          <Input
            id="voucher_code"
            value={data.voucher_code}
            onChange={(e) => updateFields({ voucher_code: e.target.value })}
            placeholder="e.g. GLOW20"
          />
        </div>
      </div>

      <Button variant="glow" className="w-full" onClick={handleNext}>
        Next →
      </Button>
    </div>
  );
}
