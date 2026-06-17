"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Clock, Star } from "lucide-react";
import { useStore } from "@/store/useStore";
import { TOOLS, searchTools, toolBySlug, type Tool } from "@/tools/registry";

interface Group { label: string; tools: Tool[]; }

export function CommandPalette() {
  const router = useRouter();
  const open = useStore((s) => s.paletteOpen);
  const setPalette = useStore((s) => s.setPalette);
  const favTools = useStore((s) => s.favTools);
  const recentTools = useStore((s) => s.recentTools);
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Build the visible groups → also a flat list for keyboard navigation.
  const groups: Group[] = useMemo(() => {
    if (q.trim()) return [{ label: "Results", tools: searchTools(q) }];
    const g: Group[] = [];
    const fav = favTools.map(toolBySlug).filter(Boolean) as Tool[];
    const recent = recentTools.map(toolBySlug).filter((t): t is Tool => !!t && !favTools.includes(t.slug)).slice(0, 5);
    if (fav.length) g.push({ label: "Favorites", tools: fav });
    if (recent.length) g.push({ label: "Recently used", tools: recent });
    g.push({ label: fav.length || recent.length ? "All tools" : "Popular tools", tools: TOOLS });
    return g;
  }, [q, favTools, recentTools]);

  const flat = useMemo(() => groups.flatMap((g) => g.tools), [groups]);

  useEffect(() => { if (open) { setQ(""); setI(0); setTimeout(() => inputRef.current?.focus(), 30); } }, [open]);
  useEffect(() => { setI(0); }, [q]);

  const go = (slug: string) => { setPalette(false); router.push(`/${slug}`); };

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") setPalette(false);
    else if (e.key === "ArrowDown") { e.preventDefault(); setI((p) => Math.min(p + 1, flat.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setI((p) => Math.max(p - 1, 0)); }
    else if (e.key === "Enter" && flat[i]) go(flat[i].slug);
  }

  let idx = -1;
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[70] flex items-start justify-center bg-black/50 px-4 pt-[14vh] backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPalette(false)}>
          <motion.div onClick={(e) => e.stopPropagation()} onKeyDown={onKey}
            initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.14 }}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface-2 shadow-soft">
            <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tools…  ↑↓ to navigate, ↵ to open"
              aria-label="Search tools" className="w-full border-b border-border bg-transparent px-4 py-3.5 text-[15px] outline-none placeholder:text-faint" />
            <div className="max-h-[340px] overflow-y-auto p-1.5">
              {flat.length === 0 && <div className="px-3 py-6 text-center text-[13px] text-faint">No tools match “{q}”.</div>}
              {groups.map((g) => (
                <div key={g.label} className="mb-1">
                  <div className="px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-faint">{g.label}</div>
                  {g.tools.map((t) => {
                    idx++; const here = idx;
                    const isFav = favTools.includes(t.slug);
                    return (
                      <button key={g.label + t.slug} onMouseEnter={() => setI(here)} onClick={() => go(t.slug)}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition ${here === i ? "bg-accent/15" : ""}`}>
                        <t.icon size={15} className="shrink-0 text-accent" />
                        <span className="text-[13.5px] text-fg">{t.name}</span>
                        {g.label === "Recently used" && <Clock size={12} className="text-faint" />}
                        {isFav && <Star size={12} className="fill-warn text-warn" />}
                        <span className="ml-auto text-[11px] text-faint">{t.category}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
