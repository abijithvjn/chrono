"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// "system" follows the OS/browser preference; the rest are explicit.
export type Theme = "system" | "dark" | "light" | "amoled";

export interface HistoryItem { input: string; ms: number; at: number; }

interface State {
  ms: number;
  ns: bigint;
  lastInput: string;
  displayTz: string;
  theme: Theme;
  paletteOpen: boolean;
  history: HistoryItem[];
  favTools: string[];
  recentTools: string[];

  setMoment: (ms: number, ns?: bigint, input?: string) => void;
  addRecent: (input: string, ms: number) => void;
  setTz: (tz: string) => void;
  setTheme: (t: Theme) => void;
  setPalette: (open: boolean) => void;
  toggleFav: (slug: string) => void;
  pushRecentTool: (slug: string) => void;
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      ms: Date.now(),
      ns: BigInt(Date.now()) * 1_000_000n,
      lastInput: "",
      displayTz: "UTC",
      theme: "light",
      paletteOpen: false,
      history: [],
      favTools: [],
      recentTools: [],

      setMoment: (ms, ns, input) => {
        const realNs = ns ?? BigInt(Math.round(ms)) * 1_000_000n;
        const hist = get().history;
        const next = input && input.trim()
          ? [{ input: input.trim(), ms, at: Date.now() }, ...hist.filter((h) => h.input !== input.trim())].slice(0, 12)
          : hist;
        set({ ms, ns: realNs, lastInput: input ?? get().lastInput, history: next });
        if (typeof window !== "undefined") {
          const u = new URL(window.location.href);
          u.hash = `t=${ms}`;
          window.history.replaceState(null, "", u.toString());
        }
      },
      addRecent: (input, ms) => {
        const t = input.trim();
        if (!t) return;
        const hist = get().history;
        set({ history: [{ input: t, ms, at: Date.now() }, ...hist.filter((h) => h.input !== t)].slice(0, 12) });
      },
      setTz: (displayTz) => set({ displayTz }),
      setTheme: (theme) => set({ theme }),
      setPalette: (paletteOpen) => set({ paletteOpen }),
      toggleFav: (slug) => set((s) => ({
        favTools: s.favTools.includes(slug) ? s.favTools.filter((x) => x !== slug) : [...s.favTools, slug],
      })),
      pushRecentTool: (slug) => set((s) => ({
        recentTools: [slug, ...s.recentTools.filter((x) => x !== slug)].slice(0, 8),
      })),
    }),
    {
      name: "chrono",
      partialize: (s) => ({ theme: s.theme, displayTz: s.displayTz, history: s.history, favTools: s.favTools, recentTools: s.recentTools }),
    }
  )
);
