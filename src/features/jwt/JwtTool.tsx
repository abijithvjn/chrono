"use client";
import { useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { ToolBar } from "@/components/app/ToolBar";
import { CopyButton } from "@/components/ui/primitives";
import { useSharedState } from "@/lib/share";
import { decodeJwt } from "@/lib/jwt";

const fmt = (sec: number) => new Date(sec * 1000).toISOString().replace("T", " ").slice(0, 19) + " UTC";

export function JwtTool() {
  const [st, set] = useSharedState({ token: "" });
  const token = st.token;
  const decoded = useMemo(() => (token.trim() ? decodeJwt(token) : null), [token]);

  return (
    <div className="space-y-4">
      <ToolBar getCopy={() => token} onClear={() => set({ token: "" })} />
      <textarea value={token} onChange={(e) => set({ token: e.target.value })} spellCheck={false}
        placeholder="Paste a JWT — header.payload.signature"
        className="h-32 w-full resize-y rounded-xl border border-border bg-surface-2 p-3 font-mono text-[13px] outline-none focus:border-accent/60" />

      {token.trim() && !decoded && (
        <div className="flex items-center gap-2 text-[13px] text-danger"><AlertCircle size={14} /> That doesn&apos;t look like a valid JWT.</div>
      )}

      {decoded && (
        <>
          {decoded.timeClaims.length > 0 && (
            <div className="rounded-2xl border border-border bg-surface p-4">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">Time claims</div>
              <div className="grid gap-1.5 sm:grid-cols-2">
                {decoded.timeClaims.map((c) => {
                  const expired = c.key === "exp" && c.value * 1000 < Date.now();
                  return (
                    <div key={c.key} className="flex items-center justify-between rounded-lg border border-border/60 bg-surface-2/60 px-3 py-2 text-[12.5px]">
                      <span className="font-mono text-muted">{c.key}</span>
                      <span className="font-mono">{fmt(c.value)} {expired && <span className="ml-1 text-danger">expired</span>}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className="grid gap-4 lg:grid-cols-2">
            {[["Header", decoded.header], ["Payload", decoded.payload]].map(([label, obj]) => (
              <div key={label as string}>
                <div className="mb-1.5 flex items-center justify-between text-[11px] uppercase tracking-wide text-muted">
                  {label as string}<CopyButton value={JSON.stringify(obj, null, 2)} label="" />
                </div>
                <pre className="h-56 overflow-auto rounded-xl border border-border bg-surface-2 p-3 font-mono text-[12.5px] whitespace-pre-wrap">{JSON.stringify(obj, null, 2)}</pre>
              </div>
            ))}
          </div>
          <p className="text-[12px] text-faint">Signature is not verified — validate it server-side with your key.</p>
        </>
      )}
    </div>
  );
}
