import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Faqs } from "@/components/seo/Faqs";
import { JsonLd } from "@/components/seo/JsonLd";
import { MiniConverter } from "@/components/MiniConverter";
import { CONVERSIONS, conversionBySlug } from "@/content/conversions";
import { detect } from "@/lib/detect";
import { machineReprs } from "@/lib/format";
import { snippet } from "@/lib/snippets";
import { SITE_NAME, canonical } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return CONVERSIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = conversionBySlug(slug);
  if (!c) return {};
  const url = canonical(`/convert/${slug}`);
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: { canonical: url },
    openGraph: { title: c.metaTitle, description: c.metaDescription, url, type: "article" },
  };
}

function resolveExample(example: string): { ms: number; ns: bigint } {
  if (example === "now") return { ms: 1_700_000_000_000, ns: 1_700_000_000_000_000_000n };
  const d = detect(example);
  return d ? { ms: d.ms, ns: d.ns } : { ms: 1_700_000_000_000, ns: 1_700_000_000_000_000_000n };
}

export default async function ConvertPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = conversionBySlug(slug);
  if (!c) notFound();

  const { ms, ns } = resolveExample(c.example);
  const reprs = machineReprs(ms, ns);
  const TK: Record<string, string> = { utc: "UTC", s: "Unix seconds", ms: "Unix milliseconds", iso: "ISO 8601 (UTC)", rfc2822: "RFC 2822" };
  const target = reprs.find((r) => r.label === TK[c.targetKey]) ?? reprs[0];
  const secs = Math.floor(ms / 1000);
  const iso = new Date(ms).toISOString();
  const snippetLangs = ["JavaScript", "Python", "Go"] as const;
  const related = c.related.map(conversionBySlug).filter(Boolean) as typeof CONVERSIONS;

  return (
    <PageShell>
      <article className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Conversions", href: "/convert" }, { name: c.h1, href: `/convert/${slug}` }]} />

        <h1 className="text-[28px] font-semibold tracking-tight sm:text-[34px]">{c.h1}</h1>
        <div className="prose-chrono mt-4 space-y-4">
          {c.intro.map((p, i) => <p key={i} className="text-[15px] leading-relaxed text-muted">{p}</p>)}
        </div>

        {/* worked example — static, SEO-rich */}
        <section className="mt-8" aria-labelledby="ex-h">
          <h2 id="ex-h" className="mb-3 text-[19px] font-semibold tracking-tight">Worked example</h2>
          <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
            <p className="mb-3 text-[14px] text-muted">
              Input <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-accent">{c.example === "now" ? secs : c.example}</code>{" "}
              converts to <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-fg">{target.value}</code>:
            </p>
            <dl className="grid gap-1.5 sm:grid-cols-2">
              {reprs.map((r) => (
                <div key={r.label} className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-surface-2/50 px-3 py-2">
                  <dt className="text-[11px] uppercase tracking-wide text-muted">{r.label}</dt>
                  <dd className="truncate font-mono text-[13px]">{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* interactive */}
        <section className="mt-8" aria-label="Interactive converter">
          <MiniConverter example={c.example} />
        </section>

        {/* code snippets */}
        <section className="mt-10" aria-labelledby="code-h">
          <h2 id="code-h" className="mb-3 text-[19px] font-semibold tracking-tight">Code examples</h2>
          <div className="space-y-3">
            {snippetLangs.map((lang) => (
              <div key={lang}>
                <div className="mb-1 text-[12px] font-medium text-muted">{lang}</div>
                <pre className="overflow-x-auto rounded-xl border border-border/60 bg-surface-2 p-4 font-mono text-[12.5px] leading-relaxed whitespace-pre">{snippet(lang, secs, ms, iso)}</pre>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[13px] text-muted">See all 14 languages on the <Link href="/code" className="text-accent hover:underline">code examples</Link> pages.</p>
        </section>

        <Faqs items={c.faqs} />

        {related.length > 0 && (
          <section className="mt-12" aria-labelledby="rel-h">
            <h2 id="rel-h" className="mb-3 text-[19px] font-semibold tracking-tight">Related conversions</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {related.map((r) => (
                <Link key={r.slug} href={`/convert/${r.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 transition hover:border-accent/50">
                  <span className="text-[14px]">{r.h1}</span>
                  <ArrowRight size={15} className="text-faint transition group-hover:text-accent" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: c.h1,
        description: c.metaDescription,
        url: canonical(`/convert/${slug}`),
        publisher: { "@type": "Organization", name: SITE_NAME },
      }} />
    </PageShell>
  );
}
