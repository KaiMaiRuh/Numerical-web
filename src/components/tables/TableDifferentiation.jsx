import { formatNum } from "../../utils/math";

export default function TableDifferentiation({ steps = [], table = null, data = null }) {
  let rows = Array.isArray(steps) && steps.length ? steps : Array.isArray(table) && table.length ? table : Array.isArray(data) ? data : [];
  if (!rows || rows.length === 0) return null;

  // If rows is a 2D difference table (array of arrays), convert to row objects { x, fx, d1, d2 }
  if (Array.isArray(rows[0]) && rows.every(Array.isArray)) {
    const diffTable = rows; // diffTable[level][index]
    const n = diffTable[0].length;
    const mapped = [];
    // construct rows for each x index using leading diagonal of diffs
    for (let i = 0; i < n; i++) {
      mapped.push({ x: undefined, fx: diffTable[0][i], d1: diffTable[1]?.[i] ?? undefined, d2: diffTable[2]?.[i] ?? undefined });
    }
    rows = mapped;
  }

  return (
    <div className="bg-slate-800 rounded-xl shadow-md p-4 mt-6 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-slate-700 text-gray-300">
          <tr>
            <th className="p-2 text-center">xᵢ</th>
            <th className="p-2 text-center">f(xᵢ)</th>
            <th className="p-2 text-center">Δf</th>
            <th className="p-2 text-center">Δ²f</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-slate-700 hover:bg-slate-900 transition-colors">
              <td className="p-2 text-right">{formatNum(r.x)}</td>
              <td className="p-2 text-right">{formatNum(r.fx)}</td>
              <td className="p-2 text-right">{r.d1 !== undefined ? formatNum(r.d1) : "-"}</td>
              <td className="p-2 text-right">{r.d2 !== undefined ? formatNum(r.d2) : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
