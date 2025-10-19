const finite = (v) => Number.isFinite(v);
const relErr = (x, y) => Math.abs(x - y) / (Math.abs(x) > 1e-12 ? Math.abs(x) : 1);

export function falsePosition(f, a, b, tol = 1e-6, maxIter = 50) {
  try {
    let fa = f(a), fb = f(b);
    if (!finite(fa) || !finite(fb)) return { error: "f(x) ไม่สามารถประเมินค่าได้", iterations: [], converged: false };
    if (fa * fb > 0) return { error: "f(a) และ f(b) ต้องต่างเครื่องหมาย", iterations: [], converged: false };

    const iterations = [];
    let prev = null, x1 = null;
    for (let i = 0; i <= maxIter; i++) {
      if (fb - fa === 0) return { error: "หารศูนย์ในสูตร Secant", iterations, converged: false };
      x1 = (a * fb - b * fa) / (fb - fa);
      const fx1 = f(x1);
      if (!finite(fx1)) return { error: "f(x1) คำนวณไม่ได้", iterations, converged: false };
      const err = prev === null ? null : relErr(x1, prev);
      iterations.push({ iter: i, xl: a, xr: b, x1, fx1, error: err });
      if (fx1 === 0 || (err !== null && err <= tol)) return { root: x1, iterations, converged: true };
      if (fa * fx1 < 0) { b = x1; fb = fx1; } else { a = x1; fa = fx1; }
      prev = x1;
    }
    return { root: x1, iterations, converged: false };
  } catch (e) { return { error: String(e), iterations: [], converged: false }; }
}

export default falsePosition;
