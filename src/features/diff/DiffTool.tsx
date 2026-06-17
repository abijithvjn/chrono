"use client";
import { useMemo } from "react";
import { ToolBar } from "@/components/app/ToolBar";
import { useSharedState } from "@/lib/share";
import { diffLines } from "./diff";

export function DiffTool() {
  const [st, set] = useSharedState({ left: "", right: "", ws: "0", ci: "0", view: "split" });
  const { left, right } = st;
  const ignoreWs = st.ws === "1", ignoreCase = st.ci === "1", unified = st.view === "unified";

  const ops = useMemo(() => {
    const key = (s: string) => { let x = s; if (ignoreWs) x = x.trim().replace(/\s+/g, " "); if (ignoreCase) x = x.toLowerCase(); return x; };
    return diffLines(left.split("\n"), right.split("\n"), key);
  }, [left, right, ignoreWs, ignoreCase]);

  const adds = ops.filter((o) => o.type === "add").length;
  const dels = ops.filter((o) => o.type === "del").length;

  const rows = useMemo(() => {
    const r: { l: string | null; r: string | null; lt: string; rt: string }[] = [];
    for (let k = 0; k < ops.length; k++) {
      const o = ops[k];
      if (o.type === "eq") r.push({ l: o.a!, r: o.b!, lt: "eq", rt: "eq" });
      else if (o.type === "del") {
        if (ops[k + 1]?.type === "add") { r.push({ l: o.a!, r: ops[k + 1].b!, lt: "del", rt: "add" }); k++; }
        else r.push({ l: o.a!, r: null, lt: "del", rt: "none" });
      } else r.push({ l: null, r: o.b!, lt: "none", rt: "add" });
    }
    return r;
  }, [ops]);

  const unifiedText = ops.map((o) => (o.type === "eq" ? "  " + o.a : o.type === "del" ? "- " + o.a : "+ " + o.b)).join("\n");
  const bg = (t: string) => (t === "add" ? "bg-good/10" : t === "del" ? "bg-danger/10" : "");
  const toggle = (k: "ws" | "ci") => set({ [k]: st[k] === "1" ? "0" : "1" } as Record<string, string>);

  return (
    <div className="space-y-4">
      <ToolBar getCopy={() => unifiedText} onClear={() => set({ left: "", right: "" })}>
        <button onClick={() => toggle("ws")} className={`rounded-lg border px-2.5 py-1.5 text-[12px] transition ${ignoreWs ? "border-accent/50 bg-accent/20 text-fg" : "border-border bg-surface-2 text-muted hover:text-fg"}`}>Ignore whitespace</button>
        <button onClick={() => toggle("ci")} className={`rounded-lg border px-2.5 py-1.5 text-[12px] transition ${ignoreCase ? "border-accent/50 bg-accent/20 text-fg" : "border-border bg-surface-2 text-muted hover:text-fg"}`}>Ignore case</button>
        <div className="flex rounded-lg border border-border bg-surface-2 p-0.5">
          {["split", "unified"].map((v) => (
            <button key={v} onClick={() => set({ view: v })} className={`rounded-md px-2.5 py-1 text-[12px] capitalize transition ${st.view === v ? "bg-accent/20 text-fg" : "text-muted hover:text-fg"}`}>{v}</button>
          ))}
        </div>
      </ToolBar>

      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={left} onChange={(e) => set({ left: e.target.value })} placeholder="Original…" spellCheck={false}
          className="h-48 w-full resize-y rounded-xl border border-border bg-surface-2 p-3 font-mono text-[13px] outline-none focus:border-accent/60" />
        <textarea value={right} onChange={(e) => set({ right: e.target.value })} placeholder="Changed…" spellCheck={false}
          className="h-48 w-full resize-y rounded-xl border border-border bg-surface-2 p-3 font-mono text-[13px] outline-none focus:border-accent/60" />
      </div>

      <div className="flex gap-4 text-[12.5px]">
        <span className="text-good">+{adds} added</span><span className="text-danger">−{dels} removed</span>
      </div>

      {(left || right) && (
        <div className="overflow-auto rounded-xl border border-border bg-surface-2 font-mono text-[12.5px] leading-[1.7]">
          {unified ? (
            <pre className="p-3 whitespace-pre">
              {ops.map((o, i) => (
                <div key={i} className={o.type === "add" ? "bg-good/10 text-good" : o.type === "del" ? "bg-danger/10 text-danger" : ""}>
                  {o.type === "eq" ? "  " + o.a : o.type === "del" ? "− " + o.a : "+ " + o.b}
                </div>
              ))}
            </pre>
          ) : (
            <div className="grid grid-cols-2 divide-x divide-border">
              <div>{rows.map((r, i) => <div key={i} className={`whitespace-pre px-3 ${bg(r.lt)}`}>{r.l ?? ""}</div>)}</div>
              <div>{rows.map((r, i) => <div key={i} className={`whitespace-pre px-3 ${bg(r.rt)}`}>{r.r ?? ""}</div>)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
