import { formatNum } from "../../utils/math";

export default function TableIntegration({ rows = [], table = null, method = "", ...props }) {
  const data = Array.isArray(rows) && rows.length ? rows : Array.isArray(table) ? table : [];
  if (!data || data.length === 0) return null;
  const n = data.length - 1;

  return (
    <div className="bg-slate-800 rounded-xl shadow-md p-4 mt-6 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-slate-700 text-gray-300">
          <tr>
            <th className="p-2 text-center">i</th>
            <th className="p-2 text-center">xᵢ</th>
            <th className="p-2 text-center">f(xᵢ)</th>
            <th className="p-2 text-center">Weight</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => {
            // compute a sensible weight when not provided, using the method hint
            let weight = r?.weight;
            if (weight === undefined) {
              const m = (method || "").toLowerCase();
              if (m.includes("simpson")) {
                // Simpson's rule: endpoints weight 1, odd index 4, even index 2
                weight = i === 0 || i === n ? 1 : i % 2 === 1 ? 4 : 2;
              } else if (m.includes("trapezoid") || m.includes("trapezoidal") || m.includes("trapez")) {
                // Trapezoidal: endpoints 1, interior 2
                weight = i === 0 || i === n ? 1 : 2;
              } else {
                weight = r?.weight ?? "";
              }
            }
            return (
              <tr key={i} className="border-b border-slate-700 hover:bg-slate-900 transition-colors">
                <td className="p-2 text-center font-medium">{i}</td>
                <td className="p-2 text-right">{formatNum(r.x)}</td>
                <td className="p-2 text-right">{formatNum(r.fx)}</td>
                <td className="p-2 text-right">{weight}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
