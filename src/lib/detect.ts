import * as chrono from "chrono-node";
import { looksLikeJwt, decodeJwt, type JwtInfo } from "./jwt";

export type DetectKind =
  | "epoch-s" | "epoch-ms" | "epoch-us" | "epoch-ns"
  | "iso" | "date" | "natural" | "jwt" | "json" | "extracted";

export interface JsonHit { path: string; raw: string; ms: number; }

export interface Detection {
  ms: number;
  ns: bigint;
  kind: DetectKind;
  label: string;     // human description of what was detected
  jwt?: JwtInfo;
  jsonHits?: JsonHit[];
}

const unitFromDigits = (d: number) => (d <= 11 ? "s" : d <= 14 ? "ms" : d <= 17 ? "us" : "ns");

function epochToParts(nStr: string, unit: "s" | "ms" | "us" | "ns") {
  const n = BigInt(nStr);
  const ns = unit === "s" ? n * 1_000_000_000n
    : unit === "ms" ? n * 1_000_000n
    : unit === "us" ? n * 1_000n : n;
  return { ms: Number(ns / 1_000_000n), ns };
}

function fromMs(ms: number): { ms: number; ns: bigint } {
  return { ms, ns: BigInt(Math.round(ms)) * 1_000_000n };
}

// Walk a parsed JSON value collecting timestamp-looking fields.
function scanJson(value: unknown, path: string, out: JsonHit[]) {
  if (out.length > 40) return;
  if (typeof value === "number" && Number.isFinite(value)) {
    const digits = Math.trunc(Math.abs(value)).toString().length;
    if (digits >= 9 && digits <= 19) {
      const { ms } = epochToParts(String(Math.trunc(value)), unitFromDigits(digits));
      const y = new Date(ms).getUTCFullYear();
      if (y >= 1990 && y <= 2100) out.push({ path, raw: String(value), ms });
    }
  } else if (typeof value === "string") {
    const t = Date.parse(value);
    if (!isNaN(t) && /\d{4}-\d{2}-\d{2}|T\d{2}:\d{2}/.test(value)) out.push({ path, raw: value, ms: t });
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => scanJson(v, `${path}[${i}]`, out));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) scanJson(v, path ? `${path}.${k}` : k, out);
  }
}

export function detect(input: string, unitOverride: "auto" | "s" | "ms" | "us" | "ns" = "auto"): Detection | null {
  const str = input.trim();
  if (!str) return null;

  // 1) pure integer → epoch
  if (/^-?\d+$/.test(str)) {
    const digits = str.replace("-", "").length;
    const unit = (unitOverride === "auto" ? unitFromDigits(digits) : unitOverride) as "s" | "ms" | "us" | "ns";
    const { ms, ns } = epochToParts(str, unit);
    return { ms, ns, kind: `epoch-${unit}` as DetectKind, label: `Unix ${unit === "us" ? "µs" : unit}` };
  }

  // 2) JWT
  if (looksLikeJwt(str)) {
    const jwt = decodeJwt(str);
    if (jwt && jwt.timeClaims.length) {
      const pick = jwt.timeClaims.find((c) => c.key === "iat") ?? jwt.timeClaims[0];
      return { ...fromMs(pick.value * 1000), kind: "jwt", label: `JWT · ${jwt.timeClaims.length} time claim(s)`, jwt };
    }
    if (jwt) return { ...fromMs(Date.now()), kind: "jwt", label: "JWT · no time claims", jwt };
  }

  // 3) JSON
  if (/^[\[{]/.test(str)) {
    try {
      const parsed = JSON.parse(str);
      const hits: JsonHit[] = [];
      scanJson(parsed, "", hits);
      if (hits.length) return { ...fromMs(hits[0].ms), kind: "json", label: `JSON · ${hits.length} timestamp field(s)`, jsonHits: hits };
    } catch { /* not valid json, fall through */ }
  }

  // 4) ISO / RFC fast path
  const direct = Date.parse(str);
  if (!isNaN(direct) && /\d{4}-\d{2}-\d{2}|\d{2}:\d{2}/.test(str) && str.length < 40) {
    return { ...fromMs(direct), kind: "iso", label: "ISO / RFC date" };
  }

  // 5) chrono — natural language, and extraction from logs/URLs/free text
  const results = chrono.parse(str);
  // also pull standalone epoch integers from free text (chrono misses raw unix)
  const intMatch = str.match(/\b\d{9,19}\b/);
  let epochCand: { ms: number; idx: number } | null = null;
  if (intMatch && intMatch.index != null) {
    const d = intMatch[0].length;
    epochCand = { ms: epochToParts(intMatch[0], unitFromDigits(d)).ms, idx: intMatch.index };
  }
  if (results.length || epochCand) {
    const chronoCand = results.length ? { ms: results[0].start.date().getTime(), idx: results[0].index } : null;
    const chosen = !chronoCand ? epochCand!
      : !epochCand ? chronoCand
      : epochCand.idx <= chronoCand.idx ? epochCand : chronoCand;
    const fromText = str.length > 30 || results.length > 1 || (intMatch && str.length !== intMatch[0].length);
    return {
      ...fromMs(chosen.ms),
      kind: fromText ? "extracted" : "natural",
      label: fromText ? "Extracted from text" : "Natural language",
    };
  }

  return null;
}
