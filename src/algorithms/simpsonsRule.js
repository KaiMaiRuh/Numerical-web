import { evaluate } from "mathjs";

// Composite Simpson's 1/3 Rule
// Accepts expression string `expr`, interval [a,b], and even n
export function simpsonsRule(expr, a, b, n) {
  if (n % 2 !== 0) throw new Error("n ต้องเป็นจำนวนคู่เท่านั้น");

  const f = (x) => {
    try {
      return evaluate(expr, { x });
    } catch {
      throw new Error("ไม่สามารถประเมินสมการได้");
    }
  };

  const h = (b - a) / n;
  let sum = f(a) + f(b);
  const rows = [{ i: 0, x: a, fx: f(a) }];

  for (let i = 1; i < n; i++) {
    const xi = a + i * h;
    const fx = f(xi);
    sum += i % 2 === 0 ? 2 * fx : 4 * fx;
    rows.push({ i, x: xi, fx });
  }

  rows.push({ i: n, x: b, fx: f(b) });
  const I = (h / 3) * sum;
  return { I, h, rows };
}

export default simpsonsRule;
