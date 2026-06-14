"use client";
import { History as HistoryIcon } from "lucide-react";
import { Section } from "../ui/primitives";
import { useStore } from "@/store/useStore";
import { fmtZone } from "@/lib/format";

export function History() {
  const { history, setMoment } = useStore();
  return (
    <Section title="Recent">
      {history.length === 0 ? (
        <div className="flex items-center gap-2 py-4 text-[12.5px] text-faint">
          <HistoryIcon size={14} /> Conversions you make appear here.
        </div>
      ) : (
        <div className="flex flex-col">
          {history.map((h, i) => (
            <button key={i} onClick={() => setMoment(h.ms, undefined, h.input)}
              className="group flex items-center justify-between gap-3 border-t border-border/50 py-2 text-left first:border-0">
              <span className="truncate font-mono text-[12.5px] text-fg">{h.input}</span>
              <span className="shrink-0 text-[11px] text-muted group-hover:text-accent">{fmtZone(h.ms, "UTC")}</span>
            </button>
          ))}
        </div>
      )}
    </Section>
  );
}
