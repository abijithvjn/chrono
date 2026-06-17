import { ImageResponse } from "next/og";
import { toolBySlug } from "@/tools/registry";
import { SITE_NAME } from "@/lib/site";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

// Branded 1200×630 OG image generated at build time for each tool.
export function ogImage(slug: string) {
  const t = toolBySlug(slug);
  const name = t?.name ?? SITE_NAME;
  const desc = t?.short ?? "Free, private developer tools.";
  const accent = t?.accent ?? "#3B82F6";
  const category = t?.category ?? "Developer Tools";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          justifyContent: "space-between", padding: 72, color: "#F8FAFC",
          background: "linear-gradient(135deg, #0B1020 0%, #111827 60%, #0B1020 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 52, height: 52, borderRadius: 15, background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }} />
          <div style={{ fontSize: 32, fontWeight: 700 }}>{SITE_NAME}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 16, height: 16, borderRadius: 99, background: accent }} />
            <div style={{ fontSize: 22, color: "#94A3B8", letterSpacing: 3, textTransform: "uppercase" }}>{category}</div>
          </div>
          <div style={{ fontSize: 82, fontWeight: 800, lineHeight: 1.04, maxWidth: 1000 }}>{name}</div>
          <div style={{ fontSize: 30, color: "#94A3B8", maxWidth: 940 }}>{desc}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 24, color: "#64748B" }}>
          <div style={{ width: 8, height: 8, borderRadius: 99, background: accent }} />
          devtoolskit.online
        </div>
      </div>
    ),
    ogSize
  );
}
