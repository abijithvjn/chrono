"use client";
import { useEffect, useMemo, useState } from "react";
import { detect } from "@/lib/detect";
import { representations } from "@/lib/format";
import { useMounted } from "@/lib/useMounted";
import { CopyButton } from "./ui/primitives";

// Self-contained interactive converter for a landing page (no global store).
// Seeded with `example`; "now" seeds the live current time.
export function MiniConverter({ example }: { example: string }) {
  const mounted = useMounted();
  const [text, setText] = useState(example === "now" ? "" : example);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (example === "now" && !text) {
      const id = setInterval(() => setNow(Date.now()), 1000);
      return () => clearInterval(id);
    }
  }, [example, text]);

  const { ms, ns } = useMemo(() => {
    if (!text.trim()) return { ms: now, ns: BigInt(now) * 1_000_000n };
    const d = detect(text);
    return d ? { ms: d.ms, ns: d.ns } : { ms: now, ns: BigInt(now) * 1_000_000n };
  }, [text, now]);

  const reprs = representations(ms, ns, "UTC").filter((r) => ["local", "utc", "iso", "s", "ms", "rel"].includes(r.key));

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-soft sm:p-5">
      <label htmlFor="mini" className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted">
        Try it — paste a value
      </label>
      <input
        id="mini" value={text} onChange={(e) => setText(e.target.value)}
        placeholder={example === "now" ? "leave empty for the current time…" : example}
        autoComplete="off" spellCheck={false}
        className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 font-mono text-[14px] text-fg outline-none transition focus:border-accent/60 focus:shadow-glow"
      />
      {mounted && (
        <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
          {reprs.map((r) => (
            <div key={r.key} className="group flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-surface-2/50 px-3 py-2">
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-wide text-muted">{r.label}</div>
                <div className={`truncate font-mono text-[13px] ${r.accent ? "text-accent" : "text-fg"}`}>{r.value}</div>
              </div>
              <CopyButton value={r.value} label="" className="shrink-0 opacity-0 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
