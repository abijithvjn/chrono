"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pipette } from "lucide-react";
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
// HSV (what the saturation/value square uses)
function rgbToHsv({ r, g, b }: Rgb) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d) { h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
  return { h, s: max === 0 ? 0 : d / max, v: max };
}
function hsvToRgb(h: number, s: number, v: number): Rgb {
  const c = v * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; } else if (h < 120) { r = x; g = c; } else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; } else if (h < 300) { r = x; b = c; } else { r = c; b = x; }
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
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

function drag(e: React.PointerEvent, fn: (cx: number, cy: number) => void) {
  e.preventDefault();
  fn(e.clientX, e.clientY);
  const move = (ev: PointerEvent) => fn(ev.clientX, ev.clientY);
  const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}

function ColorPicker({ rgb, onChange }: { rgb: Rgb; onChange: (r: Rgb) => void }) {
  const { h, s, v } = rgbToHsv(rgb);
  const svRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);

  const onSV = (cx: number, cy: number) => {
    const r = svRef.current?.getBoundingClientRect(); if (!r) return;
    onChange(hsvToRgb(h, clamp((cx - r.left) / r.width, 0, 1), 1 - clamp((cy - r.top) / r.height, 0, 1)));
  };
  const onHue = (cx: number) => {
    const r = hueRef.current?.getBoundingClientRect(); if (!r) return;
    onChange(hsvToRgb(clamp((cx - r.left) / r.width, 0, 1) * 360, s || 1, v || 1));
  };

  return (
    <div className="flex flex-1 flex-col gap-3">
      <div ref={svRef} onPointerDown={(e) => drag(e, (x, y) => onSV(x, y))}
        className="relative h-48 w-full cursor-crosshair touch-none rounded-xl border border-border"
        style={{ background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${h}, 100%, 50%))` }}>
        <span className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,.4)]"
          style={{ left: `${s * 100}%`, top: `${(1 - v) * 100}%`, background: rgbToHex(rgb) }} />
      </div>
      <div ref={hueRef} onPointerDown={(e) => drag(e, (x) => onHue(x))}
        className="relative h-4 w-full cursor-pointer touch-none rounded-full"
        style={{ background: "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)" }}>
        <span className="pointer-events-none absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,.4)]"
          style={{ left: `${(h / 360) * 100}%`, background: `hsl(${h}, 100%, 50%)` }} />
      </div>
    </div>
  );
}

export function ColorTool() {
  const [st, set] = useSharedState({ value: "#3B82F6" });
  const rgb = useMemo(() => parse(st.value), [st.value]);
  const current = rgb ?? { r: 59, g: 130, b: 246 };
  const hex = rgbToHex(current);
  const hsl = rgbToHsl(current);
  const rows = [
    { label: "HEX", value: rgbToHex(current) },
    { label: "RGB", value: `rgb(${current.r}, ${current.g}, ${current.b})` },
    { label: "HSL", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
  ];

  const [hasEyeDropper, setHasEyeDropper] = useState(false);
  useEffect(() => { setHasEyeDropper(typeof window !== "undefined" && "EyeDropper" in window); }, []);
  async function pickFromScreen() {
    try {
      const ED = (window as unknown as { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper;
      const res = await new ED().open();
      set({ value: res.sRGBHex });
    } catch { /* user cancelled */ }
  }

  return (
    <div className="space-y-4">
      <ToolBar getCopy={() => rows[0].value} onReset={() => set({ value: "#3B82F6" })}>
        {hasEyeDropper && (
          <button onClick={pickFromScreen} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-2.5 py-1.5 text-[12.5px] text-muted transition hover:text-fg">
            <Pipette size={13} /> Eyedropper
          </button>
        )}
      </ToolBar>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-44">
          <div className="h-48 w-full rounded-xl border border-border shadow-soft" style={{ background: hex }} />
          <div className="text-center font-mono text-[12.5px] text-muted">{hex}</div>
        </div>
        <ColorPicker rgb={current} onChange={(r) => set({ value: rgbToHex(r) })} />
      </div>

      <input value={st.value} onChange={(e) => set({ value: e.target.value })} spellCheck={false}
        placeholder="#3B82F6, rgb(59,130,246) or hsl(217,91%,60%)"
        className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 font-mono text-[14px] outline-none focus:border-accent/60" />
      {!rgb && st.value.trim() && <p className="text-[13px] text-danger">Couldn&apos;t parse that color — picker shows the last valid one.</p>}

      <div className="flex flex-col gap-2">
        {rows.map((r) => (
          <div key={r.label} className="group flex items-center gap-3 rounded-xl border border-border/60 bg-surface-2/50 px-3.5 py-2.5">
            <span className="w-12 shrink-0 font-mono text-[12px] text-accent">{r.label}</span>
            <span className="min-w-0 flex-1 truncate font-mono text-[14px]">{r.value}</span>
            <CopyButton value={r.value} label="" className="shrink-0 opacity-0 group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
