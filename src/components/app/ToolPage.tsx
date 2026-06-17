import type { ReactNode } from "react";
import { toolBySlug } from "@/tools/registry";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Faqs } from "@/components/seo/Faqs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, canonical } from "@/lib/site";

// Server component: consistent header + SEO (breadcrumb, FAQ, SoftwareApplication
// schema) for every tool. The interactive tool is passed as children.
export function ToolPage({ slug, children }: { slug: string; children: ReactNode }) {
  const t = toolBySlug(slug);
  if (!t) return <>{children}</>;
  return (
    <>
      <Breadcrumbs items={[{ name: "Tools", href: "/" }, { name: t.name, href: `/${slug}` }]} />
      <header className="mb-6">
        <h1 className="text-[26px] font-semibold tracking-tight sm:text-[30px]">{t.name}</h1>
        <p className="mt-1.5 max-w-2xl text-[14.5px] text-muted">{t.short}</p>
      </header>

      {children}

      <Faqs items={t.faqs} />

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
    </>
  );
}
