import { formatNum } from "../utils/math";

export function bisection(func, a, b, tol = 1e-6, maxIter = 50) {
  try {
    let fa = func(a), fb = func(b);
    if (!isFinite(fa) || !isFinite(fb)) return { error: "f(x) ไม่สามารถประเมินค่าได้", iterations: [], converged: false };
    if (fa * fb > 0) return { error: "f(a) และ f(b) ต้องต่างเครื่องหมาย", iterations: [], converged: false };

    const iterations = [];
    let prev = null;
    for (let i = 0; i <= maxIter; i++) {
      const x1 = (a + b) / 2;
      const fx1 = func(x1);
      if (!isFinite(fx1)) return { error: "f(x1) คำนวณไม่ได้", iterations, converged: false };

      let err = null;
      if (prev !== null) {
        const denom = Math.abs(x1) > 1e-12 ? Math.abs(x1) : 1;
        err = Math.abs(x1 - prev) / denom;
      }

      iterations.push({ iter: i, xl: a, xr: b, x1, fx1, error: err });

      if (Math.abs(fx1) === 0 || (err !== null && err <= tol)) {
        return { root: x1, iterations, converged: true };
      }

      if (fa * fx1 < 0) {
        b = x1; fb = fx1;
      } else {
        a = x1; fa = fx1;
      }
      prev = x1;
    }
    return { root: (a + b) / 2, iterations, converged: false };
  } catch (e) {
    return { error: String(e), iterations: [], converged: false };
  }
}

export default bisection;
