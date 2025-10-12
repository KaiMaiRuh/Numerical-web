import { formatNum } from "../../utils/math";

export default function TableInterpolation({ steps = [], points = null, data = null }) {
  const rows = Array.isArray(steps) && steps.length ? steps : Array.isArray(points) && points.length ? points : Array.isArray(data) ? data : [];
  if (!rows || rows.length === 0) return null;

  return (
    <div className="bg-slate-800 rounded-xl shadow-md p-4 mt-6 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-slate-700 text-gray-300">
          <tr>
            <th className="p-2 text-center">i</th>
            <th className="p-2 text-center">Lᵢ(x)</th>
            <th className="p-2 text-center">yᵢ·Lᵢ(x)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s, idx) => (
            <tr key={s.i ?? idx} className="border-b border-slate-700 hover:bg-slate-900 transition-colors">
              <td className="p-2 text-center font-medium">{s.i ?? idx}</td>
              <td className="p-2 text-right">{formatNum(s.Li ?? s.L)}</td>
              <td className="p-2 text-right">{formatNum(s.term ?? s.y ?? s.value ?? 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
