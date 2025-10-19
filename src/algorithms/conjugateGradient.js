export function conjugateGradient(A, b, x0, tol = 1e-6, maxIter = 50) {
  const n = A.length;
  let x = [...x0];
  let r = Array(n).fill(0);
  let p = Array(n).fill(0);
  const results = [];

  // r0 = b - A*x0
  for (let i = 0; i < n; i++) {
    let Ax = 0;
    for (let j = 0; j < n; j++) Ax += A[i][j] * x0[j];
    r[i] = b[i] - Ax;
    p[i] = r[i];
  }

  let rsOld = r.reduce((sum, val) => sum + val * val, 0);

  for (let iter = 1; iter <= maxIter; iter++) {
    const Ap = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) Ap[i] += A[i][j] * p[j];
    }

    const denom = p.reduce((sum, val, i) => sum + val * Ap[i], 0);
    if (denom === 0) return { error: "เกิดปัญหาในการคำนวณ (division by zero)" };
    const alpha = rsOld / denom;

    for (let i = 0; i < n; i++) x[i] += alpha * p[i];
    for (let i = 0; i < n; i++) r[i] -= alpha * Ap[i];

  const rsNew = r.reduce((sum, val) => sum + val * val, 0);
  const error = Math.sqrt(rsNew);
  const beta = rsNew / rsOld;

  // Record residual vector and scalars for this iteration
  results.push({ iter, x: [...x], residual: [...r], alpha, beta, error });

  if (Math.sqrt(rsNew) < tol) return { solution: x, iterations: results, converged: true };

  for (let i = 0; i < n; i++) p[i] = r[i] + beta * p[i];
  rsOld = rsNew;
  }

  return { solution: x, iterations: results, converged: false };
}

export default conjugateGradient;
