"use client";

import { useSyncExternalStore } from "react";
import Script from "next/script";
import Link from "next/link";
import { Button } from "./ui/button";

function getConsent() {
  return localStorage.getItem("cookie_consent") as
    | "accepted"
    | "declined"
    | null;
}

function subscribe() {
  return () => {};
}

export default function CookieBanner() {
  const consent = useSyncExternalStore(subscribe, getConsent, () => null);

  function accept() {
    localStorage.setItem("cookie_consent", "accepted");
    window.location.reload();
  }

  function decline() {
    localStorage.setItem("cookie_consent", "declined");
    window.location.reload();
  }

  return (
    <>
      {consent === "accepted" && (
        <>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-PBDWTCN6H2"
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PBDWTCN6H2');
          `}</Script>
        </>
      )}

      {consent === null && (
        <div className="fixed left-0 bottom-0 z-50 p-4 w-full h-1/3 bg-white border border-outline-variant/15 shadow-lg flex items-center justify-center">
          <div className="max-w-200 mx-auto  rounded-xl px-4 py-3  flex items-center gap-16 flex-wrap">
            <p className="text-[0.85rem] flex-1 min-w-48">
              GlowCatcher uses cookies to understand how visitors use our site.
              We use Google Analytics to measure traffic and improve your
              experience. No personal data is sold to third parties. By clicking
              &quot;Accept&quot; you agree to our cookie policy.GlowCatcher uses
              cookies to understand how visitors use our site. We use Google
              Analytics to measure traffic and improve your experience. No
              personal data is sold to third parties. By clicking
              &quot;Accept&quot; you agree to our{" "}
              <Link
                href="/cookie-policy"
                className="underline hover:text-on-surface transition-colors"
              >
                Cookie Policy
              </Link>
            </p>
            <div className="flex flex-col gap-2 shrink-0">
              <Button variant="glow-outline" size="lg" onClick={decline}>
                Decline
              </Button>
              <Button variant="default" size="lg" onClick={accept}>
                Accept
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
