"use client";
import { useMemo } from "react";
import { ToolBar } from "@/components/app/ToolBar";
import { CopyButton } from "@/components/ui/primitives";
import { useSharedState } from "@/lib/share";

type Rgb = { r: number; g: number; b: number };
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

function hexToRgb(h: string): Rgb | null {
  h = h.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-f]{6}$/i.test(h)) return null;
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
}
const rgbToHex = ({ r, g, b }: Rgb) => "#" + [r, g, b].map((x) => clamp(Math.round(x), 0, 255).toString(16).padStart(2, "0")).join("");
function rgbToHsl({ r, g, b }: Rgb) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}
function hslToRgb(h: number, s: number, l: number): Rgb {
  h /= 360; s /= 100; l /= 100;
  if (s === 0) { const v = Math.round(l * 255); return { r: v, g: v, b: v }; }
  const hue = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return { r: Math.round(hue(p, q, h + 1 / 3) * 255), g: Math.round(hue(p, q, h) * 255), b: Math.round(hue(p, q, h - 1 / 3) * 255) };
}
function parse(v: string): Rgb | null {
  v = v.trim();
  if (!v) return null;
  if (/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) return hexToRgb(v);
  const rgb = v.match(/rgba?\(([^)]+)\)/i);
  const bare = /^[\d.\s,]+$/.test(v) ? v : null;
  const nums = (rgb?.[1] ?? bare);
  if (nums) { const p = nums.split(/[,\s/]+/).map(Number).filter((x) => !isNaN(x)); if (p.length >= 3) return { r: clamp(p[0], 0, 255), g: clamp(p[1], 0, 255), b: clamp(p[2], 0, 255) }; }
  const hsl = v.match(/hsla?\(([^)]+)\)/i);
  if (hsl) { const p = hsl[1].split(/[,\s/%]+/).map(parseFloat).filter((x) => !isNaN(x)); if (p.length >= 3) return hslToRgb(p[0], p[1], p[2]); }
  return null;
}

export function ColorTool() {
  const [st, set] = useSharedState({ value: "#3B82F6" });
  const rgb = useMemo(() => parse(st.value), [st.value]);

  const rows = rgb
    ? (() => {
        const hex = rgbToHex(rgb); const hsl = rgbToHsl(rgb);
        return [
          { label: "HEX", value: hex },
          { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
          { label: "HSL", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
        ];
      })()
    : [];

  return (
    <div className="space-y-4">
      <ToolBar getCopy={() => rows[0]?.value ?? ""} onReset={() => set({ value: "#3B82F6" })} />
      <div className="flex flex-wrap items-center gap-3">
        <div className="h-16 w-16 shrink-0 rounded-xl border border-border" style={{ background: rgb ? rgbToHex(rgb) : "transparent" }} />
        <input value={st.value} onChange={(e) => set({ value: e.target.value })} spellCheck={false}
          placeholder="#3B82F6, rgb(59,130,246) or hsl(217,91%,60%)"
          className="min-w-0 flex-1 rounded-xl border border-border bg-surface-2 px-4 py-3 font-mono text-[14px] outline-none focus:border-accent/60" />
        <input type="color" value={rgb ? rgbToHex(rgb) : "#000000"} onChange={(e) => set({ value: e.target.value })}
          aria-label="Pick a color" className="h-12 w-12 shrink-0 cursor-pointer rounded-lg border border-border bg-transparent" />
      </div>

      {rgb ? (
        <div className="flex flex-col gap-2">
          {rows.map((r) => (
            <div key={r.label} className="group flex items-center gap-3 rounded-xl border border-border/60 bg-surface-2/50 px-3.5 py-2.5">
              <span className="w-12 shrink-0 font-mono text-[12px] text-accent">{r.label}</span>
              <span className="min-w-0 flex-1 truncate font-mono text-[14px]">{r.value}</span>
              <CopyButton value={r.value} label="" className="shrink-0 opacity-0 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      ) : st.value.trim() ? <p className="text-[13px] text-danger">Couldn&apos;t parse that color.</p> : null}
    </div>
  );
}
