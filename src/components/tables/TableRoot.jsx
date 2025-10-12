import { formatNum } from "../../utils/math";

function pickX(it) {
  return (
    it?.x1 ?? it?.xi ?? it?.x ?? it?.x0 ?? it?.xv ?? it?.x_val ?? it?.xValue ?? null
  );
}

function pickFx(it) {
  return (
    it?.fx1 ?? it?.fx ?? it?.f ?? it?.fy ?? it?.fx0 ?? it?.y ?? it?.yValue ?? null
  );
}

function pickIter(it, idx) {
  return it?.iter ?? it?.i ?? idx;
}

function pickError(it) {
  return it?.error ?? it?.err ?? it?.e ?? it?.term ?? null;
}

export default function TableRoot({ iterations = [] }) {
  if (!iterations || iterations.length === 0) return null;

  return (
    <div className="bg-slate-800 rounded-xl shadow-md p-4 mt-6 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-slate-700 text-gray-300">
          <tr>
            <th className="p-2 text-center">Iter</th>
            <th className="p-2 text-center">x</th>
            <th className="p-2 text-center">f(x)</th>
            <th className="p-2 text-center">Error</th>
          </tr>
        </thead>
        <tbody>
          {iterations.map((it, idx) => {
            const iterIdx = pickIter(it, idx);
            const xVal = pickX(it);
            const fxVal = pickFx(it);
            const errVal = pickError(it);
            return (
              <tr key={iterIdx} className="border-b border-slate-700 hover:bg-slate-900 transition-colors">
                <td className="p-2 text-center font-medium">{iterIdx}</td>
                <td className="p-2 text-center">{xVal !== null && xVal !== undefined ? formatNum(xVal) : "-"}</td>
                <td className="p-2 text-center">{fxVal !== null && fxVal !== undefined ? formatNum(fxVal) : "-"}</td>
                <td className="p-2 text-right">{errVal !== null && errVal !== undefined ? formatNum(errVal) : "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
