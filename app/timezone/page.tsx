import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { TZ_PAGES } from "@/content/timezones";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Time Zone Converters — UTC, IST, EST, PST, GMT & More",
  description: "Convert between UTC and major world time zones. Offsets, daylight-saving rules, and live converters for IST, ET, PT, GMT, CET, JST and more.",
  alternates: { canonical: canonical("/timezone") },
};

export default function TzHub() {
  return (
    <PageShell>
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Time Zones", href: "/timezone" }]} />
      <h1 className="text-[28px] font-semibold tracking-tight sm:text-[34px]">Time zone converters</h1>
      <p className="mt-3 max-w-2xl text-[15px] text-muted">
        Convert any moment between UTC and the world&apos;s busiest time zones, with daylight-saving handled for you.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TZ_PAGES.map((t) => (
          <Link key={t.slug} href={`/timezone/${t.slug}`}
            className="rounded-2xl border border-border bg-surface p-5 transition hover:border-accent/50">
            <h2 className="text-[15px] font-semibold">{t.abbr} — {t.name}</h2>
            <p className="mt-1.5 line-clamp-2 text-[13px] text-muted">{t.blurb}</p>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
