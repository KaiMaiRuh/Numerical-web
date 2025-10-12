import { useEffect, useRef } from "react";
import drawBasePlot from "../../utils/drawBasePlot";


export default function GraphIntegration({ func, a, b, n = 10, width = 800, height = 320, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !func) return;

    const xs = Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n);
    const ys = xs.map(func);
    const xmin = a - 1, xmax = b + 1;
    const ymin = Math.min(...ys, 0) - 1, ymax = Math.max(...ys) + 1;

    const ctx = canvas.getContext("2d");
    const W = (canvas.width = width);
    const H = (canvas.height = height);
    const mapX = (x) => ((x - xmin) / (xmax - xmin)) * W;
    const mapY = (y) => H - ((y - ymin) / (ymax - ymin)) * H;

    ctx.fillStyle = "#061022";
    ctx.fillRect(0, 0, W, H);

    // พื้นที่ใต้กราฟ
    ctx.fillStyle = "rgba(34,197,94,0.25)";
    for (let i = 0; i < xs.length - 1; i++) {
      const x0 = xs[i], x1 = xs[i + 1];
      const y0 = ys[i], y1 = ys[i + 1];
      ctx.beginPath();
      ctx.moveTo(mapX(x0), mapY(0));
      ctx.lineTo(mapX(x0), mapY(y0));
      ctx.lineTo(mapX(x1), mapY(y1));
      ctx.lineTo(mapX(x1), mapY(0));
      ctx.closePath();
      ctx.fill();
    }

    // เส้นกราฟ
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.beginPath();
    xs.forEach((x, i) => {
      const px = mapX(x);
      const py = mapY(ys[i]);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
  }, [func, a, b, n, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} className={className}></canvas>;
}
