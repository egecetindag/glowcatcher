import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={inter.className}>
        <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-semibold text-amber-500">
                ✦ GlowCatcher
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <a
                href="/submit"
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Submit deal
              </a>
              <a
                href="/auth/login"
                className="text-sm bg-amber-500 text-white px-4 py-1.5 rounded-full hover:bg-amber-600 transition"
              >
                Sign in
              </a>
            </div>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
