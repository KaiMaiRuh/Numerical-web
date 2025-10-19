// Single variable linear regression (least squares)
export function solveSingleLinearRegression(pts, xPred) {
  try {
    const n = pts.length; if (n < 2) return { error: "ต้องมีข้อมูลอย่างน้อย 2 จุด" };
    const sumX = pts.reduce((s, p) => s + p.x, 0);
    const sumY = pts.reduce((s, p) => s + p.y, 0);
    const sumXY = pts.reduce((s, p) => s + p.x * p.y, 0);
    const sumX2 = pts.reduce((s, p) => s + p.x * p.x, 0);
    const b = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
    const a = (sumY - b * sumX) / n;
    return { a, b, yPred: a + b * xPred };
  } catch (e) { return { error: String(e) }; }
}

export default solveSingleLinearRegression;
