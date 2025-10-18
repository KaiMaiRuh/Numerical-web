// src/pages/FirstDivided.jsx
import { useState, useEffect } from "react";
import * as FirstDividedService from "../services/FirstDividedService";
import useProblems from "../hooks/useProblems";
import PageHeader from "../components/PageHeader";
import SavedProblems from "../components/SavedProblems";
import { formatNum } from "../utils/math";
import firstDividedDiff from "../algorithms/firstDivided";

export default function FirstDivided() {
  const [x0, setX0] = useState(1);
  const [x1, setX1] = useState(2);
  const [fx0, setFx0] = useState(2);
  const [fx1, setFx1] = useState(5);
  const [x, setX] = useState(1.5);
  const [result, setResult] = useState("-");
  const [diff, setDiff] = useState("-");
  const [status, setStatus] = useState("สถานะ: ยังไม่ได้คำนวณ");

  const { problems, removingIds, refresh, saveProblem, deleteProblem } = useProblems(FirstDividedService);

  useEffect(() => {
    refresh().catch(console.error);
  }, [refresh]);

  const handleRun = () => {
    try {
      const { f01, Px } = firstDividedDiff(x0, x1, fx0, fx1, x);
      setDiff(f01);
      setResult(Px);
      setStatus("สถานะ: คำนวณเสร็จสิ้น");
    } catch (err) {
      console.error(err);
      setStatus("สถานะ: เกิดข้อผิดพลาดในการคำนวณ");
    }
  };

  const handleReset = () => {
    setX0(1);
    setX1(2);
    setFx0(2);
    setFx1(5);
    setX(1.5);
    setResult("-");
    setDiff("-");
    setStatus("สถานะ: รีเซ็ตแล้ว");
  };

  const handleSaveProblem = async () => {
    try {
      const payload = { x0, x1, fx0, fx1, x, method: "first_divided" };
      await saveProblem(payload);
      alert("บันทึกแล้ว!");
    } catch (e) {
      alert("บันทึกไม่สำเร็จ: " + (e?.message || String(e)));
    }
  };

  const handleLoadProblem = (p) => {
    setX0(p.x0);
    setX1(p.x1);
    setFx0(p.fx0);
    setFx1(p.fx1);
    setX(p.x);
  };

  const handleDeleteProblem = (p) => {
    if (confirm("ลบโจทย์นี้ไหม?")) deleteProblem(p.id);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader
        title="First Divided-Difference"
        subtitle="การประมาณเชิงเส้นด้วย Newton’s First Divided-Difference"
      />

      <div className="bg-slate-800 rounded-lg p-4 shadow">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">x₀</label>
            <input
              type="number"
              value={x0}
              onChange={(e) => setX0(parseFloat(e.target.value))}
              className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">f(x₀)</label>
            <input
              type="number"
              value={fx0}
              onChange={(e) => setFx0(parseFloat(e.target.value))}
              className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">x₁</label>
            <input
              type="number"
              value={x1}
              onChange={(e) => setX1(parseFloat(e.target.value))}
              className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">f(x₁)</label>
            <input
              type="number"
              value={fx1}
              onChange={(e) => setFx1(parseFloat(e.target.value))}
              className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-sm text-gray-400 mb-1">ค่าที่ต้องการประมาณ (x)</label>
          <input
            type="number"
            value={x}
            onChange={(e) => setX(parseFloat(e.target.value))}
            className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700"
          />
        </div>

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

        <div className="text-sm mb-2 text-gray-300">{status}</div>

        <SavedProblems problems={problems} onLoad={handleLoadProblem} onDelete={handleDeleteProblem} removingIds={removingIds} />

        {/* Inline results */}
        {result !== "-" && (
          <div className="mt-4 text-sm text-gray-200">
            <div>ผลลัพธ์ P(x) = {formatNum(result)}</div>
            <div>First divided diff = {formatNum(diff)}</div>
          </div>
        )}

        <div className="text-sm text-gray-400 mt-6 fade-in-delay3">© By KaiMaiRuh</div>
      </div>
    </div>
  );
}
