import { useRef, useEffect } from "react";
import { formatNum } from "../utils/math";

export default function GraphCanvas({ func, xl = -5, xr = 5, iterations = [], width = 800, height = 320, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width = width;
    const H = canvas.height = height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#061022";
    ctx.fillRect(0, 0, W, H);

    const f = func || ((x) => x);
    const pad = (xr - xl) * 0.2 || 1;
    const xmin = xl - pad, xmax = xr + pad;
    const N = 500;
    let xs = [], ys = [], ymin = Infinity, ymax = -Infinity;
    for (let i = 0; i < N; i++) {
      const x = xmin + ((xmax - xmin) * i) / (N - 1);
      let y;
      try { y = f(x); } catch { y = NaN; }
      xs.push(x); ys.push(y);
      if (isFinite(y)) { if (y < ymin) ymin = y; if (y > ymax) ymax = y; }
    }
    if (ymin === Infinity) { ymin = -1; ymax = 1; }
    const ypad = (ymax - ymin) * 0.2 || 1; ymin -= ypad; ymax += ypad;

    const mapX = (x) => ((x - xmin) / (xmax - xmin)) * W;
    const mapY = (y) => H - ((y - ymin) / (ymax - ymin)) * H;

    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    if (ymin < 0 && ymax > 0) { const y0 = mapY(0); ctx.beginPath(); ctx.moveTo(0, y0); ctx.lineTo(W, y0); ctx.stroke(); }
    if (xmin < 0 && xmax > 0) { const x0 = mapX(0); ctx.beginPath(); ctx.moveTo(x0, 0); ctx.lineTo(x0, H); ctx.stroke(); }

    ctx.beginPath(); ctx.lineWidth = 2; ctx.strokeStyle = "#8ab4ff";
    let started = false;
    for (let i = 0; i < N; i++) {
      const x = xs[i], y = ys[i];
      if (!isFinite(y)) { started = false; continue; }
      const px = mapX(x), py = mapY(y);
      if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
    }
    ctx.stroke();

    iterations.forEach((it) => {
      const px = mapX(it.x1), py = mapY(it.fx1);
      ctx.beginPath(); ctx.arc(px, py, 3, 0, 2 * Math.PI); ctx.fillStyle = "#f97316"; ctx.fill();
    });

    const drawMarker = (x, color, label) => {
      const px = mapX(x);
      ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, H); ctx.strokeStyle = color; ctx.stroke();
      ctx.fillStyle = color; ctx.font = "12px sans-serif";
      ctx.fillText(label + "=" + formatNum(x), px + 6, 18);
    };
    drawMarker(xl, "#22c55e", "XL");
    drawMarker(xr, "#ef4444", "XR");

    if (iterations.length) {
      const last = iterations[iterations.length - 1];
      const px = mapX(last.x1), py = mapY(last.fx1);
      ctx.beginPath(); ctx.arc(px, py, 6, 0, 2 * Math.PI); ctx.fillStyle = "#fb923c"; ctx.fill();
    }
  }, [func, xl, xr, iterations, width, height]);

  return (
    <canvas ref={canvasRef} width={width} height={height} className={className}></canvas>
  );
}
