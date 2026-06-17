import type { Metadata } from "next";
import { toolBySlug } from "@/tools/registry";
import { SITE_NAME, canonical } from "@/lib/site";

// One generator → every tool page gets consistent, unique, non-duplicate
// title / description / keywords / canonical / OG / Twitter / robots.
// Open Graph image is supplied automatically by the route's opengraph-image file.
export function toolMetadata(slug: string): Metadata {
  const t = toolBySlug(slug);
  if (!t) return {};
  const url = canonical(`/${slug}`);
  return {
    title: { absolute: t.metaTitle },
    description: t.metaDescription,
    keywords: t.keywords,
    alternates: { canonical: url },
    robots: {
      index: true, follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-video-preview": -1, "max-snippet": -1 },
    },
    openGraph: { type: "website", url, siteName: SITE_NAME, title: t.metaTitle, description: t.metaDescription },
    twitter: { card: "summary_large_image", title: t.metaTitle, description: t.metaDescription },
  };
}
