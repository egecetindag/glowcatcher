"use client";

import { setupProfile } from "@/app/actions/auth/setupProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      variant="glow"
      size="lg"
      className="w-full uppercase tracking-widest mt-1"
      type="submit"
      disabled={pending}
    >
      {pending ? "Saving..." : "Let's glow"}
    </Button>
  );
}

export default function ProfileSetupPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  }

  return (
    <>
      <div className="bg-[url('/water_bg.jpg')] bg-cover bg-center fixed w-full bottom-0 inset-0 opacity-50 -z-10"></div>
      <div className="mb-12 flex items-center justify-center py-12 px-10 md:mx-10 z-10 bg-white shadow-sm rounded-lg">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="mb-8 text-center">
            <p className="text-4xl text-amber-500 mb-4">✦</p>
            <h1 className="font-serif text-4xl font-bold text-on-surface mb-2">
              Set up your profile
            </h1>
            <p className="text-on-surface-variant text-sm">
              Tell the community a bit about yourself
            </p>
          </div>

          <form action={setupProfile} className="flex flex-col gap-5">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="w-20 h-20 rounded-full overflow-hidden bg-pink-100 border-2 border-dashed border-pink-300 flex items-center justify-center text-pink-400 text-2xl hover:opacity-80 transition-opacity"
              >
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt="avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "✦"
                )}
              </button>
              <input
                ref={inputRef}
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-xs text-primary hover:underline"
              >
                {preview ? "Change photo" : "Upload photo"}
              </button>
            </div>

            {/* Username */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="username"
                className="text-xs font-semibold uppercase tracking-widest text-on-surface"
              >
                Username <span className="text-destructive">*</span>
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="glowgirl"
                required
              />
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="bio"
                className="text-xs font-semibold uppercase tracking-widest text-on-surface"
              >
                Bio
              </label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Beauty lover, bargain hunter..."
                rows={3}
                className="resize-none"
              />
            </div>

            <SubmitButton />
          </form>
        </div>
      </div>
    </>
  );
}
