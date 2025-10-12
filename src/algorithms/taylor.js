import { derivative, evaluate, factorial } from "mathjs";

// Compute Taylor series approximation for f at x using center x0 up to n terms
export function taylorApprox(expr, x0, x, n) {
  const terms = [];
  let sum = 0;
  let currentExpr = expr;

  for (let i = 0; i <= n; i++) {
    const fx0 = evaluate(currentExpr, { x: x0 });
    const term = (fx0 * Math.pow(x - x0, i)) / factorial(i);
    sum += term;
    terms.push({ i, fx0, term });

    // prepare next derivative
    currentExpr = derivative(currentExpr, "x").toString();
  }

  return { result: sum, terms };
}

export default taylorApprox;
