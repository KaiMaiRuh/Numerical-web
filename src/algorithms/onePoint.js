const relErr = (x, y) => Math.abs(x - y) / (Math.abs(x) > 1e-12 ? Math.abs(x) : 1);

export function onePoint(f, x0, _b_unused, tol = 1e-6, maxIter = 50) {
  try {
    const iterations = []; let x = x0;
    for (let i = 0; i <= maxIter; i++) {
      const x1 = f(x);
      if (!Number.isFinite(x1)) return { error: "f(x) คำนวณไม่ได้", iterations, converged: false };
      const err = relErr(x1, x);
      iterations.push({ iter: i, x, x1, error: err });
      if (err <= tol) return { root: x1, iterations, converged: true };
      x = x1;
    }
    return { root: x, iterations, converged: false };
  } catch (e) { return { error: String(e), iterations: [], converged: false }; }
}

export default onePoint;
