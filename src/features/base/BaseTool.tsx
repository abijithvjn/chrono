"use client";
import { useMemo } from "react";
import { ToolBar } from "@/components/app/ToolBar";
import { CopyButton } from "@/components/ui/primitives";
import { useSharedState } from "@/lib/share";

const BASES: { id: string; radix: number; label: string }[] = [
  { id: "2", radix: 2, label: "Binary" },
  { id: "8", radix: 8, label: "Octal" },
  { id: "10", radix: 10, label: "Decimal" },
  { id: "16", radix: 16, label: "Hex" },
];

function parseInBase(str: string, radix: number): bigint | null {
  str = str.trim().toLowerCase();
  if (!str) return null;
  const neg = str.startsWith("-");
  if (neg) str = str.slice(1);
  if (!str) return null;
  let v = 0n;
  const R = BigInt(radix);
  for (const ch of str) {
    const d = parseInt(ch, radix);
    if (isNaN(d) || d >= radix) return null;
    v = v * R + BigInt(d);
  }
  return neg ? -v : v;
}

export function BaseTool() {
  const [st, set] = useSharedState({ value: "255", base: "10" });
  const radix = parseInt(st.base, 10);

  const parsed = useMemo(() => parseInBase(st.value, radix), [st.value, radix]);

  return (
    <div className="space-y-4">
      <ToolBar getCopy={() => (parsed != null ? parsed.toString(10) : "")} onReset={() => set({ value: "255", base: "10" })}>
        <div className="flex rounded-lg border border-border bg-surface-2 p-0.5">
          {BASES.map((b) => (
            <button key={b.id} onClick={() => set({ base: b.id })}
              className={`rounded-md px-2.5 py-1 text-[12px] transition ${st.base === b.id ? "bg-accent/20 text-fg" : "text-muted hover:text-fg"}`}>{b.label}</button>
          ))}
        </div>
      </ToolBar>

      <div>
        <div className="mb-1.5 text-[11px] uppercase tracking-wide text-muted">Value (base {radix})</div>
        <input value={st.value} onChange={(e) => set({ value: e.target.value })} spellCheck={false}
          className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 font-mono text-[16px] outline-none focus:border-accent/60" />
        {st.value.trim() && parsed == null && <p className="mt-1.5 text-[12.5px] text-danger">Not a valid base-{radix} number.</p>}
      </div>

      {parsed != null && (
        <div className="flex flex-col gap-2">
          {BASES.map((b) => (
            <div key={b.id} className="group flex items-center gap-3 rounded-xl border border-border/60 bg-surface-2/50 px-3.5 py-2.5">
              <span className="w-20 shrink-0 font-mono text-[12px] text-accent">{b.label}</span>
              <span className="min-w-0 flex-1 truncate font-mono text-[14px]">{b.radix === 16 ? parsed.toString(16) : parsed.toString(b.radix)}</span>
              <CopyButton value={parsed.toString(b.radix)} label="" className="shrink-0 opacity-0 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
