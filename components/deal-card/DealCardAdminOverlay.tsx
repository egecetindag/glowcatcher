"use client";

import { useRouter } from "next/navigation";

export default function DealCardAdminOverlay({ slug }: { slug: string }) {
  const router = useRouter();

  return (
    <div className="absolute right-0 top-0">
      <button
        className="transition-all opacity-0 group-hover:opacity-100 p-4 bg-taupe-400 cursor-pointer rounded-bl-xl"
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/deals/${slug}/edit`);
        }}
      >
        <i className="fi fi-rr-edit text-sm leading-none mr-1" />
        Edit
      </button>
    </div>
  );
}
