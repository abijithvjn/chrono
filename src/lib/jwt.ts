// Minimal JWT decoder (no verification — inspection only).
export interface JwtInfo {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  timeClaims: { key: string; value: number }[];
}

function b64urlDecode(s: string): string {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  if (typeof atob !== "undefined") return decodeURIComponent(escape(atob(s)));
  return Buffer.from(s, "base64").toString("utf8");
}

export function looksLikeJwt(str: string): boolean {
  return /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*$/.test(str.trim());
}

export function decodeJwt(str: string): JwtInfo | null {
  const parts = str.trim().split(".");
  if (parts.length < 2) return null;
  try {
    const header = JSON.parse(b64urlDecode(parts[0]));
    const payload = JSON.parse(b64urlDecode(parts[1]));
    const keys = ["iat", "exp", "nbf", "auth_time", "updated_at"];
    const timeClaims = keys
      .filter((k) => typeof payload[k] === "number")
      .map((k) => ({ key: k, value: payload[k] as number }));
    return { header, payload, timeClaims };
  } catch {
    return null;
  }
}
