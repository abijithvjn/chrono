"use client";
import Link from "next/link";
import { Command, Contrast, Monitor, Moon, Sun } from "lucide-react";
import { useStore, type Theme } from "@/store/useStore";
import { useMounted } from "@/lib/useMounted";

const NAV = [
  { href: "/convert", label: "Conversions" },
  { href: "/code", label: "Languages" },
  { href: "/timezone", label: "Time Zones" },
];

const THEMES: { id: Theme; icon: typeof Sun; title: string }[] = [
  { id: "system", icon: Monitor, title: "System" },
  { id: "light", icon: Sun, title: "Light" },
  { id: "dark", icon: Moon, title: "Dark" },
  { id: "amoled", icon: Contrast, title: "AMOLED" },
];

export function Header() {
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const setPalette = useStore((s) => s.setPalette);
  const mounted = useMounted();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-bg/70 backdrop-blur-xl">
      <div className="flex w-full items-center justify-between px-5 py-3.5 sm:px-8 lg:px-12">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-2 text-[15px] text-black shadow-glow">◷</span>
          <div className="leading-tight">
            <div className="text-[14px] font-semibold tracking-tight">Chrono</div>
            <div className="text-[11px] text-muted">the timestamp toolkit</div>
          </div>
        </div>
        <nav className="hidden items-center gap-1 text-[13px] md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-lg px-2.5 py-1.5 text-muted transition hover:bg-surface-2 hover:text-fg">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={() => setPalette(true)}
            className="hidden items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-[12px] text-muted transition hover:text-fg sm:flex">
            <Command size={13} /> Command <kbd className="rounded border border-border px-1 font-mono text-[10px]">⌘K</kbd>
          </button>
          <div className="flex rounded-lg border border-border bg-surface-2 p-0.5">
            {THEMES.map(({ id, icon: Icon, title }) => (
              <button key={id} onClick={() => setTheme(id)} title={title} aria-label={`${title} theme`}
                className={`grid h-7 w-7 place-items-center rounded-md transition ${mounted && theme === id ? "bg-accent/20 text-fg" : "text-muted hover:text-fg"}`}>
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
