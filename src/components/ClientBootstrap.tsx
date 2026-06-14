"use client";
import { useEffect } from "react";
import { useStore } from "@/store/useStore";

export function ClientBootstrap() {
  const theme = useStore((s) => s.theme);
  const setMoment = useStore((s) => s.setMoment);
  const setPalette = useStore((s) => s.setPalette);

  // apply theme
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);

  // restore moment from shareable URL hash (#t=<ms>)
  useEffect(() => {
    const m = window.location.hash.match(/t=(-?\d+)/);
    if (m) setMoment(parseInt(m[1], 10), undefined, "");
  }, [setMoment]);

  // global keyboard: Cmd/Ctrl+K → command palette
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette(!useStore.getState().paletteOpen);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setPalette]);

  // register PWA service worker (basePath-aware for GitHub Pages sub-folders)
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
      navigator.serviceWorker.register(`${base}/sw.js`).catch(() => {});
    }
  }, []);

  return null;
}
