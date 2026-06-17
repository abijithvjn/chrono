"use client";
import { useMemo, type ReactNode } from "react";
import { ToolBar } from "@/components/app/ToolBar";
import { useSharedState } from "@/lib/share";

const FLAGS: { f: string; label: string }[] = [
  { f: "g", label: "global" }, { f: "i", label: "ignore case" }, { f: "m", label: "multiline" },
  { f: "s", label: "dotall" }, { f: "u", label: "unicode" }, { f: "y", label: "sticky" },
];

interface MatchInfo { index: number; full: string; groups: string[]; named: Record<string, string>; }

export function RegexTool() {
  const [st, set] = useSharedState({ pattern: "\\b(\\w+)@(\\w+)\\.(\\w+)\\b", flags: "g", test: "Contact us at hello@devtoolskit.online or admin@example.com." });
  const { pattern, flags, test } = st;

  const result = useMemo(() => {
    if (!pattern) return { matches: [] as MatchInfo[], error: "" };
    try {
      const useFlags = flags.includes("g") ? flags : flags + "g";
      const re = new RegExp(pattern, useFlags);
      const matches: MatchInfo[] = [];
      for (const m of test.matchAll(re)) {
        matches.push({ index: m.index ?? 0, full: m[0], groups: m.slice(1).map((g) => g ?? ""), named: { ...(m.groups ?? {}) } });
        if (matches.length > 5000) break;
      }
      return { matches, error: "" };
    } catch (e) {
      return { matches: [] as MatchInfo[], error: e instanceof Error ? e.message : "Invalid regular expression" };
    }
  }, [pattern, flags, test]);

  const highlighted: ReactNode[] = useMemo(() => {
    if (result.error || !result.matches.length) return [test];
    const parts: ReactNode[] = [];
    let last = 0;
    result.matches.forEach((m, i) => {
      if (m.index >= last) {
        parts.push(test.slice(last, m.index));
        parts.push(<mark key={i} className="rounded bg-accent/30 px-0.5 text-fg">{m.full || "∅"}</mark>);
        last = m.index + m.full.length;
      }
    });
    parts.push(test.slice(last));
    return parts;
  }, [result, test]);

  const toggle = (f: string) => set({ flags: flags.includes(f) ? flags.replace(f, "") : flags + f });

  return (
    <div className="space-y-4">
      <ToolBar getCopy={() => `/${pattern}/${flags}`} onClear={() => set({ pattern: "", test: "" })}
        onReset={() => set({ pattern: "", flags: "g", test: "" })}>
        <div className="flex flex-wrap gap-1.5">
          {FLAGS.map(({ f, label }) => (
            <button key={f} title={label} onClick={() => toggle(f)}
              className={`h-8 w-8 rounded-lg border font-mono text-[13px] transition ${flags.includes(f) ? "border-accent/50 bg-accent/20 text-fg" : "border-border bg-surface-2 text-muted hover:text-fg"}`}>{f}</button>
          ))}
        </div>
      </ToolBar>

      <div>
        <label className="mb-1.5 block text-[11px] uppercase tracking-wide text-muted">Pattern</label>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-3">
          <span className="font-mono text-faint">/</span>
          <input value={pattern} onChange={(e) => set({ pattern: e.target.value })} spellCheck={false}
            className="w-full bg-transparent py-3 font-mono text-[14px] outline-none" />
          <span className="font-mono text-faint">/{flags}</span>
        </div>
        {result.error && <p className="mt-1.5 text-[12.5px] text-danger">{result.error}</p>}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[11px] uppercase tracking-wide text-muted">Test string</label>
          <textarea value={test} onChange={(e) => set({ test: e.target.value })} spellCheck={false}
            className="h-56 w-full resize-y rounded-xl border border-border bg-surface-2 p-3 font-mono text-[13px] outline-none focus:border-accent/60" />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between text-[11px] uppercase tracking-wide text-muted">
            <span>Matches</span><span className="text-accent">{result.matches.length} found</span>
          </div>
          <pre className="h-56 overflow-auto whitespace-pre-wrap rounded-xl border border-border bg-surface-2 p-3 font-mono text-[13px] leading-relaxed">{highlighted}</pre>
        </div>
      </div>

      {result.matches.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full text-left text-[12.5px]">
            <thead><tr className="border-b border-border/60 text-[11px] uppercase tracking-wide text-muted">
              <th className="px-3 py-2">#</th><th className="px-3 py-2">Match</th><th className="px-3 py-2">Position</th><th className="px-3 py-2">Groups</th>
            </tr></thead>
            <tbody>
              {result.matches.slice(0, 200).map((m, i) => (
                <tr key={i} className="border-b border-border/40 last:border-0 align-top">
                  <td className="px-3 py-2 text-muted">{i + 1}</td>
                  <td className="px-3 py-2 font-mono text-accent">{m.full || "∅"}</td>
                  <td className="px-3 py-2 font-mono text-muted">{m.index}–{m.index + m.full.length}</td>
                  <td className="px-3 py-2 font-mono">{m.groups.length ? m.groups.map((g, gi) => <span key={gi} className="mr-2 text-fg">{gi + 1}:{g || "—"}</span>) : <span className="text-faint">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
