"use client";
import { useMemo } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { ToolBar } from "@/components/app/ToolBar";
import { useSharedState } from "@/lib/share";
import { parseCron, nextRuns } from "@/lib/cron";
import { fmtZone, relative, localTzName } from "@/lib/format";

const DOW = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MON = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const pad = (s: string) => (s.length < 2 ? "0" + s : s);

const PRESETS: { label: string; expr: string }[] = [
  { label: "Every minute", expr: "* * * * *" },
  { label: "Every 5 minutes", expr: "*/5 * * * *" },
  { label: "Every hour", expr: "0 * * * *" },
  { label: "Daily 09:00", expr: "0 9 * * *" },
  { label: "Weekly (Mon)", expr: "0 9 * * 1" },
  { label: "Monthly (1st)", expr: "0 0 1 * *" },
  { label: "Yearly", expr: "0 0 1 1 *" },
  { label: "Business days", expr: "0 9 * * 1-5" },
];

function describe(val: string, names: string[] | null, unit: string): string {
  if (val === "*") return "";
  const step = val.match(/^\*\/(\d+)$/);
  if (step) return `every ${step[1]} ${unit}${+step[1] > 1 ? "s" : ""}`;
  const name = (n: string) => (names ? names[+n] ?? n : n);
  const range = val.match(/^(\d+)-(\d+)$/);
  if (range) return `${name(range[1])} through ${name(range[2])}`;
  if (val.includes(",")) { const xs = val.split(",").map(name); return xs.slice(0, -1).join(", ") + " and " + xs.slice(-1); }
  return name(val);
}

function humanize(expr: string): string {
  const f = expr.trim().split(/\s+/);
  if (f.length !== 5) return "A cron expression needs 5 fields: minute hour day-of-month month day-of-week.";
  const [mi, ho, dom, mon, dow] = f;
  const parts: string[] = [];
  const miStep = mi.match(/^\*\/(\d+)$/); const hoStep = ho.match(/^\*\/(\d+)$/);
  if (mi === "*" && ho === "*") parts.push("Every minute");
  else if (miStep && ho === "*") parts.push(`Every ${miStep[1]} minutes`);
  else if (hoStep) parts.push(`Every ${hoStep[1]} hours${mi !== "*" ? ` at minute ${mi}` : ""}`);
  else if (mi !== "*" && ho !== "*" && !mi.includes(",") && !ho.includes(",") && !mi.includes("-") && !ho.includes("-")) parts.push(`At ${pad(ho)}:${pad(mi)}`);
  else if (ho === "*" && mi !== "*") parts.push(`At minute ${describe(mi, null, "minute")} of every hour`);
  else parts.push(`At minute ${describe(mi, null, "minute") || mi}, hour ${describe(ho, null, "hour") || ho}`);
  if (dow !== "*") parts.push(`on ${describe(dow, DOW, "day-of-week")}`);
  if (dom !== "*") parts.push(`on day-of-month ${describe(dom, null, "day")}`);
  if (mon !== "*") parts.push(`in ${describe(mon, MON, "month")}`);
  return parts.join(", ") + ".";
}

export function CronTool() {
  const [st, set] = useSharedState({ expr: "*/5 * * * *" });
  const expr = st.expr;
  const local = localTzName();

  const res = useMemo(() => {
    try { parseCron(expr); return { ok: true as const, runs: nextRuns(expr, Date.now(), 10), human: humanize(expr) }; }
    catch (e) { return { ok: false as const, msg: e instanceof Error ? e.message : "Invalid", human: humanize(expr) }; }
  }, [expr]);

  return (
    <div className="space-y-4">
      <ToolBar getCopy={() => expr} onReset={() => set({ expr: "* * * * *" })}>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button key={p.label} onClick={() => set({ expr: p.expr })}
              className="rounded-lg border border-border bg-surface-2 px-2.5 py-1 text-[12px] text-muted transition hover:border-accent/50 hover:text-fg">{p.label}</button>
          ))}
        </div>
      </ToolBar>

      <input value={expr} onChange={(e) => set({ expr: e.target.value })} spellCheck={false}
        className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3.5 text-center font-mono text-[20px] tracking-wide outline-none focus:border-accent/60" />
      <div className="text-center text-[11px] text-faint">minute · hour · day-of-month · month · day-of-week</div>

      <div className="rounded-2xl border border-border bg-surface p-5 text-center">
        {res.ok
          ? <div className="text-[20px] font-semibold tracking-tight text-accent">{res.human}</div>
          : <div className="inline-flex items-center gap-1.5 text-[15px] text-danger"><XCircle size={16} /> {res.msg}</div>}
        {res.ok && <div className="mt-1.5 inline-flex items-center gap-1.5 text-[12px] text-good"><CheckCircle2 size={13} /> valid expression</div>}
      </div>

      {res.ok && (
        <div>
          <div className="mb-2 text-[11px] uppercase tracking-wide text-muted">Next 10 runs</div>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            {res.runs.length === 0 ? <div className="p-4 text-[13px] text-muted">No run within ~1 year.</div> :
              res.runs.map((r, i) => (
                <div key={i} className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 px-4 py-2.5 text-[13px] last:border-0">
                  <span className="font-mono">{fmtZone(r, "UTC")}</span>
                  <span className="font-mono text-muted">{fmtZone(r, local)}</span>
                  <span className="text-[11px] text-faint">{relative(r)}</span>
                </div>
              ))}
          </div>
          <p className="mt-2 text-[11.5px] text-faint">Left column UTC · right column your local zone ({local}).</p>
        </div>
      )}
    </div>
  );
}
