import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "./JsonLd";
import { SITE_URL } from "@/lib/site";

export interface Crumb { name: string; href: string; }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: SITE_URL + (c.href.endsWith("/") ? c.href : c.href + "/"),
    })),
  };
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-[12.5px] text-muted">
      {items.map((c, i) => (
        <span key={c.href} className="inline-flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={13} className="text-faint" />}
          {i < items.length - 1 ? (
            <Link href={c.href} className="hover:text-accent">{c.name}</Link>
          ) : (
            <span className="text-fg" aria-current="page">{c.name}</span>
          )}
        </span>
      ))}
      <JsonLd data={schema} />
    </nav>
  );
}
