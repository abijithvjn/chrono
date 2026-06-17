export function ToolSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading tool">
      <div className="h-9 w-64 animate-pulse rounded-lg border border-border bg-surface" />
      <div className="h-72 animate-pulse rounded-2xl border border-border bg-surface" />
    </div>
  );
}
