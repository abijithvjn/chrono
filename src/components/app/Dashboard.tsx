"use client";
import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { CATEGORIES, searchTools } from "@/tools/registry";

export function Dashboard() {
  const [q, setQ] = useState("");
  const matched = searchTools(q);
  const cats = CATEGORIES.filter((c) => matched.some((t) => t.category === c));

  return (
    <div>
      <header className="mb-7">
        <h1 className="text-[30px] font-semibold tracking-tight sm:text-[36px]">Developer Toolkit</h1>
        <p className="mt-2 max-w-2xl text-[15px] text-muted">
          A fast, private collection of everyday developer tools. No ads, no sign-up — everything runs in your browser.
        </p>
      </header>

      <div className="mb-8 flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3 shadow-soft focus-within:border-accent/60 focus-within:shadow-glow">
        <Search size={17} className="text-muted" />
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search all tools…  (try “json”, “epoch”, “regex”)"
          aria-label="Search all tools" className="w-full bg-transparent text-[15px] outline-none placeholder:text-faint" />
      </div>

      {cats.length === 0 && <p className="text-[14px] text-faint">No tools match “{q}”.</p>}

      <div className="space-y-9">
        {cats.map((cat) => (
          <section key={cat} aria-labelledby={`c-${cat}`}>
            <h2 id={`c-${cat}`} className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-faint">{cat}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {matched.filter((t) => t.category === cat).map((t) => (
                <Link key={t.slug} href={`/${t.slug}`}
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
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
