"use client";

import { useRef, useState } from "react";
import Image from "next/image";

type Props = {
  value?: string;
  onChange: (url: string, file: File | null) => void;
};

export default function ImageUploadField({ value, onChange }: Props) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function applyFile(file: File) {
    onChange(URL.createObjectURL(file), file);
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
    <div className="flex flex-col gap-2">
      {value ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border bg-surface-container-low">
          <Image src={value} alt="Preview" fill className="object-contain" unoptimized />
          <button
            type="button"
            onClick={() => onChange("", null)}
            className="absolute top-2 right-2 bg-surface-container border border-outline-variant/30 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-surface-container-high transition"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`w-full rounded-xl border-2 border-dashed px-4 py-8 flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
            dragging
              ? "border-primary bg-primary/5"
              : "border-outline-variant hover:border-primary/50 hover:bg-surface-container-low"
          }`}
        >
          <span className="text-2xl">📁</span>
          <span className="text-sm font-medium text-on-surface">Drag & drop an image</span>
          <span className="text-xs text-on-surface-variant">or click to browse</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
