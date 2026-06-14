"use client";
import { Header } from "./Header";
import { Converter } from "./Converter";
import { LiveClock } from "./LiveClock";
import { CodeSnippets } from "./CodeSnippets";
import { TimezoneExplorer } from "./tools/TimezoneExplorer";
import { OffsetCalc, DurationCalc, RelativeCalc } from "./tools/OffsetDuration";
import { CronPreview } from "./tools/CronPreview";
import { BatchConverter } from "./tools/BatchConverter";
import { History } from "./tools/History";
import { SiteFooter } from "./PageShell";
import { useMounted } from "@/lib/useMounted";

export function Studio() {
  const mounted = useMounted();

  return (
    <div className="min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10"
        style={{ background: "radial-gradient(1000px 520px at 85% -8%, var(--accent-glow), transparent 60%), radial-gradient(760px 460px at 0% 0%, color-mix(in srgb, var(--accent-2) 12%, transparent), transparent 55%)" }} />
      <Header />
      <main className="w-full px-5 py-8 sm:px-8 lg:px-12">
        <h1 className="sr-only">Unix Timestamp Converter — epoch time to date, ISO 8601, and back</h1>
        {!mounted ? (
          <div className="space-y-5">
            <div className="h-44 animate-pulse rounded-2xl border border-border bg-surface" />
            <div className="h-64 animate-pulse rounded-2xl border border-border bg-surface" />
          </div>
        ) : (
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
        )}

      </main>
      <SiteFooter />
    </div>
  );
}
