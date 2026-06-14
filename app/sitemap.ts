import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { CONVERSIONS } from "@/content/conversions";
import { LANG_PAGES } from "@/content/languages";
import { TZ_PAGES } from "@/content/timezones";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = [
    "/", "/convert", "/code", "/timezone",
    ...CONVERSIONS.map((c) => `/convert/${c.slug}`),
    ...LANG_PAGES.map((l) => `/code/${l.slug}`),
    ...TZ_PAGES.map((t) => `/timezone/${t.slug}`),
  ];
  return paths.map((p) => ({
    url: SITE_URL + (p.endsWith("/") ? p : p + "/"),
    lastModified: now,
    changeFrequency: p === "/" ? "daily" : "weekly",
    priority: p === "/" ? 1 : p.split("/").length === 2 ? 0.8 : 0.7,
  }));
}
