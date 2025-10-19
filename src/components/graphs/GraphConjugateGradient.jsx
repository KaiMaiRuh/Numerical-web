import React from "react";

function niceNumber(x) {
  if (!isFinite(x)) return "-";
  return Number.isInteger(x) ? x : x.toFixed(6);
}

export default function GraphConjugateGradient({ iterations = [], className = "", width = 800, height = 320 }) {
  const errors = iterations.map((it) => (it && typeof it.error === "number" ? it.error : NaN)).filter((e) => isFinite(e));
  if (!errors || errors.length === 0) {
    return (
      <div className={className} style={{ width, height, display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a", color: "#94a3b8" }}>
        <div>No convergence data yet</div>
      </div>
    );
  }

  const w = width;
  const h = height;
  const padding = 24;
  const maxE = Math.max(...errors);
  const minE = Math.min(...errors);
  const span = maxE - minE || 1;

  const points = errors.map((e, i) => {
    const x = padding + (i / (errors.length - 1)) * (w - padding * 2);
    const y = padding + ((maxE - e) / span) * (h - padding * 2);
    return [x, y];
  });

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]} ${p[1]}`).join(" ");

  return (
    <div className={className} style={{ width, height, background: "#0f172a", padding: 6 }}>
      <svg width={w} height={h}>
        <rect x={0} y={0} width={w} height={h} rx={8} ry={8} fill="#0b1220" />
        {/* grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
          <line key={i} x1={padding} x2={w - padding} y1={padding + t * (h - padding * 2)} y2={padding + t * (h - padding * 2)} stroke="#111827" strokeWidth={1} />
        ))}
        {/* path */}
        <path d={path} fill="none" stroke="#60a5fa" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {/* points */}
        {points.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={3} fill="#60a5fa" />
        ))}
        {/* labels */}
        <text x={padding} y={12} fill="#94a3b8" fontSize={10}>Error (norm)</text>
        <text x={w - padding} y={h - 6} fill="#94a3b8" fontSize={10} textAnchor="end">iters: {errors.length}</text>
      </svg>
    </div>
  );
}
