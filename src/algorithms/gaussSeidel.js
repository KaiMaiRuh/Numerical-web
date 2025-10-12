export function gaussSeidel(A, b, x0, tol = 1e-6, maxIter = 50) {
  const n = A.length;
  const x = [...x0];
  const results = [];

  for (let iter = 1; iter <= maxIter; iter++) {
    const xOld = [...x];

    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        if (i !== j) sum += A[i][j] * x[j];
      }
      if (Math.abs(A[i][i]) < 1e-12) return { error: "Pivot = 0 ที่แถว " + (i + 1) };
      x[i] = (b[i] - sum) / A[i][i];
    }

    const error = Math.max(...x.map((xi, i) => Math.abs((xi - xOld[i]) / (xi || 1))));
    results.push({ iter, values: [...x], error });

    if (error < tol) return { solution: x, iterations: results, converged: true };
  }

  return { solution: x, iterations: results, converged: false };
}

export default gaussSeidel;
