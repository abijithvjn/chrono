"use client";
import { useMemo } from "react";
import { ToolBar } from "@/components/app/ToolBar";
import { CopyButton } from "@/components/ui/primitives";
import { useSharedState } from "@/lib/share";

function words(s: string): string[] {
  return s
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[\s\-_./]+/)
    .map((w) => w.trim())
    .filter(Boolean);
}
const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();

export function CaseTool() {
  const [st, set] = useSharedState({ text: "" });
  const text = st.text;

  const out = useMemo(() => {
    const w = words(text);
    const lower = w.map((x) => x.toLowerCase());
    return [
      { label: "camelCase", value: lower.map((x, i) => (i ? cap(x) : x)).join("") },
      { label: "PascalCase", value: w.map(cap).join("") },
      { label: "snake_case", value: lower.join("_") },
      { label: "kebab-case", value: lower.join("-") },
      { label: "CONSTANT_CASE", value: lower.join("_").toUpperCase() },
      { label: "Title Case", value: w.map(cap).join(" ") },
      { label: "Sentence case", value: w.length ? cap(lower.join(" ")) : "" },
      { label: "lowercase", value: text.toLowerCase() },
      { label: "UPPERCASE", value: text.toUpperCase() },
      { label: "slug", value: lower.join("-").replace(/[^a-z0-9-]/g, "") },
    ];
  }, [text]);

  return (
    <div className="space-y-4">
      <ToolBar onClear={() => set({ text: "" })} />
      <textarea value={text} onChange={(e) => set({ text: e.target.value })} spellCheck={false}
        placeholder="Type or paste text — e.g. “Get User ById”"
        className="h-28 w-full resize-y rounded-xl border border-border bg-surface-2 p-3 font-mono text-[14px] outline-none focus:border-accent/60" />

      <div className="grid gap-2 sm:grid-cols-2">
        {out.map((r) => (
          <div key={r.label} className="group flex items-center gap-3 rounded-xl border border-border/60 bg-surface-2/50 px-3.5 py-2.5">
            <span className="w-32 shrink-0 font-mono text-[11.5px] text-accent">{r.label}</span>
            <span className="min-w-0 flex-1 truncate font-mono text-[13.5px]">{r.value || <span className="text-faint">—</span>}</span>
            {r.value && <CopyButton value={r.value} label="" className="shrink-0 opacity-0 group-hover:opacity-100" />}
          </div>
        ))}
      </div>
    </div>
  );
}
