import { formatNum } from "../../utils/math";

export default function TableRegression({ data = [], rows = null, table = null }) {
  const items = Array.isArray(data) && data.length ? data : Array.isArray(rows) && rows.length ? rows : Array.isArray(table) ? table : [];
  if (!items || items.length === 0) return null;
  const rowsData = Array.isArray(rows) && rows.length ? rows : Array.isArray(table) && table.length ? table : Array.isArray(data) ? data : [];
  if (!rowsData || rowsData.length === 0) return null;

  return (
    <div className="bg-slate-800 rounded-xl shadow-md p-4 mt-6 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-slate-700 text-gray-300">
          <tr>
            <th className="p-2 text-center">x</th>
            <th className="p-2 text-center">y</th>
            <th className="p-2 text-center">ŷ (Predicted)</th>
            <th className="p-2 text-center">Error</th>
          </tr>
        </thead>
        <tbody>
          {rowsData.map((r, idx) => {
            let err = r?.err ?? r?.error ?? r?.e ?? r?.term ?? null;
            if ((err === null || err === undefined) && idx > 0) {
              // fallback compute from predicted vs actual
              const prev = rowsData[idx - 1];
              const pred = r?.pred ?? r?.ypred ?? r?.yhat ?? r?.estimated ?? null;
              const actual = r?.y ?? r?.yi ?? r?.y1 ?? null;
              if (isFinite(pred) && isFinite(actual)) {
                err = Math.abs((pred - actual) / (actual === 0 ? 1 : actual));
              }
            }
            return (
              <tr key={idx} className="border-b border-slate-700 hover:bg-slate-900">
                <td className="p-2 text-center">{r.index ?? idx}</td>
                <td className="p-2 text-right">{formatNum(r.x ?? r.xi ?? r.x1)}</td>
                <td className="p-2 text-right">{formatNum(r.y ?? r.yi ?? r.y1)}</td>
                <td className="p-2 text-right">{formatNum(r.pred ?? r.ypred ?? r.yhat ?? r.estimated)}</td>
                <td className="p-2 text-right">{err !== null && err !== undefined ? formatNum(err) : "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
