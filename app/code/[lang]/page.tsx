import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Lightbulb } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Faqs } from "@/components/seo/Faqs";
import { JsonLd } from "@/components/seo/JsonLd";
import { MiniConverter } from "@/components/MiniConverter";
import { LANG_PAGES, langBySlug } from "@/content/languages";
import { snippet } from "@/lib/snippets";
import { SITE_NAME, canonical } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return LANG_PAGES.map((l) => ({ lang: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l = langBySlug(lang);
  if (!l) return {};
  const url = canonical(`/code/${lang}`);
  return {
    title: l.metaTitle,
    description: l.metaDescription,
    alternates: { canonical: url },
    openGraph: { title: l.metaTitle, description: l.metaDescription, url, type: "article" },
  };
}

const EX_S = 1_700_000_000;
const EX_MS = 1_700_000_000_000;
const EX_ISO = new Date(EX_MS).toISOString();

export default async function CodePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = langBySlug(lang);
  if (!l) notFound();

  const code = snippet(l.lang, EX_S, EX_MS, EX_ISO);
  const others = LANG_PAGES.filter((x) => x.slug !== l.slug);

  return (
    <PageShell>
      <article className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Languages", href: "/code" }, { name: l.lang, href: `/code/${l.slug}` }]} />

        <h1 className="text-[28px] font-semibold tracking-tight sm:text-[34px]">Unix Timestamp in {l.lang}</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">{l.intro}</p>

        <section className="mt-8" aria-labelledby="snip-h">
          <h2 id="snip-h" className="mb-3 text-[19px] font-semibold tracking-tight">Get &amp; convert epoch time in {l.lang}</h2>
          <pre className="overflow-x-auto rounded-xl border border-border/60 bg-surface-2 p-4 font-mono text-[12.5px] leading-relaxed whitespace-pre">{code}</pre>
        </section>

        <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-warn/30 bg-warn/5 p-4 text-[13.5px] text-fg">
          <Lightbulb size={16} className="mt-0.5 shrink-0 text-warn" />
          <span><b>Gotcha:</b> {l.pitfall}</span>
        </div>

        <section className="mt-8" aria-label="Interactive converter">
          <MiniConverter example={String(EX_S)} />
        </section>

        <Faqs items={l.faqs} />

        <section className="mt-12" aria-labelledby="other-h">
          <h2 id="other-h" className="mb-3 text-[19px] font-semibold tracking-tight">Other languages</h2>
          <div className="flex flex-wrap gap-2">
            {others.map((o) => (
              <Link key={o.slug} href={`/code/${o.slug}`}
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-[13px] text-muted transition hover:border-accent/50 hover:text-fg">
                {o.lang}
              </Link>
            ))}
          </div>
        </section>
      </article>

      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: `Unix Timestamp in ${l.lang}`,
        description: l.metaDescription,
        url: canonical(`/code/${l.slug}`),
        programmingLanguage: l.lang,
        publisher: { "@type": "Organization", name: SITE_NAME },
      }} />
    </PageShell>
  );
}
