import { useEffect, useRef } from "react";
import drawBasePlot from "../../utils/drawBasePlot";

function extractXY(it) {
  if (!it) return null;
  const x = it.x ?? it.x1 ?? it.xi ?? it.x0 ?? it.xv ?? it.x_val ?? it.xValue;
  const y = it.fx ?? it.fx1 ?? it.f ?? it.y ?? it.fy ?? it.fx_val ?? it.yValue;
  if (typeof x !== "number" || !isFinite(x) || typeof y !== "number" || !isFinite(y)) return null;
  return [x, y];
}

export default function GraphRoot({ func, iterations = [], xl, xr, width = 800, height = 320, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Prepare points robustly from different page iteration shapes
    const points = (iterations || [])
      .map(extractXY)
      .filter((p) => p !== null);

    // Collect x and y samples for bounds (use provided xl/xr if present)
    const xs = [];
    const ys = [];
    if (typeof xl === "number") xs.push(xl);
    if (typeof xr === "number") xs.push(xr);
    points.forEach((p) => {
      xs.push(p[0]);
      ys.push(p[1]);
    });

    const safeMin = (arr, fallback) => (arr.length ? Math.min(...arr) : fallback);
    const safeMax = (arr, fallback) => (arr.length ? Math.max(...arr) : fallback);

    const xmin = safeMin(xs, -5) - 1;
    const xmax = safeMax(xs, 5) + 1;
    const ymin = safeMin(ys, -1);
    const ymax = safeMax(ys, 1);

    // Draw function and points (drawBasePlot handles null func)
    try {
      drawBasePlot(canvas, typeof func === "function" ? func : null, points, {
        width,
        height,
        xmin,
        xmax,
        ymin,
        ymax,
        curveColor: "#3b82f6",
        pointColor: "#f97316",
      });
    } catch (e) {
      // swallow drawing errors to avoid crashing pages
      // console.error("drawBasePlot error:", e);
    }

    // Draw arrows/lines between successive points if we have at least 2
    if (points.length >= 2) {
      const ctx = canvas.getContext("2d");
      ctx.strokeStyle = "rgba(249,115,22,0.4)";
      ctx.lineWidth = 1.5;
      for (let i = 1; i < points.length; i++) {
        const [x0, y0] = points[i - 1];
        const [x1, y1] = points[i];
        // avoid division by zero in degenerate bounds
        const dx = xmax - xmin || 1;
        const dy = ymax - ymin || 1;
        const px0 = ((x0 - xmin) / dx) * width;
        const px1 = ((x1 - xmin) / dx) * width;
        const py0 = height - ((y0 - ymin) / dy) * height;
        const py1 = height - ((y1 - ymin) / dy) * height;
        ctx.beginPath();
        ctx.moveTo(px0, py0);
        ctx.lineTo(px1, py1);
        ctx.stroke();
      }
    }
  }, [func, iterations, xl, xr, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} className={className}></canvas>;
}
