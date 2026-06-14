import { JsonLd } from "./JsonLd";

export function Faqs({ items }: { items: { q: string; a: string }[] }) {
  if (!items.length) return null;
  return (
    <section className="mt-12" aria-labelledby="faq-h">
      <h2 id="faq-h" className="mb-4 text-[19px] font-semibold tracking-tight">Frequently asked questions</h2>
      <dl className="divide-y divide-border/60 rounded-2xl border border-border bg-surface">
        {items.map((f) => (
          <div key={f.q} className="p-4 sm:p-5">
            <dt className="text-[14.5px] font-semibold text-fg">{f.q}</dt>
            <dd className="mt-1.5 text-[14px] leading-relaxed text-muted">{f.a}</dd>
          </div>
        ))}
      </dl>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    </section>
  );
}
