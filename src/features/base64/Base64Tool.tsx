"use client";
import { useMemo, useRef, useState } from "react";
import { Upload, Download } from "lucide-react";
import { ToolBar } from "@/components/app/ToolBar";
import { useSharedState, copyText } from "@/lib/share";

const MODES = ["auto", "encode", "decode"] as const;
type Mode = (typeof MODES)[number];

const encode = (s: string) => btoa(unescape(encodeURIComponent(s)));
const decode = (s: string) => decodeURIComponent(escape(atob(s.replace(/\s+/g, ""))));
const looksBase64 = (s: string) => {
  const t = s.trim().replace(/\s+/g, "");
  return t.length > 0 && t.length % 4 === 0 && /^[A-Za-z0-9+/]+={0,2}$/.test(t);
};
const bytes = (s: string) => new TextEncoder().encode(s).length;

export function Base64Tool() {
  const [st, set] = useSharedState({ mode: "auto" as Mode, input: "" });
  const mode = st.mode as Mode;
  const input = st.input;
  const [fileOut, setFileOut] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  const { output, error } = useMemo(() => {
    if (fileOut) return { output: fileOut, error: "" };
    if (!input) return { output: "", error: "" };
    try {
      const m = mode === "auto" ? (looksBase64(input) ? "decode" : "encode") : mode;
      return { output: m === "encode" ? encode(input) : decode(input), error: "" };
    } catch {
      return { output: "", error: "Not valid Base64 — check for stray characters." };
    }
  }, [input, mode, fileOut]);

  function onFile(file: File) {
    const r = new FileReader();
    r.onload = () => {
      const res = String(r.result);
      setFileName(file.name);
      setFileOut(res.includes(",") ? res.split(",")[1] : res);
    };
    r.readAsDataURL(file);
  }
  const clearAll = () => { set({ input: "" }); setFileOut(""); setFileName(""); };

  return (
    <div className="space-y-4">
      <ToolBar getCopy={() => output} onClear={clearAll} onReset={() => { clearAll(); set({ mode: "auto" }); }}>
        <div className="flex rounded-lg border border-border bg-surface-2 p-0.5">
          {MODES.map((m) => (
            <button key={m} onClick={() => { setFileOut(""); set({ mode: m }); }}
              className={`rounded-md px-3 py-1.5 text-[12.5px] capitalize transition ${mode === m ? "bg-accent/20 text-fg" : "text-muted hover:text-fg"}`}>{m}</button>
          ))}
        </div>
        <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-2.5 py-1.5 text-[12.5px] text-muted transition hover:text-fg">
          <Upload size={13} /> File
        </button>
        <input ref={fileRef} type="file" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      </ToolBar>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-1.5 flex items-center justify-between text-[11px] uppercase tracking-wide text-muted">
            <span>{fileName ? `File · ${fileName}` : "Input"}</span>
            <span>{input.length} chars · {bytes(input)} B</span>
          </div>
          <textarea value={fileName ? "" : input} disabled={!!fileName}
            onChange={(e) => set({ input: e.target.value })} placeholder="Paste text or Base64…" spellCheck={false}
            className="h-64 w-full resize-y rounded-xl border border-border bg-surface-2 p-3 font-mono text-[13px] outline-none focus:border-accent/60 disabled:opacity-50" />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between text-[11px] uppercase tracking-wide text-muted">
            <span>Output</span>
            <span>{output.length} chars · {bytes(output)} B</span>
          </div>
          <div className="relative h-64">
            <textarea readOnly value={error || output} placeholder="Result appears here…" spellCheck={false}
              className={`h-full w-full resize-y rounded-xl border border-border bg-surface-2 p-3 font-mono text-[13px] outline-none ${error ? "text-danger" : ""}`} />
            {output && !error && (
              <button onClick={() => copyText(`data:application/octet-stream;base64,${output}`, "Data URL copied")}
                title="Copy as data URL"
                className="absolute right-2 top-2 rounded-md border border-border bg-surface px-2 py-1 text-[10.5px] text-muted hover:text-fg"><Download size={12} className="inline" /> data URL</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
