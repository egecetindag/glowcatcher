"use client";

import { useState } from "react";
import StepEssentials from "@/components/submit/StepEssentials";
import StepImage from "@/components/submit/StepImage";
import StepDetails from "@/components/submit/StepDetails";
import { Progress } from "@/components/ui/progress";

export type DealFormData = {
  title: string;
  price: string;
  original_price: string;
  store: string;
  url: string;
  voucher_code: string;
  image_url: string;
  image_file: File | null;
  description: string;
  category: string;
  expires_at: string;
};

const INITIAL_DATA: DealFormData = {
  title: "",
  price: "",
  original_price: "",
  store: "",
  url: "",
  voucher_code: "",
  image_url: "",
  image_file: null,
  description: "",
  category: "",
  expires_at: "",
};

const STEPS = ["Essentials", "Image", "Details"];

export default function SubmitPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<DealFormData>(INITIAL_DATA);

  function updateFields(fields: Partial<DealFormData>) {
    setFormData((prev) => ({ ...prev, ...fields }));
  }

  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <span
                className={`text-xs font-medium ${i === step ? "text-amber-500" : i < step ? "text-muted-foreground line-through" : "text-muted-foreground"}`}
              >
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <span className="text-muted-foreground text-xs">→</span>
              )}
            </div>
          ))}
        </div>
        <Progress value={((step + 1) / STEPS.length) * 100} className="h-1" />
      </div>

      {step === 0 && (
        <StepEssentials
          data={formData}
          updateFields={updateFields}
          onNext={next}
        />
      )}
      {step === 1 && (
        <StepImage
          data={formData}
          updateFields={updateFields}
          onNext={next}
          onBack={back}
        />
      )}
      {step === 2 && (
        <StepDetails
          data={formData}
          updateFields={updateFields}
          onBack={back}
        />
      )}
    </div>
  );
}
