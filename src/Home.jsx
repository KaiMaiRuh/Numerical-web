// หน้า Home รวมลิงก์ไปแต่ละ Numerical Method
import { Link } from "react-router-dom";

export default function Home() {
  // กำหนดหมวดหมู่และหัวข้อแต่ละ Numerical Method
  const categories = [
    {
      title: "1. Root of Equation",
      topics: [
        { id: "bisection", name: "Bisection Method", path: "/bisection" },
        { id: "falsepo", name: "False-Position Method", path: "/falsepo" },
        { id: "onepoint", name: "One-Point Method", path: "/onepoint" },
        { id: "newtonrap", name: "Newton Raphson Method", path: "/newtonrap" },
        { id: "secant", name: "Secant Method", path: "/secant" },
      ],
    },
    {
      title: "2. Linear System",
      topics: [
        { id: "gauss-elim", name: "Gauss Elimination", path: "/gauss-elim" },
        { id: "gauss-jordan", name: "Gauss-Jordan", path: "/gauss-jordan" },
        { id: "lu", name: "LU Decomposition", path: "/lu" },
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
