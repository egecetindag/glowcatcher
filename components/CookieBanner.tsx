"use client";

import Link from "next/link";
import { Button } from "./ui/button";

export default function CookieBanner() {
  function accept() {
    document.cookie =
      "cookie_consent=accepted; path=/; max-age=31536000; SameSite=Lax";
    window.location.reload();
  }

  return (
    <div className="fixed left-0 bottom-0 z-50 p-4 w-full md:h-1/3 h-1/4 bg-white border border-outline-variant/15 shadow-lg flex items-center justify-center">
      <div className="max-w-200 mx-auto rounded-xl px-4 py-3 flex items-center md:gap-16 gap-4 flex-wrap">
        <p className="md:text-[0.85rem] text-xs flex-1 min-w-48">
          We use Google Analytics to measure traffic and improve your
          experience. No personal data is sold to third parties. By clicking
          &quot;Accept&quot; you agree to our{" "}
          <Link
            href="/cookie-policy"
            className="underline hover:text-on-surface transition-colors"
          >
            Cookie Policy
          </Link>
        </p>
        <div className="flex flex-col gap-2 shrink-0">
          <Button variant="default" size="lg" onClick={accept}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
