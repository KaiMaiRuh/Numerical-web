const relErr = (x, y) => Math.abs(x - y) / (Math.abs(x) > 1e-12 ? Math.abs(x) : 1);

export function secant(f, x0, x1, tol = 1e-6, maxIter = 50) {
  try {
    const iterations = [];
    let a = x0, b = x1, fa = f(a), fb = f(b);
    if (!Number.isFinite(fa) || !Number.isFinite(fb)) return { error: "f(x) ไม่สามารถประเมินค่าได้", iterations: [], converged: false };
    for (let i = 0; i <= maxIter; i++) {
      if (fb - fa === 0) return { error: "หารศูนย์ในสูตร Secant", iterations, converged: false };
      const x2 = b - fb * (b - a) / (fb - fa), fx2 = f(x2), err = relErr(x2, b);
      if (!Number.isFinite(fx2)) return { error: "f(x) คำนวณไม่ได้", iterations, converged: false };
      iterations.push({ iter: i, x0: a, x1: b, x2, fx2, x: x2, fx: fx2, error: err });
      if (err <= tol) return { root: x2, iterations, converged: true };
      a = b; fa = fb; b = x2; fb = fx2;
    }
    return { root: b, iterations, converged: false };
  } catch (e) { return { error: String(e), iterations: [], converged: false }; }
}

export default secant;
