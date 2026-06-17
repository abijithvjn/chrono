"use client";
import { Contrast, Monitor, Moon, Sun } from "lucide-react";
import { useStore, type Theme } from "@/store/useStore";
import { useMounted } from "@/lib/useMounted";

const THEMES: { id: Theme; icon: typeof Sun; label: string }[] = [
  { id: "system", icon: Monitor, label: "System" },
  { id: "light", icon: Sun, label: "Light" },
  { id: "dark", icon: Moon, label: "Dark" },
  { id: "amoled", icon: Contrast, label: "AMOLED" },
];

export function ThemeSwitch() {
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const mounted = useMounted();
  return (
    <div className="flex rounded-lg border border-border bg-surface-2 p-0.5" role="group" aria-label="Theme">
      {THEMES.map(({ id, icon: Icon, label }) => (
        <button key={id} onClick={() => setTheme(id)} title={label} aria-label={`${label} theme`} aria-pressed={mounted && theme === id}
          className={`grid h-7 w-7 place-items-center rounded-md transition ${mounted && theme === id ? "bg-accent/20 text-fg" : "text-muted hover:text-fg"}`}>
          <Icon size={14} />
        </button>
      ))}
    </div>
  );
}
