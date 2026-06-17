import { Check } from "lucide-react";
import { toolBySlug } from "@/tools/registry";
import { contentBySlug } from "@/tools/seoContent";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Faqs } from "@/components/seo/Faqs";
import { JsonLd } from "@/components/seo/JsonLd";
import { RelatedTools } from "./RelatedTools";
import { SITE_NAME, SITE_URL, canonical } from "@/lib/site";

// Server-rendered, indexable content shown beneath the workspace. Keeps the
// immersive tool on top while crawlers get an H1, intro, benefits, how-to,
// FAQ, developer notes, related links, breadcrumbs and full structured data.
export function ToolSeo({ slug }: { slug: string }) {
  const t = toolBySlug(slug);
  const c = contentBySlug(slug);
  if (!t) return null;
  const url = canonical(`/${slug}`);

  return (
    <section className="mt-14 border-t border-border/60 pt-10">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Developer Tools", href: "/" }, { name: t.name, href: `/${slug}` }]} />

      <article className="max-w-3xl">
        <h1 className="text-[24px] font-semibold tracking-tight sm:text-[28px]">{t.name}</h1>
        {c && <p className="mt-3 text-[15px] leading-relaxed text-muted">{c.intro}</p>}

        {c && (
          <>
            <h2 className="mt-9 text-[18px] font-semibold tracking-tight">Why use {t.name}</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {c.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 text-[14px] text-muted">
                  <Check size={15} className="mt-0.5 shrink-0 text-good" /> {b}
                </li>
              ))}
            </ul>

            <h2 className="mt-9 text-[18px] font-semibold tracking-tight">How to use {t.name}</h2>
            <ol className="mt-3 space-y-2.5">
              {c.howto.map((s, i) => (
                <li key={s.name} className="flex gap-3 text-[14px]">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border bg-surface-2 text-[12px] font-semibold text-accent">{i + 1}</span>
                  <span className="text-muted"><b className="text-fg">{s.name}.</b> {s.text}</span>
                </li>
              ))}
            </ol>
          </>
        )}
      </article>

      <Faqs items={t.faqs} />

      {c && (
        <section className="mt-10 max-w-3xl" aria-labelledby="notes-h">
          <h2 id="notes-h" className="mb-2 text-[18px] font-semibold tracking-tight">Developer notes</h2>
          <p className="text-[14px] leading-relaxed text-muted">{c.notes}</p>
        </section>
      )}

      <RelatedTools current={slug} />

      <JsonLd data={[
        {
          "@context": "https://schema.org", "@type": "SoftwareApplication",
          name: `${t.name} — ${SITE_NAME}`, applicationCategory: "DeveloperApplication",
          operatingSystem: "Any", url, description: t.metaDescription,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
        {
          "@context": "https://schema.org", "@type": "WebPage", name: t.metaTitle,
          url, description: t.metaDescription, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
        },
        ...(c ? [{
          "@context": "https://schema.org", "@type": "HowTo",
          name: `How to use ${t.name}`, description: t.metaDescription,
          step: c.howto.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
        }] : []),
      ]} />
    </section>
  );
}
