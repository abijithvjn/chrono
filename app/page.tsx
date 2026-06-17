import type { Metadata } from "next";
import { AppLayout } from "@/components/app/AppLayout";
import { Dashboard } from "@/components/app/Dashboard";
import { JsonLd } from "@/components/seo/JsonLd";
import { TOOLS } from "@/tools/registry";
import { SITE_NAME, SITE_DESC, canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Developer Toolkit — Free Online Dev Tools",
  description: SITE_DESC,
  alternates: { canonical: canonical("/") },
};

export default function Home() {
  return (
    <AppLayout>
      <Dashboard />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `${SITE_NAME} — tools`,
        itemListElement: TOOLS.map((t, i) => ({
          "@type": "ListItem", position: i + 1, name: t.name, url: canonical(`/${t.slug}`),
        })),
      }} />
    </AppLayout>
  );
}
