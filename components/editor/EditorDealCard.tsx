"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  approveDeal,
  rejectDeal,
  deleteDeal,
  updateDeal,
} from "@/app/actions/editor";
import { createClient } from "@/lib/supabase/client";

type Deal = {
  id: string;
  title: string;
  store: string;
  price: number;
  original_price: number | null;
  url: string;
  image_url: string | null;
  voucher_code: string | null;
  description: string | null;
  category: string | null;
  expires_at: string | null;
  profiles: { username: string | null } | null;
};

const CATEGORIES = [
  "Skincare",
  "Makeup",
  "Haircare",
  "Fragrance",
  "Tools",
  "Health",
];

export default function EditorDealCard({ deal }: { deal: Deal }) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState<
    "approve" | "reject" | "delete" | "save" | null
  >(null);
  const [done, setDone] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
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

  async function handleAction(action: "approve" | "reject" | "delete") {
    setLoading(action);
    try {
      if (action === "approve") await approveDeal(deal.id);
      if (action === "reject") await rejectDeal(deal.id);
      if (action === "delete") await deleteDeal(deal.id);
      setDone(true);
    } finally {
      setLoading(null);
    }
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
      setEditing(false);
    } finally {
      setLoading(null);
    }
  }

  if (done) {
    return (
      <div className="border rounded-2xl p-4 flex items-center justify-center py-6 bg-card">
        <p className="text-xs text-muted-foreground">Done ✦</p>
      </div>
    );
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

            {editing ? (
              <Input
                value={fields.title}
                onChange={(e) => set("title", e.target.value)}
                className="font-medium text-sm mt-1"
              />
            ) : (
              <h2 className="font-medium text-sm">{fields.title}</h2>
            )}

            {editing ? (
              <Input
                value={fields.store}
                onChange={(e) => set("store", e.target.value)}
                placeholder="Store"
                className="text-xs"
              />
            ) : (
              <p className="text-xs text-muted-foreground">{fields.store}</p>
            )}
          </div>

          {/* Price */}
          <div className="text-right shrink-0">
            {editing ? (
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
            ) : (
              <>
                <p className="text-lg font-semibold text-amber-500">
                  £{fields.price}
                </p>
                {fields.original_price && (
                  <p className="text-xs text-muted-foreground line-through">
                    £{fields.original_price}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Description */}
        {editing ? (
          <Textarea
            value={fields.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Description"
            rows={3}
            className="resize-none text-xs mb-3"
          />
        ) : (
          fields.description && (
            <p className="text-xs text-muted-foreground border-t pt-3 mb-3">
              {fields.description}
            </p>
          )
        )}

        {/* Image */}
        {editing ? (
          <div className="flex flex-col gap-2 mb-3">
            <div className="flex gap-2">
              <Input
                value={fields.image_url}
                onChange={(e) => set("image_url", e.target.value)}
                placeholder="Image URL"
                className="text-xs"
              />
              <Button
                variant="matte"
                size="sm"
                type="button"
                disabled={uploading}
                isLoading={uploading}
                onClick={() => imgInputRef.current?.click()}
              >
                Upload
              </Button>
              <input
                ref={imgInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
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
        ) : (
          fields.image_url && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fields.image_url}
                alt={fields.title}
                className="w-full h-full object-contain"
              />
            </div>
          )
        )}

        {/* Category + URL row */}
        {editing ? (
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
        ) : (
          <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground pt-3">
            {fields.category && (
              <Badge variant="matte">{fields.category}</Badge>
            )}
            {fields.url && (
              <Link
                href={fields.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 hover:underline ml-auto"
              >
                View deal →
              </Link>
            )}
          </div>
        )}

        {!editing && fields.voucher_code && (
          <div className="text-xs flex gap-1 mt-2">
            <div>Voucher Code:</div>
            <span className="font-mono bg-muted px-2 py-0.5 rounded">
              {fields.voucher_code}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      {editing ? (
        <div className="flex gap-2">
          <Button
            variant="matte"
            size="lg"
            className="flex-1"
            onClick={() => setEditing(false)}
            disabled={!!loading}
          >
            Cancel
          </Button>
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
      ) : (
        <div className="flex gap-2">
          <Button
            variant="glow"
            size="lg"
            className="flex-1"
            disabled={!!loading}
            onClick={() => handleAction("approve")}
            isLoading={loading === "approve"}
          >
            ✦ Approve
          </Button>
          <Button
            variant="destructive"
            size="lg"
            className="px-4"
            disabled={!!loading}
            onClick={() => handleAction("delete")}
            isLoading={loading === "delete"}
          >
            Reject
          </Button>
          <Button
            variant="matte"
            size="lg"
            className="px-4"
            disabled={!!loading}
            onClick={() => setEditing(true)}
          >
            Edit
          </Button>
        </div>
      )}
    </div>
  );
}
