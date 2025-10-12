import { useState, useEffect } from "react";
import * as CentralDividedService from "../services/CentralDividedService";
import useProblems from "../hooks/useProblems";
import PageHeader from "../components/PageHeader";
import SavedProblems from "../components/SavedProblems";
import { formatNum } from "../utils/math";
import newtonCentral from "../algorithms/centralDivided";

export default function CentralDivided() {
  const [xValues, setXValues] = useState([1, 2, 3, 4, 5]);
  const [yValues, setYValues] = useState([1, 8, 27, 64, 125]);
  const [x, setX] = useState(3);
  const [result, setResult] = useState("-");
  const [status, setStatus] = useState("สถานะ: ยังไม่ได้คำนวณ");
  const [table, setTable] = useState([]);

  const { problems, removingIds, refresh, saveProblem, deleteProblem } =
    useProblems(CentralDividedService);

  useEffect(() => {
    refresh().catch(console.error);
  }, [refresh]);

  // algorithm moved to src/algorithms/centralDivided.js

  // ---------------- Handlers ----------------
  const handleRun = () => {
    try {
      const { result, table } = newtonCentral(xValues, yValues, x);
      setResult(result);
      setTable(table);
      setStatus("สถานะ: คำนวณสำเร็จ");
    } catch (err) {
      console.error(err);
      setStatus("สถานะ: " + (err.message || "เกิดข้อผิดพลาดในการคำนวณ"));
      setResult("-");
      setTable([]);
    }
  };

  const handleReset = () => {
    setXValues([1, 2, 3, 4, 5]);
    setYValues([1, 8, 27, 64, 125]);
    setX(3);
    setResult("-");
    setStatus("สถานะ: รีเซ็ตแล้ว");
    setTable([]);
  };

  const handleSaveProblem = async () => {
    try {
      const payload = {
        x: JSON.stringify(xValues),
        y: JSON.stringify(yValues),
        xFind: x,
        method: "central_divided",
      };
      await saveProblem(payload);
      alert("บันทึกแล้ว!");
    } catch (e) {
      alert("บันทึกไม่สำเร็จ: " + (e?.message || String(e)));
    }
  };

  const handleLoadProblem = (p) => {
    try {
      setXValues(JSON.parse(p.x));
      setYValues(JSON.parse(p.y));
      setX(p.xFind);
    } catch {
      alert("ไม่สามารถโหลดโจทย์ได้");
    }
  };

  const handleDeleteProblem = (p) => {
    if (confirm("ลบโจทย์นี้ไหม?")) deleteProblem(p.id);
  };

  // ---------------- UI ----------------
  return (
    <div className="max-w-6xl mx-auto p-6">
      <PageHeader
        title="Central Divided-Difference"
        subtitle="Newton’s Central Difference Interpolation"
      />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay1">
          <label className="block text-sm text-gray-400 mb-1">
            ค่า x (คั่นด้วย ,)
          </label>
          <textarea
            value={xValues.join(", ")}
            onChange={(e) =>
              setXValues(
                e.target.value.split(",").map((v) => parseFloat(v.trim()) || 0)
              )
            }
            className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 mb-3 text-sm"
          />

          <label className="block text-sm text-gray-400 mb-1">
            ค่า f(x) (คั่นด้วย ,)
          </label>
          <textarea
            value={yValues.join(", ")}
            onChange={(e) =>
              setYValues(
                e.target.value.split(",").map((v) => parseFloat(v.trim()) || 0)
              )
            }
            className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 mb-3 text-sm"
          />

          <label className="block text-sm text-gray-400 mb-1">
            ค่าที่ต้องการประมาณ (x)
          </label>
          <input
            type="number"
            value={x}
            onChange={(e) => setX(parseFloat(e.target.value))}
            className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 mb-3"
          />

          <div className="flex gap-3 mb-3">
            <button
              onClick={handleRun}
              className="flex-1 btn-primary glow-btn py-2 rounded font-semibold"
            >
              คำนวณ
            </button>
            <button
              onClick={handleReset}
              className="flex-1 btn-danger border border-slate-600 py-2 rounded"
            >
              รีเซ็ต
            </button>
          </div>

          <button
            onClick={handleSaveProblem}
            className="w-full btn-primary glow-btn py-2 rounded mb-3"
          >
            บันทึกโจทย์
          </button>

          <div className="text-sm mb-2">{status}</div>

          <SavedProblems
            problems={problems}
            onLoad={handleLoadProblem}
            onDelete={handleDeleteProblem}
            removingIds={removingIds}
          />
        </div>

        {/* Output Section */}
        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay2">
          <h3 className="text-gray-300 mb-2">ผลลัพธ์</h3>
          <div className="text-sm text-gray-400 mb-3">
            สูตร Newton’s Central Difference:
            <br />
            P(x) = fₘ + uδfₘ + (u(u−1)/2!)δ²fₘ + (u(u−1)(u+1)/3!)δ³fₘ + …
            <br />
            โดย u = (x − xₘ)/h
          </div>

          {table.length > 0 && (
            <div className="overflow-x-auto mb-3 text-sm text-gray-300">
              <table className="min-w-full border border-slate-700">
                <thead>
                  <tr className="bg-slate-700">
                    <th className="px-2 py-1 border border-slate-600">ลำดับ</th>
                    <th className="px-2 py-1 border border-slate-600">δⁿ fₘ</th>
                  </tr>
                </thead>
                <tbody>
                  {table.map((row, i) => (
                    <tr key={i}>
                      <td className="px-2 py-1 border border-slate-700 text-center">
                        δ{i === 0 ? "⁰" : i}
                      </td>
                      <td className="px-2 py-1 border border-slate-700">
                        {formatNum(row[Math.floor(row.length / 2)])}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {result !== "-" && (
            <div className="text-sm text-gray-300">
              f({x}) ≈ <b>{formatNum(result)}</b>
            </div>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-400 mt-6 fade-in-delay3">
        © By KaiMaiRuh
      </div>
    </div>
  );
}
