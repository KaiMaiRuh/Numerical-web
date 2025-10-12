import { useEffect, useRef } from "react";
import drawBasePlot from "../../utils/drawBasePlot";

export default function GraphRegression({ xs = [], ys = [], fitFunc = null, width = 800, height = 320, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || xs.length === 0 || ys.length === 0) return;

    const xmin = Math.min(...xs) - 1;
    const xmax = Math.max(...xs) + 1;
    const ymin = Math.min(...ys) - 1;
    const ymax = Math.max(...ys) + 1;

    const points = xs.map((x, i) => [x, ys[i]]);
    drawBasePlot(canvas, fitFunc, points, {
      width,
      height,
      xmin,
      xmax,
      ymin,
      ymax,
      curveColor: "#22c55e",
      pointColor: "#f97316",
    });
  }, [xs, ys, fitFunc, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} className={className}></canvas>;
}
