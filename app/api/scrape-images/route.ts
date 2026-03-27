import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(request: NextRequest) {
  const { url } = await request.json();

  if (!url)
    return NextResponse.json({ error: "URL required" }, { status: 400 });

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; GlowCatcher/1.0)",
      },
    });

    const html = await res.text();
    const $ = cheerio.load(html);

    const images = new Set<string>();

    // og:image meta tag
    const ogImage = $('meta[property="og:image"]').attr("content");
    if (ogImage) images.add(ogImage);

    // product images — src ve data-src
    $("img").each((_, el) => {
      const src =
        $(el).attr("src") ||
        $(el).attr("data-src") ||
        $(el).attr("data-lazy-src");
      if (!src) return;

      // küçük ikonları, tracking pixellerini atla
      const w = Number($(el).attr("width") || 0);
      const h = Number($(el).attr("height") || 0);
      if (w && w < 100) return;
      if (h && h < 100) return;
      if (
        src.includes("logo") ||
        src.includes("icon") ||
        src.includes("sprite")
      )
        return;

      // relative URL'leri absolute yap
      try {
        const absolute = new URL(src, url).href;
        if (absolute.match(/\.(jpg|jpeg|png|webp|avif)/i)) {
          images.add(absolute);
        }
      } catch {}
    });

    return NextResponse.json({ images: Array.from(images).slice(0, 12) });
  } catch (err) {
    return NextResponse.json({ error: "Failed to scrape" }, { status: 500 });
  }
}
