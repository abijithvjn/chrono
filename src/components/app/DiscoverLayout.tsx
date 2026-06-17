"use client";
import { type ReactNode } from "react";
import Link from "next/link";
import { Command } from "lucide-react";
import { useStore } from "@/store/useStore";
import { SITE_NAME } from "@/lib/site";
import { SiteFooter } from "@/components/PageShell";
import { ThemeSwitch } from "./ThemeSwitch";
import { Ambient } from "./Ambient";

export function DiscoverLayout({ children }: { children: ReactNode }) {
  const setPalette = useStore((s) => s.setPalette);
  return (
    <div className="min-h-screen">
      <Ambient />
      <header className="sticky top-0 z-30 border-b border-border/60 bg-surface-1/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-2 text-[15px] text-black">◷</span>
            <span className="text-[14px] font-semibold tracking-tight">{SITE_NAME}</span>
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={() => setPalette(true)} aria-label="Search tools (Cmd+K)"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-[12.5px] text-muted transition hover:text-fg">
              <Command size={13} /> Search <kbd className="font-mono text-[10px]">⌘K</kbd>
            </button>
            <ThemeSwitch />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-6">{children}</main>
      <SiteFooter />
    </div>
  );
}
