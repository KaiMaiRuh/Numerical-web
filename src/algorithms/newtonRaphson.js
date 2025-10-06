// Newton-Raphson requires derivative; we'll approximate derivative numerically
export function newtonRaphson(func, x0, _b_unused, tol = 1e-6, maxIter = 50) {
  try {
    const iterations = [];
    let x = x0;
    for (let i = 0; i <= maxIter; i++) {
      let fx = func(x);
      if (!isFinite(fx)) return { error: "f(x) คำนวณไม่ได้", iterations, converged: false };
      // numerical derivative
      const h = 1e-8;
      const dfx = (func(x + h) - func(x - h)) / (2 * h);
      if (!isFinite(dfx) || dfx === 0) return { error: "อนุพันธ์เป็นศูนย์หรือคำนวณไม่ได้", iterations, converged: false };

      const x1 = x - fx / dfx;
      const err = Math.abs(x1 - x) / (Math.abs(x1) > 1e-12 ? Math.abs(x1) : 1);
      iterations.push({ iter: i, x, fx, dfx, x1, error: err });
      if (err <= tol) return { root: x1, iterations, converged: true };
      x = x1;
    }
    return { root: x, iterations, converged: false };
  } catch (e) {
    return { error: String(e), iterations: [], converged: false };
  }
}

export default newtonRaphson;
