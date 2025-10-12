import { useEffect, useRef } from "react";
import drawBasePlot from "../../utils/drawBasePlot";


export default function GraphDifferentiation({ func, x, h = 0.5, width = 800, height = 320, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !func) return;

    const xmin = x - 3;
    const xmax = x + 3;
    const xs = Array.from({ length: 200 }, (_, i) => xmin + ((xmax - xmin) * i) / 199);
    const ys = xs.map(func);
    const ymin = Math.min(...ys) - 1;
    const ymax = Math.max(...ys) + 1;

    const ctx = canvas.getContext("2d");
    const W = (canvas.width = width);
    const H = (canvas.height = height);
    const mapX = (xv) => ((xv - xmin) / (xmax - xmin)) * W;
    const mapY = (yv) => H - ((yv - ymin) / (ymax - ymin)) * H;

    ctx.fillStyle = "#061022";
    ctx.fillRect(0, 0, W, H);

    // วาดกราฟฟังก์ชัน
    ctx.strokeStyle = "#3b82f6";
    ctx.beginPath();
    xs.forEach((xv, i) => {
      const px = mapX(xv);
      const py = mapY(func(xv));
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();

    // วาดเส้นสัมผัส
    const slope = (func(x + h) - func(x - h)) / (2 * h);
    const yx = func(x);
    const tangent = (xx) => slope * (xx - x) + yx;

    ctx.strokeStyle = "#22c55e";
    ctx.beginPath();
    for (let i = 0; i < xs.length; i++) {
      const xv = xs[i];
      const px = mapX(xv);
      const py = mapY(tangent(xv));
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // จุดสัมผัส
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.arc(mapX(x), mapY(yx), 5, 0, 2 * Math.PI);
    ctx.fill();
  }, [func, x, h, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} className={className}></canvas>;
}
