"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import type { DealFormData } from "@/app/submit/page";

type Props = {
  data: DealFormData;
  updateFields: (fields: Partial<DealFormData>) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function StepImage({
  data,
  updateFields,
  onNext,
  onBack,
}: Props) {
  const [scraping, setScraping] = useState(false);
  const [scraped, setScraped] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [manualUrl, setManualUrl] = useState("");

  async function handleScrape() {
    if (!data.url) {
      setError("Please enter a deal URL in step 1 first");
      return;
    }

    setScraping(true);
    setError("");
    setScraped([]);

    try {
      const res = await fetch("/api/scrape-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: data.url }),
      });

      const json = await res.json();

      if (json.error) {
        setError(
          "Could not scrape images from this URL. Try adding one manually.",
        );
      } else if (json.images.length === 0) {
        setError("No images found on this page. Try adding one manually.");
      } else {
        setScraped(json.images);
      }
    } catch {
      setError("Something went wrong. Try adding an image URL manually.");
    } finally {
      setScraping(false);
    }
  }

  function handleSelect(img: string) {
    updateFields({ image_url: img });
  }

  function handleManualAdd() {
    if (!manualUrl) return;
    updateFields({ image_url: manualUrl });
    setManualUrl("");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Add an image</h1>
        <p className="text-sm text-muted-foreground mt-1">
          A good image helps your deal get more glows
        </p>
      </div>

      {/* Selected image preview */}
      {data.image_url && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border bg-muted">
          <Image
            src={data.image_url}
            alt="Selected"
            fill
            className="object-contain"
            unoptimized
          />
          <button
            onClick={() => updateFields({ image_url: "" })}
            className="absolute top-2 right-2 bg-background border rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-muted transition"
          >
            ✕
          </button>
          <div className="absolute bottom-2 left-2 bg-amber-500 text-amber-900 text-xs font-medium px-2 py-0.5 rounded-full">
            ✦ Selected
          </div>
        </div>
      )}

      {/* Scrape from URL */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label>Pick from deal page</Label>
          {data.url && (
            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
              {data.url}
            </p>
          )}
        </div>

        <Button
          variant="glow-outline"
          onClick={handleScrape}
          disabled={scraping || !data.url}
          className="w-full"
        >
          {scraping ? "Finding images..." : "✦ Fetch images from deal page"}
        </Button>

        {error && <p className="text-xs text-red-500">{error}</p>}

        {/* Scraped image grid */}
        {scraped.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {scraped.map((img, i) => (
              <button
                key={i}
                onClick={() => handleSelect(img)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                  data.image_url === img
                    ? "border-amber-500"
                    : "border-transparent hover:border-amber-200"
                }`}
              >
                <Image
                  src={img}
                  alt={`Option ${i + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {data.image_url === img && (
                  <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                    <span className="text-amber-900 text-xl">✦</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">or add manually</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Manual URL */}
      <div className="flex flex-col gap-1.5">
        <Label>Image URL</Label>
        <div className="flex gap-2">
          <Input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://..."
          />
          <Button variant="glow-outline" onClick={handleManualAdd}>
            Add
          </Button>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="matte" className="w-full" onClick={onBack}>
          ← Back
        </Button>
        <Button variant="glow" className="w-full" onClick={onNext}>
          Next →
        </Button>
      </div>
    </div>
  );
}
