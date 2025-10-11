// หน้า Home รวมลิงก์ไปแต่ละ Numerical Method
import { Link } from "react-router-dom";

export default function Home() {
  // กำหนดหมวดหมู่และหัวข้อแต่ละ Numerical Method
  const categories = [
    {
      title: "1. Root of Equation",
      topics: [
        { id: "bisection", name: "Bisection Method", path: "/bisection" },
        { id: "falseposition", name: "False Position Method (Regula Falsi)", path: "/falseposition" },
        { id: "onepoint", name: "One-Point Iteration", path: "/onepoint" },
        { id: "taylor", name: "Taylor Series Approximation", path: "/taylor" },
        { id: "newtonraphson", name: "Newton–Raphson Method", path: "/newtonraphson" },
        { id: "secant", name: "Secant Method", path: "/secant" },
      ],
    },
    {
      title: "2. Linear System",
      topics: [
        { id: "cramer", name: "Cramer’s Rule", path: "/cramer" },
        { id: "gaussian", name: "Gaussian Elimination Method", path: "/gaussian" },
        { id: "gaussjordan", name: "Gauss–Jordan Method", path: "/gaussjordan" },
        { id: "matrixinversion", name: "Matrix Inversion Method", path: "/matrixinversion" },
        { id: "ludecomposition", name: "LU Decomposition", path: "/ludecomposition" },
        { id: "cholesky", name: "Cholesky Decomposition", path: "/cholesky" },
        { id: "jacobi", name: "Jacobi Iteration Method", path: "/jacobi" },
        { id: "gaussseidel", name: "Gauss–Seidel Iteration Method", path: "/gaussseidel" },
        { id: "conjugategradient", name: "Conjugate Gradient Method", path: "/conjugategradient" },
      ],
    },
    {
      title: "3. Interpolation",
      topics: [
        { id: "lagrangeinterp", name: "Lagrange Interpolation", path: "/lagrangeinterp" },
        { id: "linearinterp", name: "Linear Interpolation", path: "/linearinterp" },
        { id: "quadraticinterp", name: "Quadratic Interpolation", path: "/quadraticinterp" },
        { id: "polynomialinterp", name: "Polynomial Interpolation", path: "/polynomialinterp" },
        { id: "linearspline", name: "Linear Spline", path: "/linearspline" },
        { id: "quadraticspline", name: "Quadratic Spline", path: "/quadraticspline" },
        { id: "cubicspline", name: "Cubic Spline", path: "/cubicspline" },
      ],
    },
    {
      title: "4. Regression",
      topics: [
        { id: "singlelinear", name: "Single Linear Regression", path: "/singlelinear" },
        { id: "multiplelinear", name: "Multiple Linear Regression", path: "/multiplelinear" },
        { id: "polynomialreg", name: "Polynomial Regression", path: "/polynomialreg" },
        { id: "nonlinearreg", name: "Nonlinear Regression", path: "/nonlinearreg" },
      ],
    },
    {
      title: "5. Integration",
      topics: [
        { id: "singletrapezoidal", name: "Single Trapezoidal Rule", path: "/singletrapezoidal" },
        { id: "compositetrapezoidal", name: "Composite Trapezoidal Rule", path: "/compositetrapezoidal" },
        { id: "simpsonsrule", name: "Simpson’s Rule", path: "/simpsonsrule" },
        { id: "compositesimpson", name: "Composite Simpson’s Rule", path: "/compositesimpson" },
      ],
    },
    {
      title: "6. Differentiation",
      topics: [
        { id: "firstdivided", name: "First Divided-Difference", path: "/firstdivided" },
        { id: "seconddivided", name: "Second Divided-Difference", path: "/seconddivided" },
        { id: "forwarddivided", name: "Forward Divided-Difference", path: "/forwarddivided" },
        { id: "backwarddivided", name: "Backward Divided-Difference", path: "/backwarddivided" },
        { id: "centraldivided", name: "Central Divided-Difference", path: "/centraldivided" },
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
