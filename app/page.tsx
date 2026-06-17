import type { Metadata } from "next";
import { DiscoverLayout } from "@/components/app/DiscoverLayout";
import { Dashboard } from "@/components/app/Dashboard";
import { JsonLd } from "@/components/seo/JsonLd";
import { TOOLS } from "@/tools/registry";
import { SITE_NAME, canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Developer Toolkit - Free Online Developer Tools | DevToolsKit" },
  description:
    "Free developer tools including Epoch Converter, JSON Formatter, Regex Tester, Base64 Encoder, Cron Parser, Diff Checker and more. Fast, private, browser-based utilities.",
  keywords: [
    "developer tools", "online developer tools", "free developer tools", "json formatter",
    "regex tester", "epoch converter", "base64 encoder", "cron parser", "diff checker",
  ],
  alternates: { canonical: canonical("/") },
};

const HOME_FAQ = [
  { q: "Are these developer tools free?", a: "Yes — every tool is free, with no sign-up and no ads. They run entirely in your browser." },
  { q: "Is my data private?", a: "All processing happens locally in your browser. Nothing you paste is uploaded to a server." },
  { q: "Can I use the tools offline?", a: "Yes. DevToolsKit is a PWA — once loaded it works offline and can be installed to your home screen or dock." },
];

export default function Home() {
  return (
    <DiscoverLayout>
      <Dashboard />
      <JsonLd data={[
        {
          "@context": "https://schema.org", "@type": "ItemList", name: `${SITE_NAME} — tools`,
          itemListElement: TOOLS.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, url: canonical(`/${t.slug}`) })),
        },
        {
          "@context": "https://schema.org", "@type": "FAQPage",
          mainEntity: HOME_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        },
      ]} />
    </DiscoverLayout>
  );
}
