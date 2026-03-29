"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAlert, deleteAlert } from "@/app/actions/alerts/createAlert";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = [
  "Skincare",
  "Makeup",
  "Haircare",
  "Fragrance",
  "Tools",
  "Health",
];

export default function AlertsClient({ alerts }: { alerts: any[] }) {
  const [loading, setLoading] = useState(false);
  const [localAlerts, setLocalAlerts] = useState(alerts);

  async function handleCreate(formData: FormData) {
    setLoading(true);
    await createAlert(formData);
    setLoading(false);
    window.location.reload();
  }

  async function handleDelete(id: string) {
    await deleteAlert(id);
    setLocalAlerts((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Create alert form */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 flex flex-col gap-4">
        <h2 className="font-medium text-on-surface">New alert</h2>

        <form action={handleCreate} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="keyword">
              Keyword <span className="text-pink-500">*</span>
            </Label>
            <Input
              id="keyword"
              name="keyword"
              placeholder="e.g. Charlotte Tilbury, retinol, Boots..."
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Category (optional)</Label>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value=""
                  defaultChecked
                  className="hidden"
                />
              </label>
              {CATEGORIES.map((cat) => (
                <label key={cat} className="cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    className="hidden peer"
                  />
                  <span className="peer-checked:bg-primary peer-checked:text-on-primary px-3 py-1 rounded-full text-xs bg-surface-container-low text-on-surface-variant transition">
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="max_price">Max price (optional)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                £
              </span>
              <Input
                id="max_price"
                name="max_price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="pl-7"
              />
            </div>
          </div>

          <Button variant="glow" isLoading={loading} type="submit">
            Create Alert
          </Button>
        </form>
      </div>

      {/* Existing alerts */}
      {localAlerts.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="font-medium text-on-surface">Your alerts</h2>
          {localAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-surface-container-lowest rounded-xl px-4 py-3 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <i className="fi fi-rr-bell text-sm text-primary leading-none" />
                <span className="text-sm font-medium text-on-surface">
                  {alert.keyword}
                </span>
                {alert.category && (
                  <Badge variant="matte">{alert.category}</Badge>
                )}
                {alert.max_price && (
                  <Badge variant="matte">under £{alert.max_price}</Badge>
                )}
              </div>
              <button
                onClick={() => handleDelete(alert.id)}
                className="text-on-surface-variant hover:text-destructive transition shrink-0"
              >
                <i className="fi fi-rr-trash text-sm leading-none" />
              </button>
            </div>
          ))}
        </div>
      )}

      {localAlerts.length === 0 && (
        <div className="text-center py-12 text-on-surface-variant">
          <i className="fi fi-rr-bell text-4xl leading-none mb-3 block" />
          <p className="text-sm">No alerts yet. Create one above!</p>
        </div>
      )}
    </div>
  );
}
