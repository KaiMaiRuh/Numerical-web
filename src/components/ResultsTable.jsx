import React from "react";
import { formatNum } from "../utils/math";

export default function ResultsTable({ iterations = [] }) {
  if (!iterations || iterations.length === 0) return null;
  return (
    <div className="bg-slate-800 rounded-lg p-4 shadow mt-6 overflow-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-slate-700 text-gray-200">
            <th className="p-2 text-right">iter</th>
            <th className="p-2 text-right">xl</th>
            <th className="p-2 text-right">xr</th>
            <th className="p-2 text-right">x1</th>
            <th className="p-2 text-right">f(x1)</th>
            <th className="p-2 text-right">error</th>
          </tr>
        </thead>
        <tbody>
          {iterations.map((r) => (
            <tr key={r.iter} className="border-b border-slate-700 text-gray-100">
              <td className="p-2 text-right">{r.iter}</td>
              <td className="p-2 text-right">{formatNum(r.xl)}</td>
              <td className="p-2 text-right">{formatNum(r.xr)}</td>
              <td className="p-2 text-right">{formatNum(r.x1)}</td>
              <td className="p-2 text-right">{formatNum(r.fx1)}</td>
              <td className="p-2 text-right">{r.error === null ? "-" : formatNum(r.error)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
