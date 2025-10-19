import React from "react";

function fmtVec(v) {
  if (!Array.isArray(v)) return "-";
  return "{ " + v.map((x) => (Number.isFinite(x) ? x.toFixed(6) : "-")).join("\n ") + " }";
}

export default function TableConjugateGradient({ iterations = [] }) {
  if (!iterations || iterations.length === 0) return null;
  return (
    <div className="bg-slate-800 rounded-xl shadow-md p-4 mt-6 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-slate-700 text-gray-300">
          <tr>
            <th className="p-2 text-center">Iter</th>
            <th className="p-2 text-center">λₖ₋₁</th>
            <th className="p-2 text-center">Dₖ₋₁</th>
            <th className="p-2 text-center">Xₖ</th>
            <th className="p-2 text-center">Rₖ</th>
            <th className="p-2 text-center">errorₖ</th>
          </tr>
        </thead>
        <tbody>
          {iterations.map((it, i) => (
            <tr key={i} className="border-b border-slate-700 hover:bg-slate-900 align-top">
              <td className="p-2 text-center align-top">{it.iter ?? i}</td>
              <td className="p-2 text-right align-top">{it.alpha ? it.alpha.toFixed(6) : "-"}</td>
              <td className="p-2 text-right align-top">{it.beta ? it.beta.toFixed(6) : "-"}</td>
              <td className="p-2 text-right align-top whitespace-pre">{fmtVec(it.x)}</td>
              <td className="p-2 text-right align-top whitespace-pre">{fmtVec(it.residual)}</td>
              <td className="p-2 text-right align-top">{it.error ? it.error.toFixed(6) : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-center text-sm text-gray-400 mt-2">Total number of iterations: {iterations.length}</div>
    </div>
  );
}
