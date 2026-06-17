"use client";
import { useMounted } from "@/lib/useMounted";
import { LiveClock } from "@/components/LiveClock";
import { Converter } from "@/components/Converter";
import { CodeSnippets } from "@/components/CodeSnippets";
import { TimezoneExplorer } from "@/components/tools/TimezoneExplorer";
import { OffsetCalc, DurationCalc, RelativeCalc } from "@/components/tools/OffsetDuration";
import { CronPreview } from "@/components/tools/CronPreview";
import { BatchConverter } from "@/components/tools/BatchConverter";
import { History } from "@/components/tools/History";

// The full Epoch Converter experience, unchanged — now embeddable as one tool
// inside the platform shell.
export function EpochTool() {
  const mounted = useMounted();
  if (!mounted) {
    return (
      <div className="space-y-5">
        <div className="h-44 animate-pulse rounded-2xl border border-border bg-surface" />
        <div className="h-64 animate-pulse rounded-2xl border border-border bg-surface" />
      </div>
    );
  }
  return (
    <div className="space-y-5">
      <LiveClock />
      <Converter />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <TimezoneExplorer />
        <OffsetCalc />
        <DurationCalc />
        <RelativeCalc />
        <CronPreview />
        <History />
        <div className="md:col-span-2 xl:col-span-3"><BatchConverter /></div>
      </div>
      <CodeSnippets />
    </div>
  );
}
