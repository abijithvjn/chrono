import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Faqs } from "@/components/seo/Faqs";
import { JsonLd } from "@/components/seo/JsonLd";
import { MiniConverter } from "@/components/MiniConverter";
import { TZ_PAGES, tzBySlug } from "@/content/timezones";
import { fmtZone, offsetMinutes } from "@/lib/format";
import { SITE_NAME, canonical } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return TZ_PAGES.map((t) => ({ slug: t.slug }));
}

function offStr(ms: number, zone: string) {
  const o = offsetMinutes(ms, zone);
  const s = o >= 0 ? "+" : "-";
  const p = (n: number) => String(Math.abs(n)).padStart(2, "0");
  return `UTC${s}${p((o / 60) | 0)}:${p(o % 60)}`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = tzBySlug(slug);
  if (!t) return {};
  const url = canonical(`/timezone/${slug}`);
  const title = `${t.abbr} Time — ${t.name} & UTC Converter`;
  const description = `Convert between ${t.abbr} (${t.name}) and UTC. Current offset, daylight-saving rules, and a live time-zone converter for ${t.city}.`;
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url, type: "article" } };
}

const SAMPLES = [0, 6, 12, 18].map((h) => Date.UTC(2023, 10, 14, h, 0, 0));

export default async function TzPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = tzBySlug(slug);
  if (!t) notFound();

  const off = offStr(SAMPLES[2], t.zone);
  const faqs = [
    { q: `What is the UTC offset of ${t.abbr}?`, a: `${t.name} (${t.abbr}) is ${off}${t.dst ? " in standard time and shifts by one hour during daylight saving" : " year-round and does not change for daylight saving"}.` },
    { q: `Does ${t.abbr} observe daylight saving time?`, a: t.dst ? `Yes. ${t.city} shifts its clocks for daylight saving, so the UTC offset changes between summer and winter.` : `No. ${t.city} keeps a fixed offset all year, which makes conversions to and from UTC straightforward.` },
    { q: `How do I convert UTC to ${t.abbr}?`, a: `Add the ${t.abbr} offset (${off}) to the UTC time. The converter on this page does it instantly, including the current daylight-saving state.` },
  ];

  return (
    <PageShell>
      <article className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Time Zones", href: "/timezone" }, { name: `${t.abbr} time`, href: `/timezone/${slug}` }]} />

        <h1 className="text-[28px] font-semibold tracking-tight sm:text-[34px]">{t.name} ({t.abbr})</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">{t.blurb} Major locations: {t.city}.</p>

        <section className="mt-8" aria-labelledby="tbl-h">
          <h2 id="tbl-h" className="mb-3 text-[19px] font-semibold tracking-tight">UTC → {t.abbr} examples</h2>
          <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
            <table className="w-full text-left text-[13px]">
              <thead><tr className="border-b border-border/60 text-[11px] uppercase tracking-wide text-muted">
                <th className="px-4 py-2.5">UTC</th><th className="px-4 py-2.5">{t.abbr}</th>
              </tr></thead>
              <tbody>
                {SAMPLES.map((ms) => (
                  <tr key={ms} className="border-b border-border/40 last:border-0">
                    <td className="px-4 py-2.5 font-mono">{fmtZone(ms, "UTC")}</td>
                    <td className="px-4 py-2.5 font-mono text-accent">{fmtZone(ms, t.zone)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8" aria-label="Converter">
          <MiniConverter example="now" />
        </section>

        <Faqs items={faqs} />

        <section className="mt-12" aria-labelledby="z-h">
          <h2 id="z-h" className="mb-3 text-[19px] font-semibold tracking-tight">Other time zones</h2>
          <div className="flex flex-wrap gap-2">
            {TZ_PAGES.filter((x) => x.slug !== t.slug).map((o) => (
              <Link key={o.slug} href={`/timezone/${o.slug}`}
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-[13px] text-muted transition hover:border-accent/50 hover:text-fg">
                {o.abbr}
              </Link>
            ))}
          </div>
        </section>
      </article>

      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: `${t.name} (${t.abbr}) & UTC Converter`,
        url: canonical(`/timezone/${slug}`),
        publisher: { "@type": "Organization", name: SITE_NAME },
      }} />
    </PageShell>
  );
}
