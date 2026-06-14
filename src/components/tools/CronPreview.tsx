"use client";
import { useMemo, useState } from "react";
import { Section } from "../ui/primitives";
import { nextRuns } from "@/lib/cron";
import { fmtZone, relative } from "@/lib/format";

export function CronPreview() {
  const [expr, setExpr] = useState("0 9 * * 1-5");
  const result = useMemo(() => {
    try { return { runs: nextRuns(expr, Date.now(), 5), err: "" }; }
    catch (e) { return { runs: [], err: e instanceof Error ? e.message : "invalid" }; }
  }, [expr]);

  return (
    <Section title="Cron preview (UTC)">
      <input value={expr} onChange={(e) => setExpr(e.target.value)} spellCheck={false}
        className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 font-mono text-[14px] outline-none focus:border-accent/60" />
      <div className="mt-1 text-[11px] text-faint">min hour day-of-month month day-of-week</div>
      <div className="mt-3 flex flex-col gap-1.5">
        {result.err && <div className="text-[12.5px] text-warn">{result.err}</div>}
        {!result.err && result.runs.length === 0 && <div className="text-[12.5px] text-muted">No run within ~1 year.</div>}
        {result.runs.map((r, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-1.5">
            <span className="font-mono text-[12.5px]">{fmtZone(r, "UTC")}</span>
            <span className="text-[11px] text-muted">{relative(r)}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}
