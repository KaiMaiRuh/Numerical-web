import React from "react";
import { formatNum } from "../../utils/math";
import lagrange from "../../algorithms/lagrangeInterp";

export default function TableLagrange({ xValues = [], yValues = [], xTarget = null, result = null, steps = [] }) {
  if (!xValues || xValues.length === 0) return null;

  const xsNum = xValues.map(Number);
  let details = steps && steps.length ? steps : [];
  // If no precomputed steps, but xTarget is numeric, compute detail for that x
  if ((!details || details.length === 0) && Number.isFinite(parseFloat(xTarget))) {
    try {
      details = lagrange(xsNum, yValues.map(Number), parseFloat(xTarget)).detail || [];
    } catch (e) {
      details = [];
    }
  }

  return (
    <div className="mt-4 bg-slate-900 p-3 rounded">
      <div className="text-sm text-gray-300 mb-2">ตารางผลลัพธ์ (ค่า L_i ตามสูตร)</div>
      <table className="w-full text-sm border-collapse">
        <thead className="text-gray-400">
          <tr>
            <th className="p-2 text-left">i</th>
            <th className="p-2 text-left">สูตร L_i(x)</th>
            <th className="p-2 text-left">ค่า L_i({xTarget ?? "x"})</th>
          </tr>
        </thead>
        <tbody>
          {details.map((d, i) => (
            <tr key={i} className="border-b border-slate-700 hover:bg-slate-900 align-top">
              <td className="p-2 align-top">{i}</td>
              <td className="p-2 align-top whitespace-pre-wrap text-xs text-gray-200">{d.LiStr}</td>
              <td className="p-2 align-top">{Number.isFinite(d.Li) ? formatNum(d.Li) : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
