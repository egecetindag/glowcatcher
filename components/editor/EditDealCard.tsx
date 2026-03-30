"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { updateDeal } from "@/app/actions/editor";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES, Deal } from "@/app/actions/types";
import { useRouter } from "next/navigation";

export default function EditorDealCard({ deal }: { deal: Deal }) {
  const router = useRouter();
  const [loading, setLoading] = useState<
    "approve" | "reject" | "delete" | "save" | null
  >(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragging, setDragging] = useState(false);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const [fields, setFields] = useState({
    title: deal.title ?? "",
    store: deal.store ?? "",
    price: String(deal.price ?? ""),
    original_price:
      deal.original_price != null ? String(deal.original_price) : "",
    url: deal.url ?? "",
    image_url: deal.image_url ?? "",
    voucher_code: deal.voucher_code ?? "",
    description: deal.description ?? "",
    category: deal.category ?? "",
    expires_at: deal.expires_at ? deal.expires_at.slice(0, 10) : "",
  });

  function set(key: keyof typeof fields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `deals/${deal.id}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("deal-images")
        .upload(path, file, { upsert: true });
      if (error) {
        setUploadError(error.message);
      } else {
        const { data } = supabase.storage
          .from("deal-images")
          .getPublicUrl(path);
        set("image_url", data.publicUrl);
        setUploadError("");
      }
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setLoading("save");
    try {
      await updateDeal(deal.id, fields);
      router.push(`/deals/${deal.slug}`);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="border rounded-2xl p-4 flex flex-col gap-3 bg-card">
      <div className="mb-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 flex-1 mb-3">
            <div className="flex items-center gap-2">
              <Badge variant="pending">Pending</Badge>
              <span className="text-xs text-muted-foreground">
                by {deal.profiles?.username ?? "unknown"}
              </span>
            </div>

            <Input
              value={fields.title}
              onChange={(e) => set("title", e.target.value)}
              className="font-medium text-sm mt-1"
            />

            <Input
              value={fields.store}
              onChange={(e) => set("store", e.target.value)}
              placeholder="Store"
              className="text-xs"
            />
          </div>

          {/* Price */}
          <div className="text-right shrink-0">
            <div className="flex flex-col gap-1 items-end">
              <Input
                value={fields.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="Price"
                className="w-24 text-right"
                type="number"
              />
              <Input
                value={fields.original_price}
                onChange={(e) => set("original_price", e.target.value)}
                placeholder="Original"
                className="w-24 text-right text-xs"
                type="number"
              />
            </div>
          </div>
        </div>

        {/* Description */}

        <Textarea
          value={fields.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Description"
          rows={3}
          className="resize-none text-xs mb-3"
        />

        {/* Image */}

        <div className="flex flex-col gap-2 mb-3">
          <Input
            value={fields.image_url}
            onChange={(e) => set("image_url", e.target.value)}
            placeholder="Image URL"
            className="text-xs"
          />
          <button
            type="button"
            onClick={() => imgInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file && file.type.startsWith("image/")) {
                const fakeEvent = {
                  target: { files: e.dataTransfer.files },
                } as unknown as React.ChangeEvent<HTMLInputElement>;
                handleImageUpload(fakeEvent);
              }
            }}
            disabled={uploading}
            className={`w-full rounded-xl border-2 border-dashed px-4 py-4 flex flex-col items-center gap-1 transition-colors cursor-pointer ${
              dragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-amber-300 hover:bg-muted/40"
            }`}
          >
            {uploading ? (
              <span className="text-xs text-muted-foreground">
                Uploading...
              </span>
            ) : (
              <>
                <span className="text-sm font-medium text-on-surface">
                  Drag & drop or click to upload
                </span>
                <span className="text-xs text-muted-foreground">
                  Replaces the image URL above
                </span>
              </>
            )}
          </button>
          <input
            ref={imgInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          {uploadError && (
            <p className="text-xs text-destructive">{uploadError}</p>
          )}
          {fields.image_url && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fields.image_url}
                alt="preview"
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>

        {/* Category + URL row */}

        <div className="flex flex-col gap-2 mb-3">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => set("category", cat)}
                className={`px-3 py-1 rounded-full text-xs transition border ${
                  fields.category === cat
                    ? "bg-amber-500 text-amber-900 border-amber-500"
                    : "border-border text-muted-foreground hover:border-amber-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <Input
            value={fields.url}
            onChange={(e) => set("url", e.target.value)}
            placeholder="Deal URL"
            className="text-xs"
          />
          <Input
            value={fields.voucher_code}
            onChange={(e) => set("voucher_code", e.target.value)}
            placeholder="Voucher code (optional)"
            className="text-xs"
          />
          <Input
            value={fields.expires_at}
            onChange={(e) => set("expires_at", e.target.value)}
            type="date"
            className="text-xs"
          />
        </div>
      </div>

      {/* Actions */}

      <div className="flex gap-2">
        <Button
          variant="glow"
          size="lg"
          className="flex-1"
          onClick={handleSave}
          isLoading={loading === "save"}
          disabled={!!loading}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
