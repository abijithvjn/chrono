import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { CONVERSIONS } from "@/content/conversions";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Timestamp Conversions — Unix, ISO 8601, RFC & More",
  description: "Every Unix timestamp and date conversion in one place: seconds, milliseconds, nanoseconds, ISO 8601, RFC 2822, and back. Free, instant, ad-free.",
  alternates: { canonical: canonical("/convert") },
};

export default function ConvertHub() {
  return (
    <PageShell>
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Conversions", href: "/convert" }]} />
      <h1 className="text-[28px] font-semibold tracking-tight sm:text-[34px]">Timestamp &amp; date conversions</h1>
      <p className="mt-3 max-w-2xl text-[15px] text-muted">
        Pick a conversion to get a focused tool, a worked example, code in 14 languages, and answers to common questions.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {CONVERSIONS.map((c) => (
          <Link key={c.slug} href={`/convert/${c.slug}`}
            className="group rounded-2xl border border-border bg-surface p-5 transition hover:border-accent/50">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-[15px] font-semibold">{c.h1.replace("Convert ", "")}</h2>
              <ArrowRight size={16} className="shrink-0 text-faint transition group-hover:text-accent" />
            </div>
            <p className="mt-1.5 line-clamp-2 text-[13px] text-muted">{c.metaDescription}</p>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
