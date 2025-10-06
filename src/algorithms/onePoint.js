export function onePoint(func, x0, _b_unused, tol = 1e-6, maxIter = 50) {
  try {
    const iterations = [];
    let x = x0;
    for (let i = 0; i <= maxIter; i++) {
      let x1 = func(x);
      if (!isFinite(x1)) return { error: "f(x) คำนวณไม่ได้", iterations, converged: false };
      const err = Math.abs(x1 - x) / (Math.abs(x1) > 1e-12 ? Math.abs(x1) : 1);
      iterations.push({ iter: i, x, x1, error: err });
      if (err <= tol) return { root: x1, iterations, converged: true };
      x = x1;
    }
    return { root: x, iterations, converged: false };
  } catch (e) {
    return { error: String(e), iterations: [], converged: false };
  }
}

export default onePoint;
