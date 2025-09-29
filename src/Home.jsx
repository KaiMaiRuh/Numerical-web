import { Link } from "react-router-dom";

export default function Home() {
  const topics = [
    { id: 1, name: "Bisection Method", path: "/bisection" },
    { id: 2, name: "Newton-Raphson Method", path: "/newton" },
    { id: 3, name: "Secant Method", path: "/secant" },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-cyan-400 mb-4">
        Numerical Methods
      </h1>
      <div className="bg-slate-800 rounded-lg p-4 shadow-lg">
        <h2 className="text-lg mb-3">เลือกหัวข้อ</h2>
        <ul className="space-y-2">
          {topics.map((t) => (
            <li
              key={t.id}
              className="flex justify-between items-center bg-slate-700 p-3 rounded-md"
            >
              <Link
                to={t.path}
                className="hover:text-cyan-300 transition-colors"
              >
                {t.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
