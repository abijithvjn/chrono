"use client";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { Section } from "../ui/primitives";
import { useStore } from "@/store/useStore";
import { fmtZone } from "@/lib/format";
import { allZones, COMMON_ZONES } from "@/lib/zones";

export function TimezoneExplorer() {
  const { ms } = useStore();
  const [zones, setZones] = useState<string[]>(COMMON_ZONES.slice(0, 7));
  const [q, setQ] = useState("");
  const pool = useMemo(() => allZones(), []);
  const matches = q ? pool.filter((z) => z.toLowerCase().includes(q.toLowerCase()) && !zones.includes(z)).slice(0, 6) : [];

  return (
    <Section title="Timezone explorer">
      <div className="relative mb-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Add a timezone…"
          className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-[13px] outline-none focus:border-accent/60" />
        {matches.length > 0 && (
          <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-border bg-surface-2 shadow-soft">
            {matches.map((z) => (
              <button key={z} onClick={() => { setZones([...zones, z]); setQ(""); }}
                className="block w-full px-3 py-2 text-left text-[13px] text-muted transition hover:bg-surface hover:text-fg">{z.replace("_", " ")}</button>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col">
        {zones.map((z) => (
          <div key={z} className="group flex items-center justify-between border-t border-border/50 py-2 first:border-0">
            <span className="text-[12.5px] text-muted">{z.replace("_", " ")}</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[12.5px]">{fmtZone(ms, z)}</span>
              <button onClick={() => setZones(zones.filter((x) => x !== z))} aria-label="Remove"
                className="opacity-0 transition group-hover:opacity-100"><X size={13} className="text-faint hover:text-danger" /></button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
