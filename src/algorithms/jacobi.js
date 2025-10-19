const relErr = (x, y) => Math.abs(x - y) / (Math.abs(x) || 1);

export function jacobiIteration(A, b, x0, tol = 1e-6, maxIter = 50) {
  try {
    const n = A.length;
    let xOld = [...x0], xNew = Array(n).fill(0);
    const iterations = [];
    for (let iter = 1; iter <= maxIter; iter++) {
      for (let i = 0; i < n; i++) {
        let s = 0; for (let j = 0; j < n; j++) if (i !== j) s += A[i][j] * xOld[j];
        if (Math.abs(A[i][i]) < 1e-12) return { error: "Pivot = 0 ที่แถว " + (i + 1) };
        xNew[i] = (b[i] - s) / A[i][i];
      }
      const error = Math.max(...xNew.map((xi, i) => relErr(xi, xOld[i])));
      iterations.push({ iter, x: [...xNew], error });
      if (error < tol) return { solution: xNew, iterations, converged: true };
      xOld = [...xNew];
    }
    return { solution: xNew, iterations, converged: false };
  } catch (e) { return { error: String(e) }; }
}

export default jacobiIteration;
