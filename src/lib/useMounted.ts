import { useEffect, useState } from "react";

// false during SSR and the first client render, true after mount.
// Gating time-dependent UI on this avoids server/client hydration mismatches.
export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}
