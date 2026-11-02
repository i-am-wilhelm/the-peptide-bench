import type { LotTrace } from "@/data/lots";

/**
 * Renders a real instrument trace (HPLC / MS) as an SVG polyline.
 * Takes measured points only. Never pass synthetic data to this component.
 */
export default function Trace({ trace, accent = "var(--accent)" }: { trace: LotTrace; accent?: string }) {
  const pts = trace.points;
  if (!pts.length) return null;
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const W = 640;
  const H = 200;
  const pad = 12;
  const sx = (x: number) => pad + ((x - minX) / (maxX - minX || 1)) * (W - pad * 2);
  const sy = (y: number) => H - pad - ((y - minY) / (maxY - minY || 1)) * (H - pad * 2);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${sx(p[0]).toFixed(1)},${sy(p[1]).toFixed(1)}`).join(" ");
  return (
    <figure className="rounded-lg border border-line bg-bg-1 p-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${trace.method} trace`}>
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#grid)" />
        <path d={d} fill="none" stroke={accent} strokeWidth="1.25" />
      </svg>
      <figcaption className="label mt-2 flex justify-between">
        <span>{trace.method}</span>
        <span>
          {trace.xLabel} / {trace.yLabel}
        </span>
      </figcaption>
    </figure>
  );
}
