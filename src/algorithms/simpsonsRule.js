import { evalx } from "../utils/math";

// Composite Simpson's 1/3 Rule
// Supports two signatures:
// 1) simpsonsRule(exprString, a, b, n)
// 2) simpsonsRule(a, b, n, fFunction)
// Always returns { I, h, rows }
export default function simpsonsRule(arg1, arg2, arg3, arg4) {
  try {
    let a, b, n, f;
    if (typeof arg1 === "string") {
      const expr = arg1; a = arg2; b = arg3; n = arg4;
      f = (x) => { try { return evalx(expr, x); } catch { throw new Error("ไม่สามารถประเมินสมการได้"); } };
    } else if (typeof arg4 === "function") {
      a = arg1; b = arg2; n = arg3; f = arg4;
    } else throw new Error("simpsonsRule ต้องการ (expr,a,b,n) หรือ (a,b,n,f)");

    if (n % 2 !== 0) throw new Error("n ต้องเป็นจำนวนคู่เท่านั้น");
    const h = (b - a) / n;
    const fa = f(a), fb = f(b);
    let sum = fa + fb;
    const rows = [{ i: 0, x: a, fx: fa }];
    for (let i = 1; i < n; i++) {
      const xi = a + i * h, fx = f(xi);
      sum += (i % 2 === 0 ? 2 : 4) * fx;
      rows.push({ i, x: xi, fx });
    }
    rows.push({ i: n, x: b, fx: fb });
    return { I: (h / 3) * sum, h, rows };
  } catch (e) { return { error: String(e) }; }
}
