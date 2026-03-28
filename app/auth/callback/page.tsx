"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function CallbackPage() {
  const router = useRouter();
  useEffect(() => {
    const supabase = createClient();
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const type = params.get("type");

    if (code && type === "signup") {
      supabase.auth
        .verifyOtp({ token_hash: code, type: "signup" })
        .then(({ error }) => {
          if (!error) {
            router.push("/profile/setup");
            router.refresh();
          } else {
            router.push("/auth/login");
          }
        });
    } else if (code && !type) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (!error) {
          router.push("/");
          router.refresh();
        } else {
          router.push("/auth/login");
        }
      });
    }
  }, [router]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center flex flex-col gap-4">
        <p className="text-4xl text-amber-500 animate-pulse">✦</p>
        <p className="text-sm text-muted-foreground">
          Confirming your account...
        </p>
      </div>
    </div>
  );
}
