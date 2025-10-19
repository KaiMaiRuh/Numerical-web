import React, { useMemo, useRef, useState, useEffect } from "react";

// Responsive scatter + regression line. Pass either (a,b) for y = a + b x or a fitFunc(x).
// New: support multiple series overlay. Each item: { xs, ys, a, b, fitFunc, pointColor, lineColor, label }
export default function GraphSimpleRegression({
  xs = [],
  ys = [],
  a = null,
  b = null,
  fitFunc = null,
  className = "",
  pointColor = "#38bdf8",
  lineColor = "#f59e0b",
  series = null,
  showLegend = true,
}) {
  const hasDataSingle = Array.isArray(xs) && Array.isArray(ys) && xs.length > 0 && xs.length === ys.length;
  const hasSeries = Array.isArray(series) && series.length > 0;
  const normalizedSeries = hasSeries
    ? series
    : [{ xs, ys, a, b, fitFunc, pointColor, lineColor, label: undefined }];

  // Compute bounds with padding
  const dataBounds = useMemo(() => {
    if (!normalizedSeries.length) return { xMin: 0, xMax: 1, yMin: 0, yMax: 1 };
    let xmin = Infinity, xmax = -Infinity, ymin = Infinity, ymax = -Infinity;
    normalizedSeries.forEach((s) => {
      const xsArr = s.xs || [];
      const ysArr = s.ys || [];
      if (xsArr.length && xsArr.length === ysArr.length) {
        xmin = Math.min(xmin, ...xsArr);
        xmax = Math.max(xmax, ...xsArr);
        ymin = Math.min(ymin, ...ysArr);
        ymax = Math.max(ymax, ...ysArr);
      }
      const f = s.fitFunc || (s.a != null && s.b != null ? (x) => s.a + s.b * x : null);
      if (f && Number.isFinite(xmin) && Number.isFinite(xmax)) {
        const y1 = f(xmin);
        const y2 = f(xmax);
        if (Number.isFinite(y1) && Number.isFinite(y2)) {
          ymin = Math.min(ymin, y1, y2);
          ymax = Math.max(ymax, y1, y2);
        }
      }
    });
    if (!isFinite(xmin) || !isFinite(xmax) || xmin === xmax) { xmin = 0; xmax = 1; }
    if (!isFinite(ymin) || !isFinite(ymax) || ymin === ymax) { ymin = 0; ymax = 1; }
    const padX = (xmax - xmin) * 0.1;
    const padY = (ymax - ymin) * 0.1;
    return { xMin: xmin - padX, xMax: xmax + padX, yMin: ymin - padY, yMax: ymax + padY };
  }, [normalizedSeries]);

  // Viewport state for interactions (zoom, pan)
  const [vp, setVp] = useState(dataBounds);
  useEffect(() => {
    setVp(dataBounds);
  }, [dataBounds.xMin, dataBounds.xMax, dataBounds.yMin, dataBounds.yMax]);

  // Utility for nice tick steps (similar spirit to GraphRoot)
  const niceStep = (range) => {
    const rough = Math.pow(10, Math.floor(Math.log10(Math.max(range, 1e-9))));
    const r = range / rough;
    if (r < 1.5) return rough * 0.1;
    if (r < 3) return rough * 0.2;
    if (r < 7) return rough * 0.5;
    return rough;
  };

  // Scales based on SVG viewBox with margins for labels
  const margins = { left: 60, right: 20, top: 20, bottom: 28 };
  const viewW = 800;
  const viewH = 400;
  const innerW = viewW - margins.left - margins.right;
  const innerH = viewH - margins.top - margins.bottom;
  const scaleX = (x) => margins.left + ((x - vp.xMin) / (vp.xMax - vp.xMin)) * innerW;
  const scaleY = (y) => margins.top + (1 - (y - vp.yMin) / (vp.yMax - vp.yMin)) * innerH;

  // Helpers to convert client coords to viewBox coords and then to world
  const svgRef = useRef(null);
  const toViewPoint = (e) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0, rect: null };
    const rect = svg.getBoundingClientRect();
    const vx = ((e.clientX - rect.left) / rect.width) * viewW;
    const vy = ((e.clientY - rect.top) / rect.height) * viewH;
    return { x: vx, y: vy, rect };
  };
  const viewToWorld = (vx, vy) => {
    const x = vp.xMin + ((vx - margins.left) / innerW) * (vp.xMax - vp.xMin);
    const y = vp.yMin + (1 - (vy - margins.top) / innerH) * (vp.yMax - vp.yMin);
    return { x, y };
  };

  // Interactions: zoom (wheel), pan (drag), reset (dblclick)
  const draggingRef = useRef(false);
  const lastViewPosRef = useRef({ x: 0, y: 0 });
  const onWheel = (e) => {
    e.preventDefault();
    const { x: vx, y: vy } = toViewPoint(e);
    const { x: wx, y: wy } = viewToWorld(vx, vy);
    const zoom = Math.exp(-e.deltaY * 0.0015);
    setVp((cur) => ({
      xMin: wx - (wx - cur.xMin) * zoom,
      xMax: wx + (cur.xMax - wx) * zoom,
      yMin: wy - (wy - cur.yMin) * zoom,
      yMax: wy + (cur.yMax - wy) * zoom,
    }));
  };
  const onMouseDown = (e) => {
    draggingRef.current = true;
    const { x: vx, y: vy } = toViewPoint(e);
    lastViewPosRef.current = { x: vx, y: vy };
  };
  const onMouseMove = (e) => {
    if (!draggingRef.current) return;
    const { x: vx, y: vy } = toViewPoint(e);
    const { x: lx, y: ly } = lastViewPosRef.current;
    lastViewPosRef.current = { x: vx, y: vy };
    const dxView = vx - lx;
    const dyView = vy - ly;
    setVp((cur) => {
      const xRange = cur.xMax - cur.xMin || 1;
      const yRange = cur.yMax - cur.yMin || 1;
      return {
        xMin: cur.xMin - (dxView / innerW) * xRange,
        xMax: cur.xMax - (dxView / innerW) * xRange,
        yMin: cur.yMin + (dyView / innerH) * yRange,
        yMax: cur.yMax + (dyView / innerH) * yRange,
      };
    });
  };
  const endDrag = () => {
    draggingRef.current = false;
  };
  const onDblClick = () => {
    setVp(dataBounds);
  };

  const f = hasSeries ? null : (fitFunc || (a != null && b != null ? (x) => a + b * x : null));

  return (
    <div className={className + " overflow-hidden rounded bg-slate-900"} style={{ width: "100%", height: "100%" }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${viewW} ${viewH}`}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseLeave={endDrag}
        onMouseUp={endDrag}
        onDoubleClick={onDblClick}
        style={{ cursor: draggingRef.current ? "grabbing" : "default" }}
      >
        {/* background */}
        <rect x="0" y="0" width={viewW} height={viewH} fill="#0f172a" />

        {/* Plot area border */}
        <rect x={margins.left} y={margins.top} width={innerW} height={innerH} fill="none" stroke="#334155" strokeWidth="1" />

        {/* Clip path for plot area */}
        <defs>
          <clipPath id="plot-clip">
            <rect x={margins.left} y={margins.top} width={innerW} height={innerH} />
          </clipPath>
        </defs>

        {/* Grid and tick labels */}
        {(() => {
          const elements = [];
          const xRange = vp.xMax - vp.xMin || 1;
          const yRange = vp.yMax - vp.yMin || 1;
          const xStep = Math.max(1, Math.round(niceStep(xRange / 8))); // integer-ish ticks
          const yStep = Math.max(1, Math.round(niceStep(yRange / 8)));

          // Vertical grid + x labels
          const xStart = Math.ceil(vp.xMin / xStep) * xStep;
          for (let xv = xStart; xv <= vp.xMax + 1e-9; xv = +(xv + xStep).toFixed(12)) {
            const px = scaleX(xv);
            elements.push(
              <line key={`vg-${xv}`} x1={px} y1={margins.top} x2={px} y2={viewH - margins.bottom} stroke="rgba(148,163,184,0.08)" strokeWidth="1" />
            );
            elements.push(
              <text key={`xl-${xv}`} x={px} y={viewH - margins.bottom + 6} textAnchor="middle" alignmentBaseline="hanging" fill="#cbd5e1" fontSize="12">
                {Math.round(xv)}
              </text>
            );
          }

          // Horizontal grid + y labels
          const yStart = Math.ceil(vp.yMin / yStep) * yStep;
          for (let yv = yStart; yv <= vp.yMax + 1e-9; yv = +(yv + yStep).toFixed(12)) {
            const py = scaleY(yv);
            elements.push(
              <line key={`hg-${yv}`} x1={margins.left} y1={py} x2={viewW - margins.right} y2={py} stroke="rgba(148,163,184,0.08)" strokeWidth="1" />
            );
            elements.push(
              <text key={`yl-${yv}`} x={margins.left - 8} y={py} textAnchor="end" alignmentBaseline="middle" fill="#cbd5e1" fontSize="12">
                {Math.round(yv)}
              </text>
            );
          }

          // Axes at 0
          if (vp.yMin <= 0 && vp.yMax >= 0) {
            const py0 = scaleY(0);
            elements.push(
              <line key="x-axis" x1={margins.left} y1={py0} x2={viewW - margins.right} y2={py0} stroke="#475569" strokeWidth="1.5" />
            );
          }
          if (vp.xMin <= 0 && vp.xMax >= 0) {
            const px0 = scaleX(0);
            elements.push(
              <line key="y-axis" x1={px0} y1={margins.top} x2={px0} y2={viewH - margins.bottom} stroke="#475569" strokeWidth="1.5" />
            );
          }
          return <g>{elements}</g>;
        })()}

        {/* scatter points and lines */}
        <g clipPath="url(#plot-clip)">
          {normalizedSeries.map((s, si) => {
            const fsi = s.fitFunc || (s.a != null && s.b != null ? (x) => s.a + s.b * x : null);
            return (
              <g key={si}>
                {(s.xs || []).map((x, i) => (
                  <circle key={`p-${si}-${i}`} cx={scaleX(x)} cy={scaleY((s.ys || [])[i])} r="4" fill={s.pointColor || pointColor} />
                ))}
                {fsi && (
                  <path
                    d={`M ${scaleX(vp.xMin)} ${scaleY(fsi(vp.xMin))} L ${scaleX(vp.xMax)} ${scaleY(fsi(vp.xMax))}`}
                    stroke={s.lineColor || lineColor}
                    strokeWidth="2"
                    fill="none"
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* Legend */}
        {showLegend && normalizedSeries.length > 1 && (
          <g>
            {normalizedSeries.map((s, i) => (
              <g key={`leg-${i}`} transform={`translate(${margins.left}, ${margins.top - 6 - i * 16})`}>
                <rect x={0} y={0} width={12} height={12} fill={s.pointColor || pointColor} stroke={s.lineColor || lineColor} strokeWidth={2} />
                <text x={16} y={10} fill="#cbd5e1" fontSize="12">{s.label || `series ${i + 1}`}</text>
              </g>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
