import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Noto_Serif } from "next/font/google";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Script from "next/script";
import { cookies } from "next/headers";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Providers from "@/lib/providers";
import CookieBanner from "@/components/CookieBanner";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "GlowCatcher — Beauty deals, every day",
  description: "The best beauty deals in the UK, caught fresh daily.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const consent = cookieStore.get("cookie_consent")?.value;

  return (
    <html lang="en" className={`${jakarta.variable} ${notoSerif.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/2.6.0/uicons-regular-rounded/css/uicons-regular-rounded.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/2.6.0/uicons-solid-rounded/css/uicons-solid-rounded.css"
        />
      </head>

      <body>
        <Providers>
          <Navbar />
          <main className="max-w-200 mx-auto px-4 py-8">
            {children}
            <Analytics />
          </main>
          <Separator />
          <footer className="max-w-200 mx-auto px-4 py-6 flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
              {[
                ["Boots", "boots"],
                ["lookfantastic", "lookfantastic"],
                ["TKMaxx", "tkmaxx"],
                ["Debenhams", "debenhams"],
                ["John Lewis", "john-lewis"],
                ["JustMyLook", "justmylook"],
              ].map(([label, slug]) => (
                <Link
                  key={slug}
                  href={`/sale/${slug}`}
                  className="text-xs text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  {label} Sale
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-4 text-xs text-on-surface-variant">
              <Link href="/privacy-policy" className="hover:text-on-surface transition-colors">
                Privacy Policy
              </Link>
              <span>·</span>
              <Link href="/cookie-policy" className="hover:text-on-surface transition-colors">
                Cookie Policy
              </Link>
            </div>
            <p className="text-xs text-on-surface-variant">
              © 2025 GlowCatcher · Beauty deals for the UK community
            </p>
          </footer>
        </Providers>
        {consent === "accepted" && process.env.NODE_ENV === "production" && (
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
        {!consent && <CookieBanner />}
      </body>
    </html>
  );
}
