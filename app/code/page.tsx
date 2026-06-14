import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { LANG_PAGES } from "@/content/languages";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Unix Timestamp Code Examples in 14 Languages",
  description: "How to get the current Unix timestamp and convert epoch time in JavaScript, Python, Go, Rust, Java, PHP, Ruby, C#, SQL, Bash and more.",
  alternates: { canonical: canonical("/code") },
};

export default function CodeHub() {
  return (
    <PageShell>
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Languages", href: "/code" }]} />
      <h1 className="text-[28px] font-semibold tracking-tight sm:text-[34px]">Unix timestamps in every language</h1>
      <p className="mt-3 max-w-2xl text-[15px] text-muted">
        Copy-ready snippets for getting the current epoch time and converting between timestamps and dates — with the gotchas that bite each language.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {LANG_PAGES.map((l) => (
          <Link key={l.slug} href={`/code/${l.slug}`}
            className="rounded-2xl border border-border bg-surface p-5 transition hover:border-accent/50">
            <h2 className="text-[15px] font-semibold">{l.lang}</h2>
            <p className="mt-1.5 line-clamp-2 text-[13px] text-muted">{l.intro}</p>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
