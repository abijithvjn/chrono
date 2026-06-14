"use client";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import { Card, CopyButton } from "./ui/primitives";
import { detect, type Detection } from "@/lib/detect";
import { representations } from "@/lib/format";
import { useStore } from "@/store/useStore";

type Unit = "auto" | "s" | "ms" | "us" | "ns";
const UNITS: Unit[] = ["auto", "s", "ms", "us", "ns"];

// ms → "YYYY-MM-DDTHH:MM" in local time, for the datetime-local picker.
function toLocalInput(ms: number): string {
  const d = new Date(ms);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function Converter() {
  const { ms, ns, displayTz, setMoment, addRecent } = useStore();
  const [text, setText] = useState("");
  const [unit, setUnit] = useState<Unit>("auto");
  const [det, setDet] = useState<Detection | null>(null);
  const [bad, setBad] = useState(false);

  // live update on every change (no history spam — input passed as "")
  useEffect(() => {
    if (!text.trim()) { setDet(null); setBad(false); return; }
    const d = detect(text, unit);
    if (d) { setDet(d); setBad(false); setMoment(d.ms, d.ns, ""); }
    else { setBad(true); setDet(null); }
  }, [text, unit, setMoment]);

  // save to Recent only after 5s of no typing
  useEffect(() => {
    if (!text.trim()) return;
    const id = setTimeout(() => {
      const d = detect(text, unit);
      if (d) addRecent(text, d.ms);
    }, 5000);
    return () => clearTimeout(id);
  }, [text, unit, addRecent]);

  const reprs = useMemo(() => representations(ms, ns, displayTz), [ms, ns, displayTz]);
  const groups = [
    { key: "human", title: "Human" },
    { key: "machine", title: "Machine" },
    { key: "encoded", title: "Encoded" },
  ] as const;

  return (
    <Card className="overflow-hidden p-5 sm:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <input
          id="chrono-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste a timestamp, date, JWT, JSON, log line, or 'next friday 5pm'…"
          autoComplete="off" spellCheck={false}
          className="min-w-0 flex-1 rounded-xl border border-border bg-surface-2 px-4 py-3.5 font-mono text-[15px] text-fg outline-none transition focus:border-accent/60 focus:shadow-glow placeholder:text-faint placeholder:font-sans"
        />
        <div className="flex shrink-0 flex-wrap items-center gap-2.5">
          <input
            type="datetime-local" step={1} value={toLocalInput(ms)}
            onChange={(e) => { const t = e.target.value ? new Date(e.target.value).getTime() : NaN; if (!isNaN(t)) { setText(""); setDet(null); setBad(false); setMoment(t, undefined, ""); } }}
            title="Pick a date & time"
            className="rounded-xl border border-border bg-surface-2 px-3 py-3 font-mono text-[13px] text-fg outline-none transition focus:border-accent/60"
          />
          <div className="flex rounded-xl border border-border bg-surface-2 p-1">
            {UNITS.map((u) => (
              <button key={u} onClick={() => setUnit(u)}
                className={`rounded-lg px-2.5 py-1.5 font-mono text-xs transition ${unit === u ? "bg-accent/20 text-fg" : "text-muted hover:text-fg"}`}>
                {u === "us" ? "µs" : u}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 min-h-[20px] text-[12.5px]">
        <AnimatePresence mode="wait">
          {det && (
            <motion.div key={det.label} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="inline-flex items-center gap-1.5 text-muted">
              <Sparkles size={13} className="text-accent" />
              detected <b className="font-mono font-semibold text-accent">{det.label}</b>
            </motion.div>
          )}
          {bad && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-1.5 text-warn">
              <AlertCircle size={13} /> couldn&apos;t recognise that input
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* quick epoch — right under the field */}
      <div className="grid grid-cols-1 gap-3 sm:max-w-xl sm:grid-cols-2">
        {[
          { label: "Unix seconds", v: (ns / 1_000_000_000n).toString() },
          { label: "Unix milliseconds", v: (ns / 1_000_000n).toString() },
        ].map((c) => (
          <div key={c.label} className="group flex items-center justify-between rounded-xl border border-accent/30 bg-accent/5 px-4 py-3">
            <div className="min-w-0">
              <div className="text-[10.5px] uppercase tracking-wider text-muted">{c.label}</div>
              <div className="truncate font-mono text-xl font-semibold text-accent">{c.v}</div>
            </div>
            <CopyButton value={c.v} label="" className="shrink-0 opacity-0 group-hover:opacity-100" />
          </div>
        ))}
      </div>

      {/* JWT panel */}
      {det?.jwt && (
        <div className="mt-4 rounded-xl border border-border bg-surface-2/60 p-4">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">JWT claims</div>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {det.jwt.timeClaims.map((c) => {
              const expired = c.key === "exp" && c.value * 1000 < Date.now();
              return (
                <button key={c.key} onClick={() => setMoment(c.value * 1000, undefined, "")}
                  className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-left text-xs transition hover:border-accent/50">
                  <span className="font-mono text-muted">{c.key}</span>
                  <span className="font-mono">{new Date(c.value * 1000).toISOString().slice(0, 19)}Z
                    {expired && <span className="ml-2 text-danger">expired</span>}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* JSON hits */}
      {det?.jsonHits && det.jsonHits.length > 0 && (
        <div className="mt-4 rounded-xl border border-border bg-surface-2/60 p-4">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">Timestamp fields</div>
          <div className="flex flex-col gap-1">
            {det.jsonHits.slice(0, 8).map((h, i) => (
              <button key={i} onClick={() => setMoment(h.ms, undefined, "")}
                className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left text-xs transition hover:bg-surface">
                <span className="font-mono text-accent">{h.path}</span>
                <span className="flex items-center gap-2 font-mono text-muted">{new Date(h.ms).toISOString().slice(0, 19)}Z <ArrowRight size={11} /></span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* output grid */}
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {groups.map((g) => (
          <div key={g.key}>
            <div className="mb-2.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-faint">{g.title}</div>
            <div className="flex flex-col gap-2">
              {reprs.filter((r) => r.group === g.key).map((r) => (
                <div key={r.key} className="group flex items-center justify-between gap-2 rounded-xl border border-border/60 bg-surface-2/50 px-3.5 py-2.5 transition hover:border-accent/40 hover:bg-surface-2">
                  <div className="min-w-0">
                    <div className="text-[10.5px] text-muted">{r.label}</div>
                    <div className={`truncate font-mono text-[14px] ${r.accent ? "text-accent" : "text-fg"}`}>{r.value}</div>
                  </div>
                  <CopyButton value={r.value} label="" className="shrink-0 opacity-0 group-hover:opacity-100" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
