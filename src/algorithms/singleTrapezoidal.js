import { evaluate } from "mathjs";

export function trapezoidal(expr, a, b) {
  const f = (x) => {
    try {
      return evaluate(expr, { x });
    } catch {
      throw new Error("ไม่สามารถประเมินสมการได้");
    }
  };
  const h = b - a;
  const I = (h / 2) * (f(a) + f(b));
  return I;
}

export default trapezoidal;
