"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageUploadField from "@/components/ui/ImageUploadField";
import {
  createSection,
  updateSection,
  deleteSection,
} from "@/app/actions/sections/upsertSection";
import { Badge } from "@/components/ui/badge";

type Section = {
  id: string;
  title: string;
  subtitle?: string;
  image_url?: string;
  link?: string;
  is_active: boolean;
  order_index: number;
};

function SectionForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
}: {
  defaultValues?: Section;
  onSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    imageFile: File | null,
    imageUrl: string,
  ) => void;
  onCancel: () => void;
  isLoading?: boolean;
}) {
  const [imageUrl, setImageUrl] = useState(defaultValues?.image_url ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);

  return (
    <form
      onSubmit={(e) => onSubmit(e, imageFile, imageUrl)}
      className="bg-surface-container-lowest rounded-2xl p-6 flex flex-col gap-4  max-w-150"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">
          Title <span className="text-pink-500">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          defaultValue={defaultValues?.title}
          placeholder="Boots 20% off today!"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input
          id="subtitle"
          name="subtitle"
          defaultValue={defaultValues?.subtitle ?? ""}
          placeholder="Use code BOOTS20 at checkout"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Image</Label>
        <ImageUploadField
          value={imageUrl}
          onChange={(url, file) => {
            setImageUrl(url);
            setImageFile(file);
          }}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="link">Link</Label>
        <Input
          id="link"
          name="link"
          defaultValue={defaultValues?.link ?? ""}
          placeholder="https://boots.com/..."
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="order_index">Order</Label>
        <Input
          id="order_index"
          name="order_index"
          type="number"
          defaultValue={defaultValues?.order_index ?? 0}
        />
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="matte"
          className="w-full"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button variant="glow" className="w-full" isLoading={isLoading}>
          <i className="fi fi-rr-check text-sm leading-none" />
          {defaultValues ? "Save changes" : "Create section"}
        </Button>
      </div>
    </form>
  );
}

export default function SectionsClient({ sections }: { sections: Section[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Section | null>(null);
  const [loading, setLoading] = useState(false);
  const [localSections, setLocalSections] = useState(sections);

  async function handleCreate(
    e: React.FormEvent<HTMLFormElement>,
    imageFile: File | null,
    imageUrl: string,
  ) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    if (imageFile) formData.set("image_file", imageFile);
    else formData.set("image_url", imageUrl);
    await createSection(formData);
    setLoading(false);
    setShowForm(false);
    window.location.reload();
  }

  async function handleUpdate(
    e: React.FormEvent<HTMLFormElement>,
    imageFile: File | null,
    imageUrl: string,
  ) {
    e.preventDefault();
    if (!editing) return;
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    if (imageFile) formData.set("image_file", imageFile);
    else formData.set("image_url", imageUrl);
    await updateSection(editing.id, formData);
    setLoading(false);
    setEditing(null);
    window.location.reload();
  }

  async function handleDelete(id: string) {
    await deleteSection(id);
    setLocalSections((prev) => prev.filter((s) => s.id !== id));
  }

  async function handleToggle(section: Section) {
    const formData = new FormData();
    formData.append("title", section.title);
    formData.append("subtitle", section.subtitle ?? "");
    formData.append("image_url", section.image_url ?? "");
    formData.append("link", section.link ?? "");
    formData.append("order_index", String(section.order_index));
    formData.append("is_active", String(!section.is_active));
    await updateSection(section.id, formData);
    setLocalSections((prev) =>
      prev.map((s) =>
        s.id === section.id ? { ...s, is_active: !s.is_active } : s,
      ),
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-on-surface-variant">
          {localSections.length} sections
        </p>
        {!showForm && !editing && (
          <Button variant="glow" size="sm" onClick={() => setShowForm(true)}>
            <i className="fi fi-rr-plus text-sm leading-none" />
            New section
          </Button>
        )}
      </div>

      {showForm && (
        <SectionForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          isLoading={loading}
        />
      )}

      <div className="flex flex-col gap-3">
        {localSections.map((section) => (
          <div key={section.id}>
            {editing?.id === section.id ? (
              <SectionForm
                defaultValues={section}
                onSubmit={handleUpdate}
                onCancel={() => setEditing(null)}
                isLoading={loading}
              />
            ) : (
              <div className="bg-surface-container-lowest rounded-xl p-4 flex items-center gap-4">
                {section.image_url && (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-surface-container-low">
                    <Image
                      src={section.image_url}
                      alt={section.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm text-on-surface truncate">
                      {section.title}
                    </p>
                    <Badge variant={section.is_active ? "approved" : "matte"}>
                      {section.is_active ? "Active" : "Hidden"}
                    </Badge>
                  </div>
                  {section.subtitle && (
                    <p className="text-xs text-on-surface-variant truncate mt-0.5">
                      {section.subtitle}
                    </p>
                  )}
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Order: {section.order_index}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="matte"
                    size="sm"
                    onClick={() => handleToggle(section)}
                  >
                    <i
                      className={`fi ${section.is_active ? "fi-rr-eye-crossed" : "fi-rr-eye"} text-sm leading-none`}
                    />
                  </Button>
                  <Button
                    variant="matte"
                    size="sm"
                    onClick={() => setEditing(section)}
                  >
                    <i className="fi fi-rr-edit text-sm leading-none" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(section.id)}
                  >
                    <i className="fi fi-rr-trash text-sm leading-none" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {localSections.length === 0 && !showForm && (
          <div className="text-center py-12 text-on-surface-variant">
            <i className="fi fi-rr-layout-fluid text-4xl leading-none mb-3 block" />
            <p className="text-sm">No sections yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
