// Layered ambient background: base color (body) → blurred accent blobs →
// subtle masked grid → faint noise. Purely decorative, fixed, non-interactive.
export function Ambient() {
  return (
    <div className="ambient" aria-hidden>
      <div className="ambient-blob a" />
      <div className="ambient-blob b" />
      <div className="ambient-grid" />
      <div className="ambient-noise" />
    </div>
  );
}
