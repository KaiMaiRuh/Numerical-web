const relErr = (x, y) => Math.abs(x - y) / (Math.abs(x) > 1e-12 ? Math.abs(x) : 1);

export function newtonRaphson(f, x0, tol = 1e-6, maxIter = 50) {
  try {
    const iterations = []; let x = x0;
    for (let i = 0; i <= maxIter; i++) {
      const fx = f(x);
      if (!Number.isFinite(fx)) return { error: "f(x) คำนวณไม่ได้", iterations, converged: false };
      const h = 1e-8, dfx = (f(x + h) - f(x - h)) / (2 * h);
      if (!Number.isFinite(dfx) || dfx === 0) return { error: "อนุพันธ์เป็นศูนย์หรือคำนวณไม่ได้", iterations, converged: false };
      const x1 = x - fx / dfx, err = relErr(x1, x);
      iterations.push({ iter: i, x, fx, dfx, x1, error: err });
      if (err <= tol) return { root: x1, iterations, converged: true };
      x = x1;
    }
    return { root: x, iterations, converged: false };
  } catch (e) { return { error: String(e), iterations: [], converged: false }; }
}

export default newtonRaphson;
