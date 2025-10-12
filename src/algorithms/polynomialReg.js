// Polynomial regression using normal equations and Gaussian elimination
export function solvePolynomialRegression(x, y, m) {
  const n = x.length;
  // Build (m+1)x(m+1) matrix X and vector Y
  const X = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: m + 1 }, (_, j) =>
      x.reduce((sum, xi) => sum + Math.pow(xi, i + j), 0)
    )
  );
  const Y = Array.from({ length: m + 1 }, (_, i) =>
    y.reduce((sum, yi, idx) => sum + yi * Math.pow(x[idx], i), 0)
  );

  // Gaussian elimination on augmented matrix [X | Y]
  const A = X.map((row, i) => [...row, Y[i]]);
  for (let i = 0; i <= m; i++) {
    let maxRow = i;
    for (let k = i + 1; k <= m; k++) {
      if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) maxRow = k;
    }
    [A[i], A[maxRow]] = [A[maxRow], A[i]];
    const pivot = A[i][i];
    if (Math.abs(pivot) < 1e-12) throw new Error("Pivot เป็นศูนย์ — ไม่สามารถแก้สมการได้");
    for (let j = i; j <= m + 1; j++) A[i][j] /= pivot;
    for (let k = 0; k <= m; k++) {
      if (k !== i) {
        const factor = A[k][i];
        for (let j = i; j <= m + 1; j++) A[k][j] -= factor * A[i][j];
      }
    }
  }
  return A.map((r) => r[m + 1]);
}

export default solvePolynomialRegression;
