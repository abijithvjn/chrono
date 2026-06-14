import Link from "next/link";
import type { ReactNode } from "react";
import { SITE_NAME } from "@/lib/site";
import { CONVERSIONS } from "@/content/conversions";
import { LANG_PAGES } from "@/content/languages";
import { TZ_PAGES } from "@/content/timezones";

const NAV = [
  { href: "/", label: "Tool" },
  { href: "/convert", label: "Conversions" },
  { href: "/code", label: "Languages" },
  { href: "/timezone", label: "Time Zones" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-2 text-[15px] text-black">◷</span>
          <span className="text-[14px] font-semibold tracking-tight">{SITE_NAME}</span>
        </Link>
        <nav className="flex items-center gap-1 text-[13px]">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-lg px-2.5 py-1.5 text-muted transition hover:bg-surface-2 hover:text-fg">
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const cols: { title: string; links: { href: string; label: string }[] }[] = [
    { title: "Conversions", links: CONVERSIONS.slice(0, 6).map((c) => ({ href: `/convert/${c.slug}`, label: c.h1.replace("Convert ", "") })) },
    { title: "Languages", links: LANG_PAGES.slice(0, 7).map((l) => ({ href: `/code/${l.slug}`, label: l.lang })) },
    { title: "Time zones", links: TZ_PAGES.map((t) => ({ href: `/timezone/${t.slug}`, label: `${t.abbr} time` })) },
  ];
  return (
    <footer className="mt-16 border-t border-border/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="text-[14px] font-semibold">{SITE_NAME}</div>
          <p className="mt-2 text-[12.5px] text-muted">Fast, ad-free Unix timestamp & time-zone tools for developers. Everything runs in your browser.</p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-faint">{col.title}</div>
            <ul className="flex flex-col gap-1.5">
              {col.links.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-[12.5px] text-muted transition hover:text-accent">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto max-w-6xl px-5 pb-8 text-[11.5px] text-faint">
        © {new Date().getUTCFullYear()} {SITE_NAME}. All conversions run locally — no tracking, no ads.
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10"
        style={{ background: "radial-gradient(900px 480px at 85% -8%, var(--accent-glow), transparent 60%)" }} />
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
      <SiteFooter />
    </div>
  );
}
