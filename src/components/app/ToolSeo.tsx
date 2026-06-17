import { toolBySlug } from "@/tools/registry";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Faqs } from "@/components/seo/Faqs";
import { JsonLd } from "@/components/seo/JsonLd";
import { RelatedTools } from "./RelatedTools";
import { SITE_NAME, canonical } from "@/lib/site";

// Server-rendered SEO block shown beneath the workspace: keeps the immersive
// tool on top while crawlers still get an H1, description, FAQ, breadcrumb,
// related-tool links and SoftwareApplication schema.
export function ToolSeo({ slug }: { slug: string }) {
  const t = toolBySlug(slug);
  if (!t) return null;
  return (
    <section className="mt-12 border-t border-border/60 pt-8">
      <Breadcrumbs items={[{ name: "Tools", href: "/" }, { name: t.name, href: `/${slug}` }]} />
      <h1 className="text-[22px] font-semibold tracking-tight">{t.name}</h1>
      <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-muted">{t.metaDescription}</p>

      <Faqs items={t.faqs} />
      <RelatedTools current={slug} />

      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: `${t.name} — ${SITE_NAME}`,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        url: canonical(`/${slug}`),
        description: t.metaDescription,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      }} />
    </section>
  );
}
