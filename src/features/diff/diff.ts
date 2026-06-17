export interface LineOp { type: "eq" | "add" | "del"; a?: string; b?: string; }

// Classic LCS line diff. `key` lets callers normalize (ignore case/whitespace)
// for comparison while preserving the original text for display.
export function diffLines(aLines: string[], bLines: string[], key: (s: string) => string): LineOp[] {
  const a = aLines, b = bLines;
  const ak = a.map(key), bk = b.map(key);
  const n = a.length, m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      dp[i][j] = ak[i] === bk[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);

  const out: LineOp[] = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (ak[i] === bk[j]) { out.push({ type: "eq", a: a[i], b: b[j] }); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { out.push({ type: "del", a: a[i] }); i++; }
    else { out.push({ type: "add", b: b[j] }); j++; }
  }
  while (i < n) out.push({ type: "del", a: a[i++] });
  while (j < m) out.push({ type: "add", b: b[j++] });
  return out;
}
