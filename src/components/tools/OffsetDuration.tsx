"use client";
import { useState } from "react";
import { Section, CopyButton } from "../ui/primitives";
import { useStore } from "@/store/useStore";
import { fmtZone, relative } from "@/lib/format";

const FIELDS = [["y", "yr"], ["mo", "mo"], ["w", "wk"], ["d", "day"], ["h", "hr"], ["mi", "min"], ["s", "sec"]] as const;

export function OffsetCalc() {
  const setMoment = useStore((s) => s.setMoment);
  // Defaults to the current timestamp; "Now" resets it.
  const [base, setBase] = useState<number>(() => Date.now());
  const [v, setV] = useState<Record<string, number>>({});
  const [sign, setSign] = useState(1);
  const g = (k: string) => v[k] || 0;

  const d = new Date(base);
  d.setUTCFullYear(d.getUTCFullYear() + sign * g("y"));
  d.setUTCMonth(d.getUTCMonth() + sign * g("mo"));
  d.setUTCDate(d.getUTCDate() + sign * (g("w") * 7 + g("d")));
  d.setUTCHours(d.getUTCHours() + sign * g("h"));
  d.setUTCMinutes(d.getUTCMinutes() + sign * g("mi"));
  d.setUTCSeconds(d.getUTCSeconds() + sign * g("s"));
  const result = d.getTime();
  const resSec = Math.floor(result / 1000);

  return (
    <Section title="Offset calculator" action={
      <button onClick={() => setBase(Date.now())} className="rounded-lg border border-border px-2.5 py-1 text-[11px] text-muted transition hover:text-fg">Now</button>
    }>
      <div className="mb-2 text-[11px] text-muted">from <span className="font-mono text-fg">{fmtZone(base, "UTC")}</span></div>
      <div className="mb-3 grid grid-cols-4 gap-2 sm:grid-cols-7">
        {FIELDS.map(([k, label]) => (
          <label key={k} className="flex flex-col gap-1 text-[10px] uppercase tracking-wide text-muted">
            {label}
            <input type="number" value={v[k] ?? ""} placeholder="0" onChange={(e) => setV({ ...v, [k]: parseInt(e.target.value || "0", 10) })}
              className="w-full rounded-lg border border-border bg-surface-2 px-2 py-1.5 text-center font-mono text-[13px] text-fg outline-none focus:border-accent/60" />
          </label>
        ))}
      </div>
      <div className="mb-3 flex rounded-lg border border-border bg-surface-2 p-0.5 text-xs">
        <button onClick={() => setSign(1)} className={`flex-1 rounded-md py-1 transition ${sign === 1 ? "bg-accent/20 text-fg" : "text-muted"}`}>+ add</button>
        <button onClick={() => setSign(-1)} className={`flex-1 rounded-md py-1 transition ${sign === -1 ? "bg-accent/20 text-fg" : "text-muted"}`}>− subtract</button>
      </div>
      <div className="flex items-center justify-between rounded-lg border border-border/60 bg-surface-2/60 px-3 py-2.5">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-wide text-muted">Result · epoch</div>
          <div className="truncate font-mono text-2xl font-semibold text-accent">{resSec}</div>
          <div className="truncate font-mono text-[12px] text-muted">{fmtZone(result, "UTC")} · {relative(result)}</div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <CopyButton value={String(resSec)} />
          <button onClick={() => setMoment(result, undefined, "")} className="rounded-lg border border-border px-2 py-1 text-[11px] text-muted transition hover:text-accent">use</button>
        </div>
      </div>
    </Section>
  );
}

export function DurationCalc() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const pa = Date.parse(a), pb = Date.parse(b);
  const ok = !isNaN(pa) && !isNaN(pb);
  const diff = ok ? Math.abs(pb - pa) : 0;
  const s = Math.floor(diff / 1000);
  const parts = ok ? `${Math.floor(s / 86400)}d ${Math.floor((s % 86400) / 3600)}h ${Math.floor((s % 3600) / 60)}m ${s % 60}s` : "—";

  return (
    <Section title="Duration between">
      <div className="flex flex-col gap-2">
        <input value={a} onChange={(e) => setA(e.target.value)} placeholder="2027-01-01 00:00"
          className="rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-[13px] outline-none focus:border-accent/60" />
        <input value={b} onChange={(e) => setB(e.target.value)} placeholder="2027-06-14 12:30"
          className="rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-[13px] outline-none focus:border-accent/60" />
      </div>
      <div className="mt-3 flex items-center justify-between rounded-lg border border-border/60 bg-surface-2/60 px-3 py-2">
        <div>
          <div className="text-[10px] uppercase tracking-wide text-muted">Duration</div>
          <div className="font-mono text-[13px] text-accent">{parts}</div>
          {ok && <div className="font-mono text-[11px] text-muted">{s.toLocaleString()} seconds</div>}
        </div>
        {ok && <CopyButton value={`${parts} (${s}s)`} />}
      </div>
    </Section>
  );
}

export function RelativeCalc() {
  const { ms } = useStore();
  return (
    <Section title="Relative time">
      <div className="text-2xl font-semibold tracking-tight text-accent">{relative(ms)}</div>
      <div className="mt-1 font-mono text-[12px] text-muted">{fmtZone(ms, "UTC")}</div>
    </Section>
  );
}
