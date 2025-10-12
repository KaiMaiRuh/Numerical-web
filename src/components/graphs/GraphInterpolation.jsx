import { useEffect, useRef } from "react";
import drawBasePlot from "../../utils/drawBasePlot";

export default function GraphInterpolation({ xs = [], ys = [], func = null, xTarget = null, width = 800, height = 320, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || xs.length === 0 || ys.length === 0) return;

    const xmin = Math.min(...xs) - 1;
    const xmax = Math.max(...xs) + 1;
    const ymin = Math.min(...ys) - 1;
    const ymax = Math.max(...ys) + 1;

    const points = xs.map((x, i) => [x, ys[i]]);
    drawBasePlot(canvas, func, points, {
      width,
      height,
      xmin,
      xmax,
      ymin,
      ymax,
      curveColor: "#60a5fa",
      pointColor: "#f97316",
    });

    if (xTarget !== null) {
      const ctx = canvas.getContext("2d");
      const mapX = (x) => ((x - xmin) / (xmax - xmin)) * width;
      const mapY = (y) => height - ((y - ymin) / (ymax - ymin)) * height;
      const yT = func ? func(xTarget) : null;
      if (yT !== null) {
        ctx.fillStyle = "#22c55e";
        ctx.beginPath();
        ctx.arc(mapX(xTarget), mapY(yT), 5, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }, [xs, ys, func, xTarget, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} className={className}></canvas>;
}
