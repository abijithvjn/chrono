"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, type Theme } from "@/store/useStore";

interface Cmd { id: string; label: string; hint?: string; run: () => void; }

export function CommandPalette() {
  const open = useStore((s) => s.paletteOpen);
  const setPalette = useStore((s) => s.setPalette);
  const setTheme = useStore((s) => s.setTheme);
  const setMoment = useStore((s) => s.setMoment);
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const toast = (m: string) => { if (typeof window !== "undefined") { const e = document.getElementById("toast"); if (e) { e.textContent = m; e.classList.add("show"); setTimeout(() => e.classList.remove("show"), 1300); } } };
  const copy = (v: string, m: string) => { navigator.clipboard?.writeText(v).catch(() => {}); toast(m); };

  const cmds: Cmd[] = useMemo(() => {
    const ms = () => useStore.getState().ms;
    const startOfDay = () => { const d = new Date(ms()); d.setUTCHours(0, 0, 0, 0); return d.getTime(); };
    const endOfDay = () => { const d = new Date(ms()); d.setUTCHours(23, 59, 59, 0); return d.getTime(); };
    return [
      { id: "now", label: "Set to now", hint: "current time", run: () => setMoment(Date.now(), undefined, "") },
      { id: "copy-s", label: "Copy Unix seconds", run: () => copy(String(Math.floor(ms() / 1000)), "Copied seconds") },
      { id: "copy-ms", label: "Copy Unix milliseconds", run: () => copy(String(ms()), "Copied millis") },
      { id: "copy-iso", label: "Copy ISO 8601", run: () => copy(new Date(ms()).toISOString(), "Copied ISO") },
      { id: "share", label: "Copy shareable link", run: () => copy(window.location.href, "Link copied") },
      { id: "sod", label: "Jump to start of day (UTC)", run: () => setMoment(startOfDay(), undefined, "") },
      { id: "eod", label: "Jump to end of day (UTC)", run: () => setMoment(endOfDay(), undefined, "") },
      { id: "t-system", label: "Theme: System", run: () => setTheme("system" as Theme) },
      { id: "t-dark", label: "Theme: Dark", run: () => setTheme("dark" as Theme) },
      { id: "t-amoled", label: "Theme: AMOLED", run: () => setTheme("amoled" as Theme) },
      { id: "t-light", label: "Theme: Light", run: () => setTheme("light" as Theme) },
      { id: "focus", label: "Focus the input", hint: "/", run: () => document.getElementById("chrono-input")?.focus() },
    ];
  }, [setMoment, setTheme]);

  const filtered = cmds.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => { if (open) { setQ(""); setI(0); setTimeout(() => inputRef.current?.focus(), 30); } }, [open]);
  useEffect(() => { setI(0); }, [q]);

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") setPalette(false);
    else if (e.key === "ArrowDown") { e.preventDefault(); setI((p) => Math.min(p + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setI((p) => Math.max(p - 1, 0)); }
    else if (e.key === "Enter") { filtered[i]?.run(); setPalette(false); }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 px-4 pt-[16vh] backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPalette(false)}>
          <motion.div onClick={(e) => e.stopPropagation()} onKeyDown={onKey}
            initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.14 }}
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface-2 shadow-soft">
            <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type a command…"
              className="w-full border-b border-border bg-transparent px-4 py-3.5 text-[15px] outline-none placeholder:text-faint" />
            <div className="max-h-[320px] overflow-y-auto p-1.5">
              {filtered.map((c, idx) => (
                <button key={c.id} onMouseEnter={() => setI(idx)} onClick={() => { c.run(); setPalette(false); }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[13.5px] transition ${idx === i ? "bg-accent/15 text-fg" : "text-muted"}`}>
                  {c.label}
                  {c.hint && <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-faint">{c.hint}</kbd>}
                </button>
              ))}
              {filtered.length === 0 && <div className="px-3 py-6 text-center text-[13px] text-faint">No commands</div>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
