// หน้า Home รวมลิงก์ไปแต่ละ Numerical Method
import { Link } from "react-router-dom";

export default function Home() {
  // กำหนดหมวดหมู่และหัวข้อแต่ละ Numerical Method
  const categories = [
    {
      title: "1. Root of Equation",
      topics: [
        { id: "graphicalmethod", name: "Graphical Method", path: "/graphicalmethod" },
        { id: "bisection", name: "Bisection search", path: "/bisection" },
        { id: "falseposition", name: "False-position methods", path: "/falseposition" },
        { id: "onepoint", name: "One-point Iteration methods", path: "/onepoint" },
        { id: "newtonraphson", name: "Newton-Raphson methods", path: "/newtonraphson" },
        { id: "secant", name: "Secant methods", path: "/secant" },
      ],
    },
    {
      title: "2. Linear Algebra Equation",
      topics: [
        { id: "cramer", name: "Cramer’s rule", path: "/cramer" },
        { id: "gaussian", name: "Gauss elimination", path: "/gaussian" },
        { id: "gaussjordan", name: "Gauss Jordan elimination", path: "/gaussjordan" },
        { id: "matrixinversion", name: "Matrix Inversion", path: "/matrixinversion" },
        { id: "ludecomposition", name: "LU Decomposition Methods", path: "/ludecomposition" },
        { id: "jacobi", name: "Jacobi Iteration Methods", path: "/jacobi" },
        { id: "conjugategradient", name: "Conjugate Gradient Methods", path: "/conjugategradient" },
      ],
    },
        {
          title: "3. Interpolation",
          topics: [
            { id: "newtondiv", name: "Newton divided-differences", path: "/polynomialinterp" },
            { id: "lagrangeinterp", name: "Lagrange interpolation", path: "/lagrangeinterp" },
            { id: "cubicspline", name: "Cubic Spline", path: "/cubicspline" },
            { id: "linearspline", name: "Linear Spline", path: "/linearspline" },
            { id: "quadraticspline", name: "Quadratic Spline", path: "/quadraticspline" },
          ],
        },
    {
      title: "4. Extrapolation",
      topics: [
        { id: "simplereg", name: "Simple Regression", path: "/singlelinear" },
        { id: "multiplereg", name: "Multiple Regression", path: "/multiplelinear" },
      ],
    },
    {
      title: "5. Integration",
      topics: [
        { id: "trapezoidal", name: "Trapezoidal Rule", path: "/singletrapezoidal" },
        { id: "compositetrap", name: "Composite Trapezoidal Rule", path: "/compositetrapezoidal" },
        { id: "simpson", name: "Simpson Rule", path: "/simpsonsrule" },
        { id: "compositesimpson", name: "Composite Simpson Rule", path: "/compositesimpson" },
      ],
    },
    {
      title: "6. Differentiation",
      topics: [
        { id: "numericaldiff", name: "Numerical Differentiation", path: "/differentiation" },
      ],
    },
  ];

  // ส่วนแสดงผลหน้า Home
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-6 bg-slate-900">
      {/* หัวข้อหลัก */}
      <h1 className="text-3xl font-bold text-cyan-400 mb-8 text-center fade-in">
        Numerical Methods
      </h1>

      {/* flex wrapper ให้ grid อยู่กลางจอ */}
      <div className="flex justify-center items-center w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto">
          {/* วนลูปสร้างกล่องแต่ละหมวดหมู่ */}
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="bg-slate-800 rounded-xl p-5 shadow-lg border border-cyan-700 w-72
                         transform transition-all duration-300 fade-in-delay1
                         hover:scale-105 hover:shadow-2xl glow-btn"
            >
              {/* ชื่อหมวดหมู่ */}
              <h2 className="text-lg font-semibold text-cyan-300 mb-3 text-center">
                {cat.title}
              </h2>
              <ul className="space-y-2">
                {/* วนลูปสร้างลิงก์แต่ละหัวข้อ */}
                {cat.topics.map((t) => (
                  <li
                    key={t.id}
                    className="bg-slate-700 p-2 rounded-md hover:bg-slate-600 transition-colors"
                  >
                    <Link to={t.path} className="block text-center">
                      {t.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
