"use client";
import { useMemo } from "react";
import { ToolBar } from "@/components/app/ToolBar";
import { useSharedState } from "@/lib/share";

export function UrlTool() {
  const [st, set] = useSharedState({ mode: "encode", scope: "component", input: "" });
  const { mode, scope, input } = st;

  const { output, error } = useMemo(() => {
    if (!input) return { output: "", error: "" };
    try {
      const fn = mode === "encode"
        ? (scope === "component" ? encodeURIComponent : encodeURI)
        : (scope === "component" ? decodeURIComponent : decodeURI);
      return { output: fn(input), error: "" };
    } catch {
      return { output: "", error: "Could not decode — malformed percent-encoding." };
    }
  }, [input, mode, scope]);

  const seg = (key: "mode" | "scope", opts: [string, string][]) => (
    <div className="flex rounded-lg border border-border bg-surface-2 p-0.5">
      {opts.map(([v, label]) => (
        <button key={v} onClick={() => set({ [key]: v } as Record<string, string>)}
          className={`rounded-md px-2.5 py-1 text-[12px] transition ${st[key] === v ? "bg-accent/20 text-fg" : "text-muted hover:text-fg"}`}>{label}</button>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <ToolBar getCopy={() => output} onClear={() => set({ input: "" })}>
        {seg("mode", [["encode", "Encode"], ["decode", "Decode"]])}
        {seg("scope", [["component", "Component"], ["full", "Full URL"]])}
      </ToolBar>
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-1.5 text-[11px] uppercase tracking-wide text-muted">Input</div>
          <textarea value={input} onChange={(e) => set({ input: e.target.value })} spellCheck={false}
            placeholder={mode === "encode" ? "https://example.com/search?q=hello world" : "https%3A%2F%2Fexample.com"}
            className="h-48 w-full resize-y rounded-xl border border-border bg-surface-2 p-3 font-mono text-[13px] outline-none focus:border-accent/60" />
        </div>
        <div>
          <div className="mb-1.5 text-[11px] uppercase tracking-wide text-muted">Output</div>
          <textarea readOnly value={error || output} placeholder="Result…"
            className={`h-48 w-full resize-y rounded-xl border border-border bg-surface-2 p-3 font-mono text-[13px] outline-none ${error ? "text-danger" : ""}`} />
        </div>
      </div>
    </div>
  );
}
