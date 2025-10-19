import { evalx } from "../utils/math";

// Supports two signatures:
// 1) trapezoidal(exprString, a, b)
// 2) trapezoidal(a, b, fFunction)
// Always returns an object: { I, h, fa, fb }
export default function trapezoidal(arg1, arg2, arg3) {
  try {
    let a, b, f;
    if (typeof arg1 === "string") {
      const expr = arg1; a = arg2; b = arg3;
      f = (x) => { try { return evalx(expr, x); } catch { throw new Error("ไม่สามารถประเมินสมการได้"); } };
    } else if (typeof arg3 === "function") {
      a = arg1; b = arg2; f = arg3;
    } else throw new Error("ฟังก์ชัน trapezoidal ต้องการ (expr,a,b) หรือ (a,b,f)");

    const h = b - a, fa = f(a), fb = f(b);
    return { I: (h / 2) * (fa + fb), h, fa, fb };
  } catch (e) { return { error: String(e) }; }
}
