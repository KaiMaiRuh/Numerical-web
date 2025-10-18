import React from "react";

export default function TableConjugateGradient({ iterations = [] }) {
  if (!iterations || iterations.length === 0) return null;
  return (
    <div className="bg-slate-800 rounded-xl shadow-md p-4 mt-6 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-slate-700 text-gray-300">
          <tr>
            <th className="p-2 text-center">Iter</th>
            <th className="p-2 text-center">Residual</th>
            <th className="p-2 text-center">Notes</th>
          </tr>
        </thead>
        <tbody>
          {iterations.map((it, i) => (
            <tr key={i} className="border-b border-slate-700 hover:bg-slate-900">
              <td className="p-2 text-center">{it.iter ?? i}</td>
              <td className="p-2 text-right">{it.residual ?? "-"}</td>
              <td className="p-2">{it.note ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
