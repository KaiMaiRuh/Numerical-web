import { useRef, useEffect } from "react";
import drawPlot from "../utils/drawPlot";

export default function GraphCanvas({ func, xl = -5, xr = 5, iterations = [], width = 800, height = 320, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    drawPlot(canvas, func, xl, xr, iterations, { width, height });
  }, [func, xl, xr, iterations, width, height]);

  return (
    <canvas ref={canvasRef} width={width} height={height} className={className}></canvas>
  );
}
