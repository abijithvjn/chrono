import Link from "next/link";
import { TOOLS, toolBySlug } from "@/tools/registry";

// Internal linking that also replaces the old sidebar: same-category tools first.
export function RelatedTools({ current }: { current: string }) {
  const cur = toolBySlug(current);
  const rest = TOOLS.filter((t) => t.slug !== current);
  const ordered = [
    ...rest.filter((t) => cur && t.category === cur.category),
    ...rest.filter((t) => !cur || t.category !== cur.category),
  ].slice(0, 5);

  return (
    <section className="mt-10" aria-labelledby="related-h">
      <h2 id="related-h" className="mb-3 text-[17px] font-semibold tracking-tight">Related tools</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ordered.map((t) => (
          <Link key={t.slug} href={`/${t.slug}`}
            className="group flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 transition hover:-translate-y-0.5 hover:border-accent/50">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border bg-surface-2 text-accent">
              <t.icon size={16} />
            </span>
            <div className="min-w-0">
              <div className="text-[14px] font-semibold">{t.name}</div>
              <div className="mt-0.5 line-clamp-2 text-[12.5px] text-muted">{t.short}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
