"use client";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Card, CopyButton } from "./ui/primitives";
import { fmtZone, localTzName } from "@/lib/format";

export function LiveClock() {
  const [ms, setMs] = useState(() => Date.now());
  const [live, setLive] = useState(true);
  const raf = useRef<number>(0);

  useEffect(() => {
    let id: ReturnType<typeof setInterval>;
    if (live) id = setInterval(() => setMs(Date.now()), 75);
    return () => clearInterval(id);
  }, [live]);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const s = Math.floor(ms / 1000);
  const cells = [
    { label: "seconds", v: String(s), big: true },
    { label: "milliseconds", v: String(ms) },
    { label: "microseconds", v: String(ms * 1000) },
    { label: "nanoseconds", v: (BigInt(ms) * 1_000_000n).toString() },
  ];

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[13px] font-semibold tracking-tight">Live epoch</h3>
        <button onClick={() => setLive((l) => !l)} aria-label={live ? "Pause" : "Resume"}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1 text-[11px] text-muted transition hover:text-fg">
          {live ? <Pause size={12} /> : <Play size={12} />}{live ? "Live" : "Paused"}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {cells.map((c) => (
          <div key={c.label} className="group rounded-xl border border-border/60 bg-surface-2/60 p-3">
            <div className="mb-1 text-[10px] uppercase tracking-wider text-muted">{c.label}</div>
            <div className={`font-mono tabular-nums ${c.big ? "text-2xl text-accent" : "text-sm"} truncate`}>{c.v}</div>
            <CopyButton value={c.v} className="mt-2 opacity-0 transition group-hover:opacity-100" />
          </div>
        ))}
      </div>
      <div className="mt-3 text-[12.5px] text-muted">
        {fmtZone(ms, localTzName())} <span className="mx-1.5 text-faint">•</span> {fmtZone(ms, "UTC")}
      </div>
    </Card>
  );
}
