"use client";
import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, Command, Share2, Star } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useMounted } from "@/lib/useMounted";
import { toolBySlug } from "@/tools/registry";
import { shareCurrentUrl } from "@/lib/share";
import { ThemeSwitch } from "./ThemeSwitch";

export function WorkspaceLayout({ slug, children }: { slug: string; children: ReactNode }) {
  const tool = toolBySlug(slug);
  const setPalette = useStore((s) => s.setPalette);
  const pushRecentTool = useStore((s) => s.pushRecentTool);
  const toggleFav = useStore((s) => s.toggleFav);
  const isFav = useStore((s) => s.favTools.includes(slug));
  const mounted = useMounted();

  useEffect(() => { pushRecentTool(slug); }, [slug, pushRecentTool]);

  const Icon = tool?.icon;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/60 bg-bg/80 px-4 py-2.5 backdrop-blur-xl sm:px-6">
        <Link href="/" className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[13px] text-muted transition hover:bg-surface-2 hover:text-fg">
          <ChevronLeft size={16} /> <span className="hidden sm:inline">Toolkit</span>
        </Link>
        <div className="flex min-w-0 items-center gap-2">
          {Icon && <Icon size={16} className="shrink-0 text-accent" />}
          <span className="truncate text-[14px] font-semibold tracking-tight">{tool?.name ?? "Tool"}</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setPalette(true)} aria-label="Open command palette (Cmd+K)"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-2.5 py-1.5 text-[12px] text-muted transition hover:text-fg">
            <Command size={13} /> <kbd className="hidden font-mono text-[10px] sm:inline">⌘K</kbd>
          </button>
          <button onClick={shareCurrentUrl} aria-label="Share link"
            className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-surface-2 text-muted transition hover:text-fg"><Share2 size={14} /></button>
          <button onClick={() => toggleFav(slug)} aria-label={isFav ? "Remove favorite" : "Add favorite"} aria-pressed={mounted && isFav}
            className={`grid h-8 w-8 place-items-center rounded-lg border border-border bg-surface-2 transition hover:text-fg ${mounted && isFav ? "text-warn" : "text-muted"}`}>
            <Star size={14} className={mounted && isFav ? "fill-warn" : ""} />
          </button>
          <ThemeSwitch />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-5 sm:px-6 sm:py-6">{children}</main>
    </div>
  );
}
