"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
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
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
        setError("Could not scrape images from this URL. Try uploading one from your device.");
      } else if (json.images.length === 0) {
        setError("No images found on this page. Try uploading one from your device.");
      } else {
        setScraped(json.images);
      }
    } catch {
      setError("Something went wrong. Try uploading an image from your device.");
    } finally {
      setScraping(false);
    }
  }

  function handleSelect(img: string) {
    updateFields({ image_url: img, image_file: null });
  }

  function applyFile(file: File) {
    updateFields({ image_url: URL.createObjectURL(file), image_file: file });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) applyFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) applyFile(file);
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
            onClick={() => updateFields({ image_url: "", image_file: null })}
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
            <p className="text-xs text-muted-foreground truncate max-w-50">
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
        <span className="text-xs text-muted-foreground">or upload from device</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Drag & drop zone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`w-full rounded-xl border-2 border-dashed px-4 py-8 flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
          dragging
            ? "border-amber-400 bg-amber-50"
            : "border-border hover:border-amber-300 hover:bg-muted/40"
        }`}
      >
        <span className="text-2xl">📁</span>
        <span className="text-sm font-medium text-on-surface">
          Drag & drop an image here
        </span>
        <span className="text-xs text-muted-foreground">or click to browse</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex gap-3">
        <Button variant="matte" className="w-full" onClick={onBack}>
          Back
        </Button>
        <Button variant="glow" size="lg" className="w-full" onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
}
