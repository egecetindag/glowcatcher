"use client";

import { useState } from "react";

export default function VoucherCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="h-6.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-dashed border-primary text-xs font-mono font-medium text-primary hover:bg-primary/5 transition-colors"
    >
      <span className={`absolute ${copied ? "opacity-100" : "opacity-0"} text-[8.5px]`}>
        Copied!
      </span>
      <span className={copied ? "opacity-0" : "opacity-100"}>{code}</span>
      <i className={`fi ${copied ? "fi-sr-check" : "fi-rr-copy"} text-[10px] flex`} />
    </button>
  );
}
