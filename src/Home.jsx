import { Link } from "react-router-dom";

export default function Home() {
  const categories = [
    {
      title: "1. Root of Equation",
      topics: [
        { id: "bisection", name: "Bisection Method", path: "/bisection" },
        { id: "newton", name: "Newton-Raphson Method", path: "/newton" },
        { id: "secant", name: "Secant Method", path: "/secant" },
      ],
    },
    {
      title: "2. Linear System",
      topics: [
        { id: "gauss-elim", name: "Gauss Elimination", path: "/gauss-elim" },
        { id: "gauss-jordan", name: "Gauss-Jordan", path: "/gauss-jordan" },
        { id: "lu-decomp", name: "LU Decomposition", path: "/lu" },
      ],
    },
    {
      title: "3. Interpolation",
      topics: [
        { id: "lagrange", name: "Lagrange", path: "/lagrange" },
        { id: "newton-interp", name: "Newton Interpolation", path: "/newton-interp" },
      ],
    },
    {
      title: "4. Regression",
      topics: [
        { id: "linear-reg", name: "Linear Regression", path: "/linear-reg" },
        { id: "poly-reg", name: "Polynomial Regression", path: "/poly-reg" },
      ],
    },
    {
      title: "5. Integration",
      topics: [
        { id: "trapezoidal", name: "Trapezoidal Rule", path: "/trapezoidal" },
        { id: "simpson", name: "Simpson’s Rule", path: "/simpson" },
      ],
    },
    {
      title: "6. Differentiation",
      topics: [
        { id: "forward-diff", name: "Forward Difference", path: "/forward-diff" },
        { id: "backward-diff", name: "Backward Difference", path: "/backward-diff" },
        { id: "central-diff", name: "Central Difference", path: "/central-diff" },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">
        Numerical Methods
      </h1>

      {categories.map((cat) => (
        <div
          key={cat.title}
          className="bg-slate-800 rounded-lg p-5 shadow-lg"
        >
          <h2 className="text-xl font-semibold text-cyan-300 mb-3">
            {cat.title}
          </h2>
          <ul className="space-y-2">
            {cat.topics.map((t) => (
              <li
                key={t.id}
                className="bg-slate-700 p-3 rounded-md hover:bg-slate-600 transition-colors"
              >
                <Link to={t.path} className="block">
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
