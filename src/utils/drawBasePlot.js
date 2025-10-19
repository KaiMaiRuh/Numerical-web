// src/utils/drawBasePlot.js
export default function drawBasePlot(canvas, func = null, points = [], opts = {}) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const {
    width = 800,
    height = 320,
    bg = "#061022",
    axesColor = "rgba(255,255,255,0.08)",
    curveColor = "#3b82f6",
    pointColor = "#f97316",
    lastPointColor = "#fb923c",
    xmin = -5,
    xmax = 5,
    ymin = -5,
    ymax = 5,
    showGrid = true,
  } = opts;

  const W = (canvas.width = width), H = (canvas.height = height);
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const mapX = (x) => ((x - xmin) / (xmax - xmin)) * W;
  const mapY = (y) => H - ((y - ymin) / (ymax - ymin)) * H;

  if (showGrid) {
    ctx.strokeStyle = "rgba(255,255,255,0.03)"; ctx.lineWidth = 1;
    for (let i = 1; i < 10; i++) {
      const gx = (W / 10) * i, gy = (H / 10) * i;
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
    }
  }

  ctx.strokeStyle = axesColor; ctx.lineWidth = 1.2;
  if (ymin < 0 && ymax > 0) { ctx.beginPath(); const y0 = mapY(0); ctx.moveTo(0, y0); ctx.lineTo(W, y0); ctx.stroke(); }
  if (xmin < 0 && xmax > 0) { ctx.beginPath(); const x0 = mapX(0); ctx.moveTo(x0, 0); ctx.lineTo(x0, H); ctx.stroke(); }

  if (typeof func === "function") {
    const N = 600, dx = (xmax - xmin) / N; let started = false;
    ctx.beginPath(); ctx.strokeStyle = curveColor; ctx.lineWidth = 2;
    for (let i = 0, X = xmin; i <= N; i++, X += dx) {
      let y; try { y = func(X); } catch { y = NaN; }
      if (!isFinite(y)) continue;
      const px = mapX(X), py = mapY(y);
      if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  if (points && points.length) {
    points.forEach(([x, y], i) => {
      ctx.beginPath(); ctx.arc(mapX(x), mapY(y), 4, 0, 2 * Math.PI);
      ctx.fillStyle = i === points.length - 1 ? lastPointColor : pointColor;
      ctx.fill();
    });
  }
}
