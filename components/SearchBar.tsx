"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative w-full mx-4">
      <form onSubmit={handleSearch}>
        <div className="flex items-center gap-2 bg-surface-container-low rounded-full px-4 py-2">
          <i className="fi fi-rr-search text-sm text-on-surface-variant leading-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(e.target.value.length > 1);
            }}
            placeholder="Search deals..."
            className="bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant outline-none flex-1"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setOpen(false);
              }}
              className="text-on-surface-variant hover:text-on-surface transition"
            >
              <i className="fi fi-rr-cross text-xs leading-none" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
