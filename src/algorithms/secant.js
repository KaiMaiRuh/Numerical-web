export function secant(func, x0, x1, tol = 1e-6, maxIter = 50) {
  try {
    const iterations = [];
    let a = x0, b = x1;
    let fa = func(a), fb = func(b);
    if (!isFinite(fa) || !isFinite(fb)) return { error: "f(x) ไม่สามารถประเมินค่าได้", iterations: [], converged: false };

    for (let i = 0; i <= maxIter; i++) {
      if (fb - fa === 0) return { error: "หารศูนย์ในสูตร Secant", iterations, converged: false };
      const x2 = b - fb * (b - a) / (fb - fa);
      const fx2 = func(x2);
      const err = Math.abs((x2 - b) / (Math.abs(x2) > 1e-12 ? Math.abs(x2) : 1));
      // Provide generic keys x, fx so graph/table components can read f(x)
      iterations.push({ iter: i, x0: a, x1: b, x2, fx2, x: x2, fx: fx2, error: err });
      if (!isFinite(fx2)) return { error: "f(x) คำนวณไม่ได้", iterations, converged: false };
      if (err <= tol) return { root: x2, iterations, converged: true };
      a = b; fa = fb; b = x2; fb = fx2;
    }
    return { root: b, iterations, converged: false };
  } catch (e) {
    return { error: String(e), iterations: [], converged: false };
  }
}

export default secant;
