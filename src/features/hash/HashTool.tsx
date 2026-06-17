"use client";
import { useEffect, useState } from "react";
import { ToolBar } from "@/components/app/ToolBar";
import { CopyButton } from "@/components/ui/primitives";
import { useSharedState } from "@/lib/share";

const ALGOS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];

export function HashTool() {
  const [st, set] = useSharedState({ text: "" });
  const text = st.text;
  const [hashes, setHashes] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!text) { setHashes({}); return; }
      const data = new TextEncoder().encode(text);
      const out: Record<string, string> = {};
      for (const algo of ALGOS) {
        const buf = await crypto.subtle.digest(algo, data);
        out[algo] = [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
      }
      if (!cancelled) setHashes(out);
    })();
    return () => { cancelled = true; };
  }, [text]);

  return (
    <div className="space-y-4">
      <ToolBar onClear={() => set({ text: "" })} />
      <textarea value={text} onChange={(e) => set({ text: e.target.value })} spellCheck={false}
        placeholder="Type or paste text to hash…"
        className="h-32 w-full resize-y rounded-xl border border-border bg-surface-2 p-3 font-mono text-[13px] outline-none focus:border-accent/60" />

      <div className="flex flex-col gap-2">
        {ALGOS.map((algo) => (
          <div key={algo} className="group flex items-center gap-3 rounded-xl border border-border/60 bg-surface-2/50 px-3.5 py-2.5">
            <span className="w-20 shrink-0 font-mono text-[12px] text-accent">{algo}</span>
            <span className="min-w-0 flex-1 truncate font-mono text-[13px]">{hashes[algo] || <span className="text-faint">—</span>}</span>
            {hashes[algo] && <CopyButton value={hashes[algo]} label="" className="shrink-0 opacity-0 group-hover:opacity-100" />}
          </div>
        ))}
      </div>
    </div>
  );
}
