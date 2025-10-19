import React from "react";
import { formatNum } from "../../utils/math";
import { newtonPolynomial } from "../../algorithms/polynomialInterp";

export default function TableNewtonDD({ xValues = [], yValues = [], ddTable = [] }) {
  if (!xValues || xValues.length === 0) return null;

  const xsNum = xValues.map(Number);

  return (
    <div className="mt-4 bg-slate-900 p-3 rounded">
      <div className="text-sm text-gray-300 mb-2">ตารางผลลัพธ์ (ตรวจสอบแต่ละจุด)</div>
      <table className="w-full text-sm border-collapse">
        <thead className="text-gray-400">
          <tr>
            <th className="p-2 text-left">xᵢ</th>
            <th className="p-2 text-left">f(xᵢ)</th>
            <th className="p-2 text-left">Pₙ(xᵢ)</th>
          </tr>
        </thead>
        <tbody>
          {xValues.map((vx, i) => {
            const xi = parseFloat(vx);
            const pn = Number.isFinite(xi) ? newtonPolynomial(xsNum, ddTable, xi) : NaN;
            return (
              <tr key={i} className="border-b border-slate-700 hover:bg-slate-900">
                <td className="p-2">{vx}</td>
                <td className="p-2">{yValues[i]}</td>
                <td className="p-2">{Number.isFinite(pn) ? formatNum(pn) : "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
