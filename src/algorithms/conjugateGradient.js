export function conjugateGradient(A, b, x0, tol = 1e-6, maxIter = 50) {
  try {
    if (!Array.isArray(A) || !Array.isArray(b) || !Array.isArray(x0)) return { error: "Invalid input" };
    const n = A.length;
    if (!A.every((row) => Array.isArray(row) && row.length === n)) return { error: "A must be square" };
    if (b.length !== n || x0.length !== n) return { error: "Dimension mismatch" };
    tol = +tol || 1e-6;
    maxIter = Math.max(1, (maxIter | 0) || 50);

    let x = [...x0];
    let r = Array(n).fill(0);
    let p = Array(n).fill(0);
    const iterations = [];

    // r0 = b - A*x0
    for (let i = 0; i < n; i++) {
      let Ax = 0;
      for (let j = 0; j < n; j++) Ax += A[i][j] * x0[j];
      r[i] = b[i] - Ax;
      p[i] = r[i];
    }

    let rsOld = r.reduce((s, v) => s + v * v, 0);

    for (let iter = 1; iter <= maxIter; iter++) {
      const Ap = Array(n).fill(0);
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) Ap[i] += A[i][j] * p[j];

      const denom = p.reduce((s, v, i) => s + v * Ap[i], 0);
      if (!Number.isFinite(denom) || Math.abs(denom) < 1e-18) return { error: "เกิดปัญหาในการคำนวณ (division by zero)" };
      const alpha = rsOld / denom;

      for (let i = 0; i < n; i++) x[i] += alpha * p[i];
      for (let i = 0; i < n; i++) r[i] -= alpha * Ap[i];

  const rsNew = r.reduce((s, v) => s + v * v, 0);
  const error = Math.sqrt(rsNew), beta = rsNew / rsOld;

      iterations.push({ iter, x: [...x], residual: [...r], alpha, beta, error });
      if (error < tol) return { solution: x, iterations, converged: true };

      for (let i = 0; i < n; i++) p[i] = r[i] + beta * p[i];
      rsOld = rsNew;
    }

    return { solution: x, iterations, converged: false };
  } catch (e) {
    return { error: String(e) };
  }
}

export default conjugateGradient;
