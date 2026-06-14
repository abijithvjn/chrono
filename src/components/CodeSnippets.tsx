"use client";
import { useState } from "react";
import { Section, CopyButton } from "./ui/primitives";
import { LANGS, snippet, type Lang } from "@/lib/snippets";
import { useStore } from "@/store/useStore";

export function CodeSnippets() {
  const { ms } = useStore();
  const [lang, setLang] = useState<Lang>("TypeScript");
  const s = Math.floor(ms / 1000);
  const code = snippet(lang, s, ms, new Date(ms).toISOString());

  return (
    <Section title="Code snippet" action={<CopyButton value={code} />}>
      <div className="-mx-1 mb-3 flex flex-wrap gap-1">
        {LANGS.map((l) => (
          <button key={l} onClick={() => setLang(l)}
            className={`rounded-lg px-2.5 py-1 text-[11.5px] transition ${lang === l ? "bg-accent/20 text-fg" : "text-muted hover:text-fg"}`}>
            {l}
          </button>
        ))}
      </div>
      <pre className="overflow-x-auto rounded-xl border border-border/60 bg-surface-2 p-4 font-mono text-[12.5px] leading-relaxed text-fg whitespace-pre">{code}</pre>
    </Section>
  );
}
