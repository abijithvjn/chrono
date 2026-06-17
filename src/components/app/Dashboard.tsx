"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { CATEGORIES, TOOLS, searchTools, toolBySlug, type Tool } from "@/tools/registry";

const POPULAR = ["epoch-converter", "json-formatter", "base64", "regex-tester"];
const RECENT = ["json-formatter", "regex-tester", "diff-checker", "cron-parser"];

const HOME_FAQ = [
  { q: "Are these developer tools free?", a: "Yes — every tool is free, with no sign-up and no ads. They run entirely in your browser." },
  { q: "Is my data private?", a: "All processing happens locally in your browser. Nothing you paste is uploaded to a server." },
  { q: "Can I use the tools offline?", a: "Yes. DevToolsKit is a PWA — once loaded it works offline and can be installed to your home screen or dock." },
];

function ToolCard({ t }: { t: Tool }) {
  return (
    <Link href={`/${t.slug}`}
      className="group rounded-2xl border border-border bg-surface p-5 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-accent/50">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-surface-2 text-accent transition group-hover:border-accent/40">
          <t.icon size={18} />
        </span>
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold">{t.name}</h3>
          <p className="mt-1 text-[13px] leading-snug text-muted">{t.short}</p>
        </div>
      </div>
    </Link>
  );
}

export function Dashboard() {
  const [q, setQ] = useState("");
  const searching = q.trim().length > 0;
  const matched = searchTools(q);
  const cats = CATEGORIES.filter((c) => matched.some((t) => t.category === c));
  const popular = POPULAR.map(toolBySlug).filter(Boolean) as Tool[];
  const recent = RECENT.map(toolBySlug).filter(Boolean) as Tool[];

  return (
    <div>
      <header className="mb-7">
        <h1 className="text-[30px] font-semibold tracking-tight sm:text-[38px]">Developer Toolkit</h1>
        <p className="mt-2 max-w-2xl text-[15px] text-muted">
          A fast, private collection of everyday developer tools — timestamps, JSON, regex, Base64, diffs and cron — all free, ad-free, and running entirely in your browser.
        </p>
      </header>

      <div className="mb-9 flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3 shadow-soft focus-within:border-accent/60 focus-within:shadow-glow">
        <Search size={17} className="text-muted" />
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search all tools…  (try “json”, “epoch”, “regex”)  —  or press ⌘K anywhere"
          aria-label="Search all tools" className="w-full bg-transparent text-[15px] outline-none placeholder:text-faint" />
      </div>

      {searching ? (
        <div className="space-y-9">
          {cats.length === 0 && <p className="text-[14px] text-faint">No tools match “{q}”.</p>}
          {cats.map((cat) => (
            <section key={cat} aria-labelledby={`c-${cat}`}>
              <h2 id={`c-${cat}`} className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-faint">{cat}</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {matched.filter((t) => t.category === cat).map((t) => <ToolCard key={t.slug} t={t} />)}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          <section aria-labelledby="popular-h">
            <h2 id="popular-h" className="mb-3 flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-faint"><Sparkles size={13} /> Popular</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{popular.map((t) => <ToolCard key={t.slug} t={t} />)}</div>
          </section>

          <section aria-labelledby="recent-h">
            <h2 id="recent-h" className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-faint">Recently added</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{recent.map((t) => <ToolCard key={t.slug} t={t} />)}</div>
          </section>

          {CATEGORIES.map((cat) => (
            <section key={cat} aria-labelledby={`c-${cat}`}>
              <h2 id={`c-${cat}`} className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-faint">{cat}</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {TOOLS.filter((t) => t.category === cat).map((t) => <ToolCard key={t.slug} t={t} />)}
              </div>
            </section>
          ))}

          <section aria-labelledby="faq-h" className="border-t border-border/60 pt-8">
            <h2 id="faq-h" className="mb-4 text-[19px] font-semibold tracking-tight">Frequently asked questions</h2>
            <dl className="divide-y divide-border/60 rounded-2xl border border-border bg-surface">
              {HOME_FAQ.map((f) => (
                <div key={f.q} className="p-4 sm:p-5">
                  <dt className="text-[14.5px] font-semibold">{f.q}</dt>
                  <dd className="mt-1.5 text-[14px] leading-relaxed text-muted">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <p className="text-[13px] leading-relaxed text-faint">
            DevToolsKit brings the utilities developers reach for every day into one fast, keyboard-first workspace. Convert Unix timestamps and time zones, format and validate JSON, test regular expressions, encode and decode Base64, compare text, and explain cron expressions — without installs, accounts, or ads. Press ⌘K anywhere to jump between tools.
          </p>
        </div>
      )}
    </div>
  );
}
