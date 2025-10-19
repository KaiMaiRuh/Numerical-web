import { evaluate as E, compile as C, format as F, factorial, derivative } from "mathjs";

// tiny, memorable helpers
export const formatNum = (x, sig = 6) => x == null || Number.isNaN(x) ? "-" : !isFinite(x) ? String(x) : F(Number(x), { precision: sig });

const prep = (e = "") => {
  let s = e.trim();
  if (!s) return s;
  s = s.replace(/\bln\s*\(/gi, "log(").replace(/\bPI\b/g, "pi").replace(/\bE\b/g, "e");
  return s
    .replace(/(\d(?:\.\d+)?)(\s*)(?=(x|pi|e)\b)/gi, "$1*")
    .replace(/(\d(?:\.\d+)?)(\s*)(?=\()/g, "$1*")
    .replace(/(x)\s*(?=\d|\()/gi, "$1*")
    .replace(/(pi|e)\s*(?=\()/gi, "$1*")
    .replace(/\)\s*(?=\(|x|\d|pi|e)/gi, ")*");
};

export const makeFunc = (expr) => {
  const s = prep(expr);
  if (!s) return null;
  try { const c = C(s); return (x) => c.evaluate({ x }); } catch { return null; }
};

export const evalx = (expr, x) => E(prep(expr), { x });

export { factorial, derivative };
