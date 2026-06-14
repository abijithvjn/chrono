// Compact standard 5-field cron parser + next-run finder (UTC).
// fields: minute hour day-of-month month day-of-week

function parseField(f: string, min: number, max: number): Set<number> {
  const out = new Set<number>();
  for (const part of f.split(",")) {
    let step = 1, range = part;
    const slash = part.split("/");
    if (slash.length === 2) { range = slash[0]; step = parseInt(slash[1], 10) || 1; }
    let lo = min, hi = max;
    if (range !== "*" && range !== "") {
      const dash = range.split("-");
      lo = parseInt(dash[0], 10);
      hi = dash.length === 2 ? parseInt(dash[1], 10) : lo;
    }
    if (isNaN(lo) || isNaN(hi)) throw new Error("bad field");
    for (let v = lo; v <= hi; v += step) if (v >= min && v <= max) out.add(v);
  }
  return out;
}

export interface Cron { mi: Set<number>; ho: Set<number>; dom: Set<number>; mo: Set<number>; dow: Set<number>; }

export function parseCron(expr: string): Cron {
  const f = expr.trim().split(/\s+/);
  if (f.length !== 5) throw new Error("Cron needs 5 fields: min hour dom month dow");
  return {
    mi: parseField(f[0], 0, 59), ho: parseField(f[1], 0, 23),
    dom: parseField(f[2], 1, 31), mo: parseField(f[3], 1, 12),
    dow: parseField(f[4], 0, 6), // 0 = Sunday
  };
}

export function nextRuns(expr: string, from: number, count = 5): number[] {
  const c = parseCron(expr);
  const out: number[] = [];
  const d = new Date(Math.ceil(from / 60000) * 60000); // next whole minute, UTC
  let guard = 0;
  while (out.length < count && guard < 750000) {
    guard++;
    if (
      c.mi.has(d.getUTCMinutes()) && c.ho.has(d.getUTCHours()) &&
      c.mo.has(d.getUTCMonth() + 1) &&
      (c.dom.has(d.getUTCDate()) || c.dow.has(d.getUTCDay()))
    ) out.push(d.getTime());
    d.setUTCMinutes(d.getUTCMinutes() + 1);
  }
  return out;
}
