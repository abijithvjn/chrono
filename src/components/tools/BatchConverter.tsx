"use client";
import { useState } from "react";
import { Section } from "../ui/primitives";
import { detect } from "@/lib/detect";
import { fmtZone, relative } from "@/lib/format";

interface Row { input: string; utc: string; iso: string; rel: string; ok: boolean; }

export function BatchConverter() {
  const [text, setText] = useState("");
  const [rows, setRows] = useState<Row[]>([]);

  function run() {
    const out = text.split("\n").map((l) => l.trim()).filter(Boolean).map((line): Row => {
      const d = detect(line);
      if (!d) return { input: line, utc: "could not parse", iso: "", rel: "", ok: false };
      return { input: line, utc: fmtZone(d.ms, "UTC"), iso: new Date(d.ms).toISOString(), rel: relative(d.ms), ok: true };
    });
    setRows(out);
  }
  function csv() {
    if (!rows.length) return;
    const body = "input,utc,iso,relative\n" + rows.map((r) => [r.input, r.utc, r.iso, r.rel].map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([body], { type: "text/csv" }));
    a.download = "chrono-batch.csv"; a.click(); URL.revokeObjectURL(a.href);
  }

  return (
    <Section title="Batch convert" action={
      <div className="flex gap-2">
        <button onClick={run} className="rounded-lg bg-accent/20 px-3 py-1 text-xs font-semibold text-fg transition hover:bg-accent/30">Convert</button>
        <button onClick={csv} className="rounded-lg border border-border px-3 py-1 text-xs text-muted transition hover:text-fg">CSV</button>
      </div>
    }>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4}
        placeholder={"One per line…\n1800000000\n1700000000000\n2027-01-15T12:30:00Z\nnext friday 5pm"}
        className="w-full resize-y rounded-xl border border-border bg-surface-2 p-3 font-mono text-[12.5px] outline-none focus:border-accent/60" />
      {rows.length > 0 && (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead><tr className="text-[10px] uppercase tracking-wide text-faint">
              <th className="py-1.5 pr-3">Input</th><th className="py-1.5 pr-3">UTC</th><th className="py-1.5 pr-3">ISO</th><th className="py-1.5">Relative</th>
            </tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-border/50">
                  <td className="py-1.5 pr-3 font-mono">{r.input}</td>
                  {r.ok ? <>
                    <td className="py-1.5 pr-3">{r.utc}</td>
                    <td className="py-1.5 pr-3 font-mono text-muted">{r.iso}</td>
                    <td className="py-1.5 text-muted">{r.rel}</td>
                  </> : <td colSpan={3} className="py-1.5 text-warn">{r.utc}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
}
