// src/pages/LagrangeInterp.jsx
import { useState, useEffect } from "react";
import * as LagrangeService from "../services/LagrangeService";
import useProblems from "../hooks/useProblems";
import PageHeader from "../components/PageHeader";
import SavedProblems from "../components/SavedProblems";
import { formatNum } from "../utils/math";
import lagrange from "../algorithms/lagrangeInterp";
import TableLagrange from "../components/tables/TableLagrange";

export default function LagrangeInterp() {
  const [xValues, setXValues] = useState(["", "", ""]);
  const [yValues, setYValues] = useState(["", "", ""]);
  const [xTarget, setXTarget] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("สถานะ: ยังไม่ได้คำนวณ");
  const [steps, setSteps] = useState([]);

  const { problems, removingIds, refresh, saveProblem, deleteProblem } = useProblems(LagrangeService);

  useEffect(() => {
    refresh().catch(console.error);
  }, [refresh]);

  const handleRun = () => {
    try {
      const xs = xValues.map((v) => parseFloat(v));
      const ys = yValues.map((v) => parseFloat(v));
      const x = parseFloat(xTarget);

      if (xs.some(isNaN) || ys.some(isNaN) || isNaN(x)) {
        setStatus("สถานะ: โปรดกรอกข้อมูลให้ครบและเป็นตัวเลข");
        return;
      }
      if (xs.length !== ys.length) {
        setStatus("สถานะ: จำนวนค่า x และ y ต้องเท่ากัน");
        return;
      }

      const { fx, detail } = lagrange(xs, ys, x);
      setResult(fx);
      setSteps(detail);
      setStatus("สถานะ: คำนวณเสร็จสิ้น");
    } catch (e) {
      console.error(e);
      setStatus("สถานะ: เกิดข้อผิดพลาดในการคำนวณ");
    }
  };

  const handleReset = () => {
    setXValues(["", "", ""]);
    setYValues(["", "", ""]);
    setXTarget("");
    setResult(null);
    setSteps([]);
    setStatus("สถานะ: รีเซ็ตแล้ว");
  };

  const handleSaveProblem = async () => {
    try {
      const payload = {
        xValues: JSON.stringify(xValues),
        yValues: JSON.stringify(yValues),
        xTarget,
        expr: `Lagrange(${xValues.join(",")})`,
        method: "lagrange",
      };
      await saveProblem(payload);
      alert("บันทึกแล้ว!");
    } catch (e) {
      console.error("save problem failed:", e);
      alert("บันทึกไม่สำเร็จ: " + (e?.message || String(e)));
    }
  };

  const handleLoadProblem = (p) => {
    try {
      const parsedX = typeof p.xValues === "string" ? JSON.parse(p.xValues) : p.xValues || [];
      const parsedY = typeof p.yValues === "string" ? JSON.parse(p.yValues) : p.yValues || [];
      setXValues(parsedX);
      setYValues(parsedY);
      setXTarget(p.xTarget || "");
    } catch (err) {
      console.error("failed to parse saved problem", err, p);
      alert("ไม่สามารถโหลดโจทย์: ข้อมูลที่บันทึกไม่ถูกต้อง");
    }
  };

  const handleDeleteProblem = (p) => {
    if (!confirm("ลบโจทย์นี้ไหม?")) return;
    deleteProblem(p.id);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader title="Lagrange Interpolation" subtitle="หาค่า f(x) โดยใช้ Lagrange Polynomial" />

      <div className="bg-slate-800 rounded-lg p-4 shadow">
        <label className="block text-sm text-gray-400 mb-1">จำนวนจุดข้อมูล</label>
        <input
          type="number"
          value={xValues.length}
          onChange={(e) => {
            const n = Math.max(2, parseInt(e.target.value) || 2);
            setXValues(Array(n).fill(""));
            setYValues(Array(n).fill(""));
          }}
          className="w-24 px-3 py-2 rounded bg-slate-900 border border-slate-700 mb-3"
        />

        <div className="overflow-x-auto mb-3">
          <label className="block text-sm text-gray-400 mb-1">ค่าของ x และ f(x)</label>
          <table className="text-sm border-collapse">
            <thead>
              <tr className="text-gray-400">
                <th className="p-1">xᵢ</th>
                <th className="p-1">f(xᵢ)</th>
              </tr>
            </thead>
            <tbody>
              {xValues.map((_, i) => (
                <tr key={i}>
                  <td className="p-1">
                    <input
                      type="number"
                      value={xValues[i]}
                      onChange={(e) => {
                        const newX = [...xValues];
                        newX[i] = e.target.value;
                        setXValues(newX);
                      }}
                      className="w-20 px-2 py-1 rounded bg-slate-900 border border-slate-700"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      value={yValues[i]}
                      onChange={(e) => {
                        const newY = [...yValues];
                        newY[i] = e.target.value;
                        setYValues(newY);
                      }}
                      className="w-20 px-2 py-1 rounded bg-slate-900 border border-slate-700"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <label className="block text-sm text-gray-400 mb-1">ต้องการหาค่า f(x) ที่ x =</label>
        <input
          type="number"
          value={xTarget}
          onChange={(e) => setXTarget(e.target.value)}
          className="w-32 px-2 py-1 rounded bg-slate-900 border border-slate-700 mb-3"
        />

        <div className="flex gap-3 mb-3">
          <button onClick={handleRun} className="flex-1 btn-primary glow-btn py-2 rounded font-semibold">
            คำนวณ
          </button>
          <button onClick={handleReset} className="flex-1 btn-danger border border-slate-600 py-2 rounded">
            รีเซ็ต
          </button>
        </div>

        <button onClick={handleSaveProblem} className="w-full btn-primary glow-btn py-2 rounded mb-3">
          บันทึกโจทย์
        </button>

        <div className="text-sm mb-2 text-gray-400">{status}</div>

        {result !== null && (
          <div className="mt-4 text-sm text-gray-300">
            <div className="mb-2">ผลลัพธ์: {formatNum(result)}</div>
            {steps.length > 0 && (
              <div className="text-xs text-gray-400">รายละเอียดการคำนวณมีอยู่</div>
            )}
          </div>
        )}

        {result !== null && (
          <div className="mt-4">
            <TableLagrange xValues={xValues} yValues={yValues} result={result} steps={steps} xTarget={xTarget} />
          </div>
        )}

        <div className="mt-4">
          <SavedProblems problems={problems} onLoad={handleLoadProblem} onDelete={handleDeleteProblem} removingIds={removingIds} />
        </div>
      </div>

      <div className="text-sm text-gray-400 mt-6 fade-in-delay3">© By KaiMaiRuh</div>
    </div>
  );
}
