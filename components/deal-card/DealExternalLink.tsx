"use client";
type Props = {
  url: string;
};

export default function DealExternalLink({ url }: Props) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        window.open(url, "_blank");
      }}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
    >
      Get deal →
    </div>
  );
}
