import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Noto_Serif } from "next/font/google";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <Navbar />
        <main className="max-w-200 mx-auto px-4 py-8">
          {children}
          <Analytics />
        </main>
        <Separator />
        <footer className="max-w-200 mx-auto px-4 py-6 flex flex-col items-center gap-2">
          <div className="flex items-center gap-4 text-xs text-on-surface-variant">
            <Link
              href="/privacy-policy"
              className="hover:text-on-surface transition-colors"
            >
              Privacy Policy
            </Link>
            <span>·</span>
            <Link
              href="/cookie-policy"
              className="hover:text-on-surface transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
          <p className="text-xs text-on-surface-variant">
            © 2025 GlowCatcher · Beauty deals for the UK community
          </p>
        </footer>
      </body>
    </html>
  );
}
