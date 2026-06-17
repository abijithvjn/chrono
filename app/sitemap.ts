import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { TOOLS } from "@/tools/registry";
import { CONVERSIONS } from "@/content/conversions";
import { LANG_PAGES } from "@/content/languages";
import { TZ_PAGES } from "@/content/timezones";

export const dynamic = "force-static";

type Freq = MetadataRoute.Sitemap[number]["changeFrequency"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entry = (p: string, priority: number, changeFrequency: Freq) => ({
    url: SITE_URL + (p === "/" ? "/" : p + "/"),
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    entry("/", 1.0, "daily"),
    // Tool pages — highest after the homepage. Auto-generated from the registry.
    ...TOOLS.map((t) => entry(`/${t.slug}`, 0.9, "weekly")),
    // SEO hubs + long-tail content.
    entry("/convert", 0.8, "weekly"),
    entry("/code", 0.8, "weekly"),
    entry("/timezone", 0.8, "weekly"),
    ...CONVERSIONS.map((c) => entry(`/convert/${c.slug}`, 0.7, "monthly")),
    ...LANG_PAGES.map((l) => entry(`/code/${l.slug}`, 0.7, "monthly")),
    ...TZ_PAGES.map((t) => entry(`/timezone/${t.slug}`, 0.7, "monthly")),
  ];
}
