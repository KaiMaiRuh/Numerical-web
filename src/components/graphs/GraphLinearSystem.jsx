import { useEffect, useRef } from "react";
import drawBasePlot from "../../utils/drawBasePlot";


export default function GraphLinearSystem({ iterations = [], width = 800, height = 320, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || iterations.length === 0) return;

    const ctx = canvas.getContext("2d");
    const W = (canvas.width = width);
    const H = (canvas.height = height);

    ctx.fillStyle = "#061022";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.beginPath();
    ctx.moveTo(40, 0);
    ctx.lineTo(40, H - 30);
    ctx.lineTo(W, H - 30);
    ctx.stroke();

    // Data
    const xs = iterations.map((_, i) => i + 1);
    const ys = iterations.map((it) => Math.log10(it.error || 1e-16));
    const ymin = Math.min(...ys);
    const ymax = Math.max(...ys);

    // Scale
    const mapX = (x) => 40 + ((x - 1) / (xs.length - 1)) * (W - 60);
    const mapY = (y) => H - 30 - ((y - ymin) / (ymax - ymin)) * (H - 50);

    // Line
    ctx.strokeStyle = "#3b82f6";
    ctx.beginPath();
    xs.forEach((x, i) => {
      const px = mapX(x);
      const py = mapY(ys[i]);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();

    // Points
    ctx.fillStyle = "#f97316";
    xs.forEach((x, i) => {
      const px = mapX(x);
      const py = mapY(ys[i]);
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, 2 * Math.PI);
      ctx.fill();
    });

    ctx.fillStyle = "#aaa";
    ctx.font = "12px sans-serif";
    ctx.fillText("Iteration", W / 2 - 30, H - 5);
    ctx.save();
    ctx.translate(15, H / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("log(Error)", 0, 0);
    ctx.restore();
  }, [iterations, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} className={className}></canvas>;
}
