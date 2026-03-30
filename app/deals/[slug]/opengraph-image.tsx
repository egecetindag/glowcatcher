import { ImageResponse } from "next/og";
import { getDeal } from "@/app/actions/deals/getDeal";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const deal = await getDeal(slug);
  if (!deal) return new Response("Not found", { status: 404 });

  const discount = deal.original_price
    ? Math.round(
        ((deal.original_price - deal.price) / deal.original_price) * 100,
      )
    : null;

  return new ImageResponse(
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        fontFamily: "sans-serif",
        backgroundColor: "#fdf8f5",
      }}
    >
      {/* Left: image */}
      {deal.image_url && (
        <div
          style={{
            width: 480,
            height: 630,
            flexShrink: 0,
            overflow: "hidden",
            display: "flex",
          }}
        >
          <img
            src={deal.image_url}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}

      {/* Right: content */}
      <div
        style={{
          flex: 1,
          padding: "56px 56px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Top: branding */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20, color: "#f59e0b" }}>✦</span>
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#78350f",
              letterSpacing: 2,
            }}
          >
            GLOWCATCHER
          </span>
        </div>

        {/* Middle: deal info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {deal.store && (
            <span
              style={{
                fontSize: 16,
                color: "#a16207",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {deal.store}
            </span>
          )}
          <span
            style={{
              fontSize: deal.title.length > 60 ? 28 : 34,
              fontWeight: 700,
              color: "#1c1917",
              lineHeight: 1.25,
            }}
          >
            {deal.title}
          </span>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span style={{ fontSize: 48, fontWeight: 700, color: "#d97706" }}>
              £{deal.price}
            </span>
            {deal.original_price && (
              <span
                style={{
                  fontSize: 24,
                  color: "#a8a29e",
                  textDecoration: "line-through",
                }}
              >
                £{deal.original_price}
              </span>
            )}
            {discount && (
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#fff",
                  backgroundColor: "#f59e0b",
                  padding: "4px 12px",
                  borderRadius: 999,
                }}
              >
                -{discount}%
              </span>
            )}
          </div>
        </div>

        {/* Bottom: CTA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 15, color: "#a8a29e" }}>
            glowcatcher.co.uk
          </span>
          <span
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#d97706",
              backgroundColor: "#fef3c7",
              padding: "10px 24px",
              borderRadius: 999,
            }}
          >
            Get the deal →
          </span>
        </div>
      </div>
    </div>,
    { ...size },
  );
}
