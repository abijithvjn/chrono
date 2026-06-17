"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Command, Contrast, Menu, Monitor, Moon, Search, Sun, X } from "lucide-react";
import { TOOLS, CATEGORIES, searchTools } from "@/tools/registry";
import { useStore, type Theme } from "@/store/useStore";
import { useMounted } from "@/lib/useMounted";
import { SITE_NAME } from "@/lib/site";

const THEMES: { id: Theme; icon: typeof Sun; label: string }[] = [
  { id: "system", icon: Monitor, label: "System" },
  { id: "light", icon: Sun, label: "Light" },
  { id: "dark", icon: Moon, label: "Dark" },
  { id: "amoled", icon: Contrast, label: "AMOLED" },
];

function ThemeSwitch() {
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const mounted = useMounted();
  return (
    <div className="flex rounded-lg border border-border bg-surface-2 p-0.5" role="group" aria-label="Theme">
      {THEMES.map(({ id, icon: Icon, label }) => (
        <button key={id} onClick={() => setTheme(id)} title={label} aria-label={`${label} theme`} aria-pressed={mounted && theme === id}
          className={`grid h-7 w-7 place-items-center rounded-md transition ${mounted && theme === id ? "bg-accent/20 text-fg" : "text-muted hover:text-fg"}`}>
          <Icon size={14} />
        </button>
      ))}
    </div>
  );
}

function GlobalSearch({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const results = searchTools(q).slice(0, 8);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const go = (slug: string) => { setQ(""); setOpen(false); onNavigate?.(); router.push(`/${slug}`); };

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-3 py-2">
        <Search size={15} className="text-muted" />
        <input
          value={q} onChange={(e) => { setQ(e.target.value); setOpen(true); setI(0); }} onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setI((p) => Math.min(p + 1, results.length - 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setI((p) => Math.max(p - 1, 0)); }
            else if (e.key === "Enter" && results[i]) go(results[i].slug);
            else if (e.key === "Escape") setOpen(false);
          }}
          placeholder="Search all tools…" aria-label="Search tools"
          className="w-full bg-transparent text-[13.5px] outline-none placeholder:text-faint"
        />
      </div>
      {open && q && (
        <div className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-xl border border-border bg-surface-2 shadow-soft">
          {results.length === 0 ? (
            <div className="px-3 py-3 text-[13px] text-faint">No tools match “{q}”.</div>
          ) : results.map((t, idx) => (
            <button key={t.slug} onMouseEnter={() => setI(idx)} onClick={() => go(t.slug)}
              className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition ${idx === i ? "bg-accent/15" : ""}`}>
              <t.icon size={15} className="shrink-0 text-accent" />
              <span className="text-[13.5px] text-fg">{t.name}</span>
              <span className="ml-auto text-[11px] text-faint">{t.category}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex h-full flex-col gap-5 overflow-y-auto p-4" aria-label="Tools">
      <Link href="/" onClick={onNavigate} className="flex items-center gap-2.5 px-1">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-2 text-[15px] text-black">◷</span>
        <span className="text-[14px] font-semibold tracking-tight">{SITE_NAME}</span>
      </Link>
      {CATEGORIES.map((cat) => {
        const tools = TOOLS.filter((t) => t.category === cat);
        if (!tools.length) return null;
        return (
          <div key={cat}>
            <div className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-faint">{cat}</div>
            <ul className="flex flex-col gap-0.5">
              {tools.map((t) => {
                const active = pathname === `/${t.slug}`;
                return (
                  <li key={t.slug}>
                    <Link href={`/${t.slug}`} onClick={onNavigate} aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13.5px] transition ${active ? "bg-accent/15 text-fg" : "text-muted hover:bg-surface-2 hover:text-fg"}`}>
                      <t.icon size={15} className={active ? "text-accent" : "text-faint"} />
                      {t.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const setPalette = useStore((s) => s.setPalette);

  return (
    <div className="min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10"
        style={{ background: "radial-gradient(900px 480px at 85% -8%, var(--accent-glow), transparent 60%)" }} />

      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-border/60 bg-bg/70 backdrop-blur-xl lg:block">
        <Sidebar />
      </aside>

      {/* mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 border-r border-border bg-surface-2">
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="absolute right-3 top-3 text-muted hover:text-fg"><X size={18} /></button>
            <Sidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-bg/70 px-4 py-2.5 backdrop-blur-xl sm:px-6">
          <button onClick={() => setOpen(true)} aria-label="Open menu" className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted lg:hidden"><Menu size={16} /></button>
          <GlobalSearch />
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setPalette(true)} aria-label="Command palette"
              className="hidden items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-2.5 py-1.5 text-[12px] text-muted transition hover:text-fg sm:flex">
              <Command size={13} /> <kbd className="font-mono text-[10px]">⌘K</kbd>
            </button>
            <ThemeSwitch />
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-7 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
