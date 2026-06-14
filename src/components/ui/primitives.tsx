"use client";
import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/cn";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-2xl border border-border bg-surface backdrop-blur-xl shadow-soft", className)}>
      {children}
    </div>
  );
}

export function Section({ title, action, children, className }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-[13px] font-semibold tracking-tight text-fg">{title}</h3>
        {action}
      </div>
      {children}
    </Card>
  );
}

export function CopyButton({ value, className, label }: { value: string; className?: string; label?: string }) {
  const [done, setDone] = useState(false);
  async function go() {
    try { await navigator.clipboard.writeText(value); }
    catch {
      const ta = document.createElement("textarea");
      ta.value = value; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
    }
    setDone(true); setTimeout(() => setDone(false), 1100);
  }
  return (
    <button onClick={go} aria-label={`Copy ${label ?? value}`}
      className={cn("inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[11px] text-muted transition hover:text-accent hover:border-accent/50", className)}>
      {done ? <Check size={12} className="text-good" /> : <Copy size={12} />}
      {label ?? (done ? "Copied" : "Copy")}
    </button>
  );
}

export function IconButton({ children, onClick, title, className }: { children: ReactNode; onClick?: () => void; title?: string; className?: string }) {
  return (
    <button onClick={onClick} title={title} aria-label={title}
      className={cn("grid h-8 w-8 place-items-center rounded-lg border border-border bg-surface-2 text-muted transition hover:text-fg hover:border-accent/50", className)}>
      {children}
    </button>
  );
}
