// Nonlinear regression helpers (exponential / power) using log-transform + linear regression
export function linearRegression(X, Y) {
  const n = X.length;
  const sumX = X.reduce((a, b) => a + b, 0);
  const sumY = Y.reduce((a, b) => a + b, 0);
  const sumXY = X.reduce((s, xi, i) => s + xi * Y[i], 0);
  const sumX2 = X.reduce((s, xi) => s + xi * xi, 0);

  const b = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
  const a = (sumY - b * sumX) / n;
  return { a, b };
}

export function solveNonlinearRegression(x, y, type) {
  const n = x.length;
  if (n < 2) throw new Error("ต้องมีข้อมูลอย่างน้อย 2 จุด");

  let X = [];
  let Y = [];

  if (type === "exponential") {
    X = x;
    Y = y.map((yi) => Math.log(yi));
  } else if (type === "power") {
    X = x.map((xi) => Math.log(xi));
    Y = y.map((yi) => Math.log(yi));
  } else {
    throw new Error("ไม่รู้จักโมเดลที่เลือก");
  }

  const { a: A, b: B } = linearRegression(X, Y);
  const a = Math.exp(A);
  const b = B;
  return { a, b };
}

export default solveNonlinearRegression;
