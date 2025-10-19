export function jacobiIteration(A, b, x0, tol = 1e-6, maxIter = 50) {
  const n = A.length;
  let xOld = [...x0];
  let xNew = Array(n).fill(0);
  const results = [];

  for (let iter = 1; iter <= maxIter; iter++) {
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        if (i !== j) sum += A[i][j] * xOld[j];
      }
      if (Math.abs(A[i][i]) < 1e-12) return { error: "Pivot = 0 ที่แถว " + (i + 1) };
      xNew[i] = (b[i] - sum) / A[i][i];
    }

  const error = Math.max(...xNew.map((xi, i) => Math.abs((xi - xOld[i]) / (xi || 1))));
  results.push({ iter, x: [...xNew], error });

    if (error < tol) return { solution: xNew, iterations: results, converged: true };
    xOld = [...xNew];
  }

  return { solution: xNew, iterations: results, converged: false };
}

export default jacobiIteration;
