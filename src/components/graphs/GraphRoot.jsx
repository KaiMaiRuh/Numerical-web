import { useEffect, useRef } from "react";

function extractXY(it) {
  if (!it) return null;
  // Prefer xm/fxm (bisection-style), but support many shapes
  const x = it.xm ?? it.fx_x ?? it.x ?? it.x1 ?? it.xi ?? it.x0 ?? it.xv ?? it.x_val ?? it.xValue;
  const y = it.fxm ?? it.fx ?? it.fx1 ?? it.f ?? it.y ?? it.fy ?? it.fx_val ?? it.yValue;
  if (typeof x !== "number" || !isFinite(x) || typeof y !== "number" || !isFinite(y)) return null;
  return [x, y];
}

export default function GraphRoot({ func, iterations = [], xl, xr, width = 800, height = 320, className = "", caption, staircase = false }) {
  const canvasRef = useRef(null);
  const viewportRef = useRef(null); // { xmin, xmax, ymin, ymax }
  const draggingRef = useRef(false);
  const lastPosRef = useRef([0, 0]);

  function computeInitialViewport(points) {
    // Base full view like screenshot 3
    let xmin = -10, xmax = 10, ymin = -10, ymax = 10;
    const xs = [];
    const ys = [];
    if (typeof xl === "number") xs.push(xl);
    if (typeof xr === "number") xs.push(xr);
    points.forEach(([x, y]) => {
      xs.push(x);
      ys.push(y);
    });
    if (xs.length) {
      const minx = Math.min(...xs);
      const maxx = Math.max(...xs);
      xmin = Math.min(xmin, minx - 1);
      xmax = Math.max(xmax, maxx + 1);
    }
    if (ys.length) {
      const miny = Math.min(...ys);
      const maxy = Math.max(...ys);
      ymin = Math.min(ymin, miny - 1);
      ymax = Math.max(ymax, maxy + 1);
    }
    return { xmin, xmax, ymin, ymax };
  }

  function niceStep(range) {
    const rough = Math.pow(10, Math.floor(Math.log10(range)));
    const r = range / rough;
    if (r < 1.5) return rough * 0.1;
    if (r < 3) return rough * 0.2;
    if (r < 7) return rough * 0.5;
    return rough;
  }

  function worldToPixel([x, y], vp, w, h) {
    // optional margins support via vp._margins
    const m = vp._margins || { left: 0, right: 0, top: 0, bottom: 0 };
    const plotW = Math.max(1, w - m.left - m.right);
    const plotH = Math.max(1, h - m.top - m.bottom);
    const dx = vp.xmax - vp.xmin || 1;
    const dy = vp.ymax - vp.ymin || 1;
    const px = m.left + ((x - vp.xmin) / dx) * plotW;
    const py = m.top + (1 - (y - vp.ymin) / dy) * plotH;
    return [px, py];
  }

  function pixelToWorld([px, py], vp, w, h) {
    const m = vp._margins || { left: 0, right: 0, top: 0, bottom: 0 };
    const plotW = Math.max(1, w - m.left - m.right);
    const plotH = Math.max(1, h - m.top - m.bottom);
    const dx = vp.xmax - vp.xmin || 1;
    const dy = vp.ymax - vp.ymin || 1;
    const x = vp.xmin + ((px - m.left) / plotW) * dx;
    const y = vp.ymin + ((1 - (py - m.top) / plotH) * dy);
    return [x, y];
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const cssWidth = width;
    const cssHeight = height;
    canvas.style.width = cssWidth + "px";
    canvas.style.height = cssHeight + "px";
    canvas.width = Math.floor(cssWidth * dpr);
    canvas.height = Math.floor(cssHeight * dpr);

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Extract iteration points (xm,f(xm)) robustly
    const points = (iterations || []).map(extractXY).filter((p) => p !== null);
  // margins to reserve space for labels; caption will be rendered outside the canvas
  const margins = { left: 60, right: 20, top: 20, bottom: 20 };
  if (!viewportRef.current) viewportRef.current = computeInitialViewport(points);
  // attach margins into viewport object so mapping functions can read them
  viewportRef.current._margins = margins;

    let raf = null;

    function draw() {
  const vp = viewportRef.current;
      // background (dark theme)
      ctx.clearRect(0, 0, cssWidth, cssHeight);
      ctx.fillStyle = "#0f172a"; // slate-900
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      // Grid and tick labels
  const xRange = vp.xmax - vp.xmin || 1;
  const yRange = vp.ymax - vp.ymin || 1;
  // Prefer simple integer ticks: 1, 2, 3... keep them reasonable for wide ranges
  const xStep = Math.max(1, Math.round(niceStep(xRange / 8)));
  const yStep = Math.max(1, Math.round(niceStep(yRange / 8)));

      ctx.lineWidth = 1;
      ctx.font = "12px system-ui, Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = "#94a3b8"; // slate-400

      const xStart = Math.ceil(vp.xmin / xStep) * xStep;
      for (let x = xStart; x <= vp.xmax; x = +(x + xStep).toFixed(12)) {
        const [px] = worldToPixel([x, vp.ymin], vp, cssWidth, cssHeight);
        ctx.beginPath();
        ctx.strokeStyle = "rgba(148,163,184,0.08)"; // light grid
        ctx.moveTo(px, 0);
        // draw grid only inside plot area
        ctx.lineTo(px, cssHeight - margins.bottom);
        ctx.stroke();
  ctx.fillStyle = "#cbd5e1"; // slate-300
        // show integer-like ticks (round to integer)
        ctx.fillText(Math.round(x).toString(), px, cssHeight - (margins.bottom / 2));
      }

      const yStart = Math.ceil(vp.ymin / yStep) * yStep;
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      for (let y = yStart; y <= vp.ymax; y = +(y + yStep).toFixed(12)) {
        const [, py] = worldToPixel([vp.xmin, y], vp, cssWidth, cssHeight);
        ctx.beginPath();
        ctx.strokeStyle = "rgba(148,163,184,0.08)";
        // draw grid only inside plot area
        ctx.moveTo(margins.left, py);
        ctx.lineTo(cssWidth - margins.right, py);
        ctx.stroke();
        ctx.fillStyle = "#cbd5e1";
        ctx.fillText(Math.round(y).toString(), margins.left - 8, py);
      }

      // Axes at 0
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "#475569"; // slate-600
      if (vp.ymin <= 0 && vp.ymax >= 0) {
        const [, py] = worldToPixel([vp.xmin, 0], vp, cssWidth, cssHeight);
        ctx.beginPath();
        ctx.moveTo(margins.left, py);
        ctx.lineTo(cssWidth - margins.right, py);
        ctx.stroke();
      }
      if (vp.xmin <= 0 && vp.xmax >= 0) {
        const [px] = worldToPixel([0, vp.ymin], vp, cssWidth, cssHeight);
        ctx.beginPath();
        ctx.moveTo(px, margins.top);
        ctx.lineTo(px, cssHeight - margins.bottom);
        ctx.stroke();
      }

      // Connect iteration points
      if (points.length >= 2) {
        if (staircase) {
          // Draw red staircase: vertical first, then horizontal
          ctx.strokeStyle = "#ef4444"; // red-500
          ctx.lineWidth = 1.6;
          for (let i = 1; i < points.length; i++) {
            const [x0, y0] = points[i - 1];
            const [x1, y1] = points[i];
            // vertical: (x0,y0) -> (x0,y1)
            const [pxV0, pyV0] = worldToPixel([x0, y0], vp, cssWidth, cssHeight);
            const [pxV1, pyV1] = worldToPixel([x0, y1], vp, cssWidth, cssHeight);
            ctx.beginPath();
            ctx.moveTo(pxV0, pyV0);
            ctx.lineTo(pxV1, pyV1);
            ctx.stroke();
            // horizontal: (x0,y1) -> (x1,y1)
            const [pxH1, pyH1] = worldToPixel([x1, y1], vp, cssWidth, cssHeight);
            ctx.beginPath();
            ctx.moveTo(pxV1, pyV1);
            ctx.lineTo(pxH1, pyH1);
            ctx.stroke();
          }
        } else {
          // Default: green straight connectors
          ctx.strokeStyle = "#22c55e"; // green-500
          ctx.lineWidth = 1.6;
          for (let i = 1; i < points.length; i++) {
            const [x0, y0] = points[i - 1];
            const [x1, y1] = points[i];
            const [px0, py0] = worldToPixel([x0, y0], vp, cssWidth, cssHeight);
            const [px1, py1] = worldToPixel([x1, y1], vp, cssWidth, cssHeight);
            ctx.beginPath();
            ctx.moveTo(px0, py0);
            ctx.lineTo(px1, py1);
            ctx.stroke();
          }
        }
      }

      // Red points at (xm, f(xm))
      ctx.fillStyle = "#ef4444"; // red-500
      points.forEach(([x, y], i) => {
        const [px, py] = worldToPixel([x, y], viewportRef.current, cssWidth, cssHeight);
        ctx.beginPath();
        ctx.arc(px, py, i === points.length - 1 ? 4.5 : 3.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function scheduleDraw() {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    }

    scheduleDraw();

    // Interactions: zoom (wheel), pan (drag), reset (dblclick)
    function onWheel(e) {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const vp = viewportRef.current;
      // ensure pixel->world uses margins
      const [wx, wy] = pixelToWorld([px, py], vp, cssWidth, cssHeight);
      const zoom = Math.exp(-e.deltaY * 0.0015);
      viewportRef.current = {
        xmin: wx - (wx - vp.xmin) * zoom,
        xmax: wx + (vp.xmax - wx) * zoom,
        ymin: wy - (wy - vp.ymin) * zoom,
        ymax: wy + (vp.ymax - wy) * zoom,
      };
      scheduleDraw();
    }

    function onMouseDown(e) {
      draggingRef.current = true;
      lastPosRef.current = [e.clientX, e.clientY];
      canvas.style.cursor = "grabbing";
    }
    function onMouseMove(e) {
      if (!draggingRef.current) return;
      const [lx, ly] = lastPosRef.current;
      lastPosRef.current = [e.clientX, e.clientY];
      const dx = e.clientX - lx;
      const dy = e.clientY - ly;
      const vp = viewportRef.current;
      const xRange = vp.xmax - vp.xmin || 1;
      const yRange = vp.ymax - vp.ymin || 1;
      const plotW = Math.max(1, cssWidth - margins.left - margins.right);
      const plotH = Math.max(1, cssHeight - margins.top - margins.bottom);
      viewportRef.current = {
        xmin: vp.xmin - (dx / plotW) * xRange,
        xmax: vp.xmax - (dx / plotW) * xRange,
        ymin: vp.ymin + (dy / plotH) * yRange,
        ymax: vp.ymax + (dy / plotH) * yRange,
        _margins: margins,
      };
      scheduleDraw();
    }
    function onMouseUp() {
      draggingRef.current = false;
      canvas.style.cursor = "default";
    }
    function onDblClick() {
      viewportRef.current = computeInitialViewport(points);
      viewportRef.current._margins = margins;
      scheduleDraw();
    }

  // make canvas layout-friendly
  canvas.style.display = "block";
  canvas.style.maxWidth = "100%";
  canvas.style.boxSizing = "border-box";
  canvas.style.overflow = "hidden";
  canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("dblclick", onDblClick);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("dblclick", onDblClick);
    };
  }, [func, iterations, xl, xr, width, height, staircase]);

  const defaultCaption = "เขียว = XL, แดง = XR, ส้ม = xm ของแต่ละรอบ (วงใหญ่ = xm สุดท้าย)";
  return (
    <div>
      <canvas ref={canvasRef} width={width} height={height} className={className}></canvas>
      <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 8 }}>{caption ?? defaultCaption}</div>
    </div>
  );
}
