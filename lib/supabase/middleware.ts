import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const PROTECTED_ROUTES = ["/submit", "/profile"];
const EDITOR_ROUTES = ["/editor"];
const AUTH_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/verify",
  "/auth/callback",
];

export const updateSession = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  // Giriş yapmış kullanıcı auth sayfalarına gitmesin
  if (user && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Giriş yapmamış kullanıcı korumalı sayfalara gitmesin
  if (!user && PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Editor koruması
  if (EDITOR_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Profile setup yönlendirmesi
  if (user && pathname !== "/profile/setup") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("profile_completed")
      .eq("id", user.id)
      .single();

    if (!profile?.profile_completed) {
      return NextResponse.redirect(new URL("/profile/setup", request.url));
    }
  }

  return supabaseResponse;
};
