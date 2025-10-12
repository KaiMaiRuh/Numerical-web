import { useState, useEffect } from "react";
import * as BackwardDividedService from "../services/BackwardDividedService";
import useProblems from "../hooks/useProblems";
import PageHeader from "../components/PageHeader";
import SavedProblems from "../components/SavedProblems";
import GraphDifferentiation from "../components/graphs/GraphDifferentiation";
import TableDifferentiation from "../components/tables/TableDifferentiation";
import { formatNum } from "../utils/math";
import newtonBackward, { backwardDiffTable } from "../algorithms/backwardDivided";

export default function BackwardDivided() {
  const [xValues, setXValues] = useState([1, 2, 3, 4]);
  const [yValues, setYValues] = useState([1, 8, 27, 64]);
  const [xTarget, setXTarget] = useState(3.5);
  const [result, setResult] = useState("-");
  const [status, setStatus] = useState("สถานะ: ยังไม่ได้คำนวณ");
  const [table, setTable] = useState([]);

  const { problems, removingIds, refresh, saveProblem, deleteProblem } =
    useProblems(BackwardDividedService);

  useEffect(() => {
    refresh().catch(console.error);
  }, [refresh]);

  // 🧮 Run Calculation
  const handleRun = () => {
    try {
      const { result, table } = newtonBackward(xValues, yValues, xTarget);
      setResult(result);
      setTable(table);
      setStatus("สถานะ: คำนวณสำเร็จ ✅");
    } catch (err) {
      console.error(err);
      setStatus("สถานะ: เกิดข้อผิดพลาดในการคำนวณ ❌");
      setResult("-");
      setTable([]);
    }
  };

  // ♻️ Reset
  const handleReset = () => {
    setXValues([1, 2, 3, 4]);
    setYValues([1, 8, 27, 64]);
    setXTarget(3.5);
    setResult("-");
    setStatus("สถานะ: รีเซ็ตแล้ว");
    setTable([]);
  };

  // 💾 Save
  const handleSaveProblem = async () => {
    try {
      const payload = {
        x: JSON.stringify(xValues),
        y: JSON.stringify(yValues),
        xFind: xTarget,
        method: "backward_divided",
      };
      await saveProblem(payload);
      alert("บันทึกแล้ว!");
    } catch (e) {
      alert("บันทึกไม่สำเร็จ: " + (e?.message || String(e)));
    }
  };

  // 📥 Load
  const handleLoadProblem = (p) => {
    try {
      setXValues(JSON.parse(p.x));
      setYValues(JSON.parse(p.y));
      setXTarget(p.xFind);
    } catch (err) {
      alert("ไม่สามารถโหลดโจทย์: ข้อมูลไม่ถูกต้อง");
    }
  };

  // 🗑️ Delete
  const handleDeleteProblem = (p) => {
    if (confirm("ลบโจทย์นี้ไหม?")) deleteProblem(p.id);
  };

  // ฟังก์ชันอนุกรมประมาณ (ใช้กับกราฟ)
  const approxFunc = (x) => {
    const n = xValues.length;
    const h = xValues[1] - xValues[0];
    const diffTable = backwardDiffTable(yValues);
    const xN = xValues[n - 1];
    let u = (x - xN) / h;
    let fx = yValues[n - 1];
    let uTerm = 1;

    for (let i = 1; i < n; i++) {
      uTerm *= (u + i - 1) / i;
      fx += uTerm * diffTable[i][n - 1];
    }
    return fx;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <PageHeader
        title="Backward Divided-Difference"
        subtitle="Newton’s Backward Difference Interpolation"
      />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay1">
          <label className="block text-sm text-gray-400 mb-1">ค่า x (คั่นด้วย ,)</label>
          <textarea
            value={xValues.join(", ")}
            onChange={(e) =>
              setXValues(
                e.target.value.split(",").map((v) => parseFloat(v.trim()) || 0)
              )
            }
            className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 mb-3 text-sm"
          />

          <label className="block text-sm text-gray-400 mb-1">ค่า f(x) (คั่นด้วย ,)</label>
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
            value={xTarget}
            onChange={(e) => setXTarget(parseFloat(e.target.value))}
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

          <div className="text-sm mb-2 text-gray-400">{status}</div>

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
            ใช้สูตร Newton’s Backward Difference:
            <br />
            P(x) = fₙ + u∇fₙ + (u(u+1)/2!)∇²fₙ + (u(u+1)(u+2)/3!)∇³fₙ + ...
            <br />
            โดย u = (x - xₙ)/h
          </div>

          {table.length > 0 && (
            <TableDifferentiation
              steps={table.map((row, i) => ({
                x: i,
                fx: row[row.length - 1],
                d1: i === 1 ? row[row.length - 1] : undefined,
                d2: i === 2 ? row[row.length - 1] : undefined,
              }))}
            />
          )}

          {result !== "-" && (
            <div className="text-sm text-gray-300 mt-4">
              f({xTarget}) ≈ <b>{formatNum(result)}</b>
            </div>
          )}

          {/* Graph */}
          <div className="mt-6">
            <h3 className="text-gray-300 mb-2">กราฟการประมาณค่า</h3>
            <GraphDifferentiation
              func={(x) => approxFunc(x)}
              xPoints={xValues}
              width={760}
              height={300}
              className="rounded"
            />
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-400 mt-6 fade-in-delay3">
        © By KaiMaiRuh
      </div>
    </div>
  );
}
