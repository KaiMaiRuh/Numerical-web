import { formatNum } from "../../utils/math";

export default function TableLinearSystem({ iterations = [], solution = null, data = null }) {
  // If `iterations` is provided and is an array, prefer it (detailed per-iteration history).
  // Otherwise, `solution` may be either an array of iteration rows or a flat solution vector.
  const hasIterations = Array.isArray(iterations) && iterations.length;
  const isFlatSolution = Array.isArray(solution) && solution.length && typeof solution[0] === "number";

  // If we have no useful data, bail out.
  if (!hasIterations && !isFlatSolution && !Array.isArray(data)) return null;

  // variableCount: number of unknowns
  const variableCount = (isFlatSolution ? solution.length : (hasIterations ? (iterations[0]?.x?.length || iterations[0]?.values?.length || 0) : (data[0]?.x?.length || 0)));

  return (
    <div className="bg-slate-800 rounded-xl shadow-md p-4 mt-6 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-slate-700 text-gray-300">
          <tr>
            <th className="p-2 text-center">Iter</th>
            {[...Array(variableCount)].map((_, i) => (
              <th key={i} className="p-2 text-center">
                x{i + 1}
              </th>
            ))}
            <th className="p-2 text-center">Error</th>
          </tr>
        </thead>
        <tbody>
          {hasIterations
            ? iterations.map((it, idx) => {
                // extract common error keys
                let err = it?.error ?? it?.err ?? it?.e ?? it?.term ?? null;
                // fallback: compute relative difference of normed solution vectors if possible
                if ((err === null || err === undefined) && idx > 0) {
                  const prev = iterations[idx - 1];
                  const curX = it?.x ?? it?.values ?? it?.solution ?? null;
                  const prevX = prev?.x ?? prev?.values ?? prev?.solution ?? null;
                  if (Array.isArray(curX) && Array.isArray(prevX) && curX.length === prevX.length) {
                    // compute relative vector norm difference
                    let num = 0;
                    let den = 0;
                    for (let k = 0; k < curX.length; k++) {
                      const a = Number(curX[k]);
                      const b = Number(prevX[k]);
                      if (isFinite(a) && isFinite(b)) {
                        num += (a - b) * (a - b);
                        den += a * a;
                      }
                    }
                    if (den === 0) den = 1;
                    err = Math.sqrt(num) / Math.sqrt(den);
                  }
                }
                const rowVals = it?.x ?? it?.values ?? it?.solution ?? [];
                return (
                  <tr key={idx} className="border-b border-slate-700 hover:bg-slate-900">
                    <td className="p-2 text-center font-medium">{it.iter ?? idx}</td>
                    {(rowVals || []).map((v, j) => (
                      <td key={j} className="p-2 text-right">{formatNum(v)}</td>
                    ))}
                    <td className="p-2 text-right">{err !== null && err !== undefined ? formatNum(err) : "-"}</td>
                  </tr>
                );
              })
            : /* flat solution: render a single row */ (
                <tr className="border-b border-slate-700 hover:bg-slate-900">
                  <td className="p-2 text-center font-medium">{"result"}</td>
                  {solution.map((v, j) => (
                    <td key={j} className="p-2 text-right">{formatNum(v)}</td>
                  ))}
                  {/* if iterations exist in props (maybe caller stored them elsewhere), show last error, otherwise '-' */}
                  <td className="p-2 text-right">
                    {Array.isArray(iterations) && iterations.length
                      ? formatNum((iterations[iterations.length - 1]?.error ?? iterations[iterations.length - 1]?.err ?? iterations[iterations.length - 1]?.e ?? "-"))
                      : "-"}
                  </td>
                </tr>
              )}
        </tbody>
      </table>
    </div>
  );
}
