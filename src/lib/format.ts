// All output representations of a single moment (ms + full-precision ns).

export interface Repr { key: string; label: string; value: string; group: "human" | "machine" | "encoded"; accent?: boolean; }

const pad = (n: number, w = 2) => String(Math.abs(n)).padStart(w, "0");

export function fmtZone(ms: number, tz: string, withZone = true): string {
  try {
    const o: Intl.DateTimeFormatOptions = {
      weekday: "short", year: "numeric", month: "short", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: tz,
    };
    if (withZone) o.timeZoneName = "short";
    return new Intl.DateTimeFormat("en-GB", o).format(new Date(ms));
  } catch { return "—"; }
}

export function offsetMinutes(ms: number, tz: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  });
  const p = Object.fromEntries(dtf.formatToParts(new Date(ms)).map((x) => [x.type, x.value]));
  const h = p.hour === "24" ? 0 : +p.hour;
  const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, h, +p.minute, +p.second);
  return Math.round((asUtc - Math.floor(ms / 1000) * 1000) / 60000);
}

export function isoWithOffset(ms: number, tz: string): string {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  });
  const p = Object.fromEntries(dtf.formatToParts(new Date(ms)).map((x) => [x.type, x.value]));
  const h = p.hour === "24" ? "00" : p.hour;
  const off = offsetMinutes(ms, tz);
  const sign = off >= 0 ? "+" : "-";
  const tail = tz === "UTC" || off === 0 ? "Z" : `${sign}${pad(off / 60 | 0)}:${pad(Math.abs(off) % 60)}`;
  return `${p.year}-${p.month}-${p.day}T${h}:${p.minute}:${p.second}${tail}`;
}

export function relative(ms: number, now = Date.now()): string {
  const diff = ms - now, past = diff < 0;
  let s = Math.abs(diff) / 1000;
  const units: [string, number][] = [["year", 31557600], ["month", 2629800], ["day", 86400], ["hour", 3600], ["minute", 60], ["second", 1]];
  for (const [name, sec] of units) {
    if (s >= sec || name === "second") {
      const v = Math.floor(s / sec);
      return `${v} ${name}${v === 1 ? "" : "s"} ${past ? "ago" : "from now"}`;
    }
  }
  return "now";
}

export function localTzName(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

// Deterministic, UTC-based representations safe to render at build/SSR time
// (no "now"-relative or local-zone fields that would vary by machine).
export function machineReprs(ms: number, ns: bigint): { label: string; value: string }[] {
  const s = ns / 1_000_000_000n;
  const abs = s < 0n ? -s : s;
  return [
    { label: "UTC", value: fmtZone(ms, "UTC") },
    { label: "ISO 8601 (UTC)", value: new Date(ms).toISOString() },
    { label: "RFC 3339 (UTC)", value: isoWithOffset(ms, "UTC") },
    { label: "RFC 2822", value: new Date(ms).toUTCString().replace("GMT", "+0000") },
    { label: "Unix seconds", value: s.toString() },
    { label: "Unix milliseconds", value: (ns / 1_000_000n).toString() },
    { label: "Microseconds", value: (ns / 1_000n).toString() },
    { label: "Nanoseconds", value: ns.toString() },
    { label: "Hex (seconds)", value: "0x" + abs.toString(16) },
    { label: "Binary (seconds)", value: abs.toString(2) },
  ];
}

export function representations(ms: number, ns: bigint, displayTz: string): Repr[] {
  const local = localTzName();
  const s = ns / 1_000_000_000n;
  const us = ns / 1_000n;
  const off = offsetMinutes(ms, local);
  const offStr = `${off >= 0 ? "+" : "-"}${pad(off / 60 | 0)}:${pad(Math.abs(off) % 60)}`;
  return [
    { key: "local", label: `Local · ${local}`, value: fmtZone(ms, local), group: "human", accent: true },
    { key: "utc", label: "UTC", value: fmtZone(ms, "UTC"), group: "human" },
    { key: "zone", label: `Zone · ${displayTz}`, value: fmtZone(ms, displayTz), group: "human" },
    { key: "rel", label: "Relative", value: relative(ms), group: "human" },
    { key: "iso", label: "ISO 8601 (UTC)", value: new Date(ms).toISOString(), group: "machine", accent: true },
    { key: "rfc3339", label: "RFC 3339 (local)", value: isoWithOffset(ms, local), group: "machine" },
    { key: "rfc2822", label: "RFC 2822", value: new Date(ms).toUTCString().replace("GMT", "+0000"), group: "machine" },
    { key: "s", label: "Unix seconds", value: s.toString(), group: "machine", accent: true },
    { key: "ms", label: "Unix millis", value: (ns / 1_000_000n).toString(), group: "machine" },
    { key: "us", label: "Microseconds", value: us.toString(), group: "machine" },
    { key: "ns", label: "Nanoseconds", value: ns.toString(), group: "machine" },
    { key: "hex", label: "Hex (seconds)", value: "0x" + (s < 0n ? "-" : "") + (s < 0n ? -s : s).toString(16), group: "encoded" },
    { key: "bin", label: "Binary (seconds)", value: (s < 0n ? -s : s).toString(2), group: "encoded" },
    { key: "tz", label: "Timezone", value: `${local} (UTC${offStr})`, group: "encoded" },
  ];
}
