"use client";

import { useState } from "react";
import { addComment } from "@/app/actions/comments";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  dealId: string;
  parentId?: string;
  onCancel?: () => void;
  placeholder?: string;
};

export default function CommentForm({
  dealId,
  parentId,
  onCancel,
  placeholder = "Share your thoughts...",
}: Props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!content.trim()) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("deal_id", dealId);
    formData.append("content", content.trim());
    if (parentId) formData.append("parent_id", parentId);

    await addComment(formData);
    setContent("");
    setLoading(false);
    onCancel?.();
  }

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="resize-none bg-surface-container-low border-0 focus-visible:ring-1"
      />
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          variant="glow"
          size="sm"
          onClick={handleSubmit}
          disabled={loading || !content.trim()}
        >
          {loading ? "Posting..." : parentId ? "Reply" : "Comment"}
        </Button>
      </div>
    </div>
  );
}
