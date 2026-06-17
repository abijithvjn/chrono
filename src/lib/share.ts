"use client";
import { useEffect, useState } from "react";

export function toast(msg: string) {
  if (typeof document === "undefined") return;
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout((toast as unknown as { _t?: number })._t);
  (toast as unknown as { _t?: number })._t = window.setTimeout(() => el.classList.remove("show"), 1400);
}

export async function copyText(text: string, note = "Copied") {
  try { await navigator.clipboard.writeText(text); }
  catch {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
  }
  toast(note);
}

function enc(obj: unknown): string { return btoa(unescape(encodeURIComponent(JSON.stringify(obj)))); }
function dec(s: string): unknown { return JSON.parse(decodeURIComponent(escape(atob(s)))); }

// Sync a small object of tool state to the URL hash (#s=...) for shareable links.
// Skips encoding when the payload is too large for a URL.
export function useSharedState<T extends Record<string, string>>(initial: T) {
  const [state, setState] = useState<T>(initial);

  useEffect(() => {
    try {
      const h = new URLSearchParams(window.location.hash.slice(1)).get("s");
      if (h) setState((prev) => ({ ...prev, ...(dec(h) as Partial<T>) }));
    } catch { /* ignore bad hash */ }
  }, []);

  const update = (patch: Partial<T>) =>
    setState((prev) => {
      const next = { ...prev, ...patch };
      try {
        const encoded = enc(next);
        const p = new URLSearchParams(window.location.hash.slice(1));
        if (encoded.length < 1800) p.set("s", encoded); else p.delete("s");
        const h = p.toString();
        window.history.replaceState(null, "", h ? "#" + h : window.location.pathname);
      } catch { /* ignore */ }
      return next;
    });

  return [state, update] as const;
}

export function shareCurrentUrl() {
  copyText(window.location.href, "Shareable link copied");
}
