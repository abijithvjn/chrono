"use client";
import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { ToolBar } from "@/components/app/ToolBar";
import { CopyButton } from "@/components/ui/primitives";
import { useSharedState } from "@/lib/share";

export function UuidTool() {
  const [st, set] = useSharedState({ count: "5", upper: "0", hyphens: "1" });
  const [list, setList] = useState<string[]>([]);

  const gen = useCallback(() => {
    const n = Math.min(Math.max(parseInt(st.count || "1", 10) || 1, 1), 100);
    setList(Array.from({ length: n }, () => {
      let u = crypto.randomUUID();
      if (st.hyphens === "0") u = u.replace(/-/g, "");
      if (st.upper === "1") u = u.toUpperCase();
      return u;
    }));
  }, [st.count, st.upper, st.hyphens]);

  // generate after mount only (avoids SSR/client hydration mismatch on random values)
  useEffect(() => { gen(); }, [gen]);

  return (
    <div className="space-y-4">
      <ToolBar getCopy={() => list.join("\n")} onReset={() => set({ count: "5", upper: "0", hyphens: "1" })}>
        <label className="flex items-center gap-1.5 text-[12.5px] text-muted">
          Count
          <input type="number" min={1} max={100} value={st.count} onChange={(e) => set({ count: e.target.value })}
            className="w-16 rounded-lg border border-border bg-surface-2 px-2 py-1 text-center font-mono text-[13px] outline-none focus:border-accent/60" />
        </label>
        <button onClick={() => set({ upper: st.upper === "1" ? "0" : "1" })}
          className={`rounded-lg border px-2.5 py-1.5 text-[12px] transition ${st.upper === "1" ? "border-accent/50 bg-accent/20 text-fg" : "border-border bg-surface-2 text-muted hover:text-fg"}`}>Uppercase</button>
        <button onClick={() => set({ hyphens: st.hyphens === "0" ? "1" : "0" })}
          className={`rounded-lg border px-2.5 py-1.5 text-[12px] transition ${st.hyphens === "0" ? "border-accent/50 bg-accent/20 text-fg" : "border-border bg-surface-2 text-muted hover:text-fg"}`}>No hyphens</button>
        <button onClick={gen} className="inline-flex items-center gap-1.5 rounded-lg bg-accent/20 px-3 py-1.5 text-[12.5px] font-semibold text-fg transition hover:bg-accent/30"><RefreshCw size={13} /> Generate</button>
      </ToolBar>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface-2">
        {list.map((u, i) => (
          <div key={i} className="group flex items-center justify-between gap-2 border-b border-border/40 px-4 py-2.5 last:border-0">
            <span className="truncate font-mono text-[13.5px] text-fg">{u}</span>
            <CopyButton value={u} label="" className="opacity-0 group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
