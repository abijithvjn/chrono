"use client";
import { useMemo, useRef, useState } from "react";
import { CheckCircle2, XCircle, Upload, Download } from "lucide-react";
import { ToolBar } from "@/components/app/ToolBar";
import { useSharedState } from "@/lib/share";

function errorLoc(text: string, msg: string): { line: number; col: number } | null {
  const lc = msg.match(/line (\d+) column (\d+)/i);
  if (lc) return { line: +lc[1], col: +lc[2] };
  const p = msg.match(/position (\d+)/i);
  if (p) {
    const pos = +p[1];
    const upto = text.slice(0, pos);
    return { line: upto.split("\n").length, col: pos - upto.lastIndexOf("\n") };
  }
  return null;
}

function highlight(json: string): string {
  const esc = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return esc.replace(
    /("(?:\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
    (m) => {
      let cls = "tok-num";
      if (/^"/.test(m)) cls = /:\s*$/.test(m) ? "tok-key" : "tok-str";
      else if (/true|false/.test(m)) cls = "tok-bool";
      else if (/null/.test(m)) cls = "tok-null";
      return `<span class="${cls}">${m}</span>`;
    }
  );
}

export function JsonTool() {
  const [st, set] = useSharedState({ input: "" });
  const input = st.input;
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const parsed = useMemo(() => {
    if (!input.trim()) return { ok: true as const, pretty: "", min: "", empty: true };
    try {
      const obj = JSON.parse(input);
      return { ok: true as const, pretty: JSON.stringify(obj, null, 2), min: JSON.stringify(obj), empty: false };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Invalid JSON";
      return { ok: false as const, msg, loc: errorLoc(input, msg) };
    }
  }, [input]);

  const pretty = parsed.ok ? parsed.pretty : "";
  const big = pretty.length > 200_000;
  const lines = pretty ? pretty.split("\n") : [];

  function loadFile(f: File) { f.text().then((t) => set({ input: t })); }
  function download() {
    const blob = new Blob([pretty || input], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "data.json"; a.click(); URL.revokeObjectURL(a.href);
  }

  return (
    <div className="space-y-4">
      <ToolBar getCopy={() => pretty || input} onClear={() => set({ input: "" })}>
        <button className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-[12.5px] text-muted transition hover:text-fg" onClick={() => parsed.ok && !parsed.empty && set({ input: parsed.pretty })}>Format</button>
        <button className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-[12.5px] text-muted transition hover:text-fg" onClick={() => parsed.ok && !parsed.empty && set({ input: parsed.min })}>Minify</button>
        <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-2.5 py-1.5 text-[12.5px] text-muted transition hover:text-fg"><Upload size={13} /> Upload</button>
        <button onClick={download} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-2.5 py-1.5 text-[12.5px] text-muted transition hover:text-fg"><Download size={13} /> Download</button>
        <input ref={fileRef} type="file" accept=".json,application/json,text/plain" className="hidden" onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])} />
      </ToolBar>

      {/* status */}
      <div className="text-[13px]">
        {parsed.empty ? <span className="text-faint">Paste or drop JSON to validate.</span>
          : parsed.ok ? <span className="inline-flex items-center gap-1.5 text-good"><CheckCircle2 size={14} /> Valid JSON</span>
          : <span className="inline-flex items-center gap-1.5 text-danger"><XCircle size={14} /> {parsed.msg}{parsed.loc ? ` (line ${parsed.loc.line}, column ${parsed.loc.col})` : ""}</span>}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) loadFile(f); }}>
          <div className="mb-1.5 text-[11px] uppercase tracking-wide text-muted">Input</div>
          <textarea value={input} onChange={(e) => set({ input: e.target.value })} spellCheck={false}
            placeholder={drag ? "Drop JSON file…" : '{"hello": "world"}'}
            className={`h-[420px] w-full resize-y rounded-xl border bg-surface-2 p-3 font-mono text-[13px] outline-none focus:border-accent/60 ${drag ? "border-accent" : "border-border"}`} />
        </div>
        <div>
          <div className="mb-1.5 text-[11px] uppercase tracking-wide text-muted">Formatted</div>
          <div className="h-[420px] overflow-auto rounded-xl border border-border bg-surface-2">
            {pretty ? (
              <div className="flex font-mono text-[12.5px] leading-[1.6]">
                <pre aria-hidden className="select-none px-3 py-3 text-right text-faint">{lines.map((_, i) => i + 1).join("\n")}</pre>
                {big
                  ? <pre className="flex-1 overflow-x-auto px-2 py-3 whitespace-pre">{pretty}</pre>
                  : <pre className="flex-1 overflow-x-auto px-2 py-3 whitespace-pre" dangerouslySetInnerHTML={{ __html: highlight(pretty) }} />}
              </div>
            ) : <div className="p-3 text-[13px] text-faint">—</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
