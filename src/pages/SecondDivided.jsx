import { useState, useEffect } from "react";
import * as SecondDividedService from "../services/SecondDividedService";
import useProblems from "../hooks/useProblems";
import PageHeader from "../components/PageHeader";
import SavedProblems from "../components/SavedProblems";
import { formatNum } from "../utils/math";
import secondDividedDiff from "../algorithms/secondDivided";

export default function SecondDivided() {
  const [x0, setX0] = useState(1);
  const [x1, setX1] = useState(2);
  const [x2, setX2] = useState(3);
  const [fx0, setFx0] = useState(2);
  const [fx1, setFx1] = useState(5);
  const [fx2, setFx2] = useState(10);
  const [x, setX] = useState(2.5);

  const [f01, setF01] = useState("-");
  const [f12, setF12] = useState("-");
  const [f012, setF012] = useState("-");
  const [result, setResult] = useState("-");
  const [status, setStatus] = useState("สถานะ: ยังไม่ได้คำนวณ");

  const { problems, removingIds, refresh, saveProblem, deleteProblem } =
    useProblems(SecondDividedService);

  useEffect(() => {
    refresh().catch(console.error);
  }, [refresh]);

  // Algorithm moved to src/algorithms/secondDivided.js

  // ---------------- Handlers ----------------
  const handleRun = () => {
    try {
      const { f01, f12, f012, Px } = secondDividedDiff(
        x0,
        x1,
        x2,
        fx0,
        fx1,
        fx2,
        x
      );
      setF01(f01);
      setF12(f12);
      setF012(f012);
      setResult(Px);
      setStatus("สถานะ: คำนวณสำเร็จ");
    } catch (err) {
      console.error(err);
      setStatus("สถานะ: เกิดข้อผิดพลาดในการคำนวณ");
    }
  };

  const handleReset = () => {
    setX0(1);
    setX1(2);
    setX2(3);
    setFx0(2);
    setFx1(5);
    setFx2(10);
    setX(2.5);
    setResult("-");
    setF01("-");
    setF12("-");
    setF012("-");
    setStatus("สถานะ: รีเซ็ตแล้ว");
  };

  const handleSaveProblem = async () => {
    try {
      const payload = { x0, x1, x2, fx0, fx1, fx2, x, method: "second_divided" };
      await saveProblem(payload);
      alert("บันทึกแล้ว!");
    } catch (e) {
      alert("บันทึกไม่สำเร็จ: " + (e?.message || String(e)));
    }
  };

  const handleLoadProblem = (p) => {
    setX0(p.x0);
    setX1(p.x1);
    setX2(p.x2);
    setFx0(p.fx0);
    setFx1(p.fx1);
    setFx2(p.fx2);
    setX(p.x);
  };

  const handleDeleteProblem = (p) => {
    if (confirm("ลบโจทย์นี้ไหม?")) deleteProblem(p.id);
  };

  // ---------------- UI ----------------
  return (
    <div className="max-w-6xl mx-auto p-6">
      <PageHeader
        title="Second Divided-Difference"
        subtitle="การประมาณเชิงกำลังสองด้วย Newton’s Second Divided-Difference"
      />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay1">
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">x₀</label>
              <input
                type="number"
                value={x0}
                onChange={(e) => setX0(parseFloat(e.target.value))}
                className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700"
              />
              <label className="block text-sm text-gray-400 mb-1 mt-1">f(x₀)</label>
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
              <label className="block text-sm text-gray-400 mb-1 mt-1">f(x₁)</label>
              <input
                type="number"
                value={fx1}
                onChange={(e) => setFx1(parseFloat(e.target.value))}
                className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">x₂</label>
              <input
                type="number"
                value={x2}
                onChange={(e) => setX2(parseFloat(e.target.value))}
                className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700"
              />
              <label className="block text-sm text-gray-400 mb-1 mt-1">f(x₂)</label>
              <input
                type="number"
                value={fx2}
                onChange={(e) => setFx2(parseFloat(e.target.value))}
                className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm text-gray-400 mb-1">
              ค่าที่ต้องการประมาณ (x)
            </label>
            <input
              type="number"
              value={x}
              onChange={(e) => setX(parseFloat(e.target.value))}
              className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700"
            />
          </div>

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

        {/* Output */}
        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay2">
          <h3 className="text-gray-300 mb-2">ผลลัพธ์</h3>
          <div className="text-sm text-gray-400 mb-3">
            ใช้สูตร:
            <br />
            f[x₀, x₁] = (f₁ - f₀) / (x₁ - x₀)
            <br />
            f[x₁, x₂] = (f₂ - f₁) / (x₂ - x₁)
            <br />
            f[x₀, x₁, x₂] = (f[x₁, x₂] - f[x₀, x₁]) / (x₂ - x₀)
            <br />
            P₂(x) = f₀ + f[x₀,x₁](x-x₀) + f[x₀,x₁,x₂](x-x₀)(x-x₁)
          </div>

          {f012 !== "-" && (
            <div className="text-sm text-gray-300">
              <p>f[x₀, x₁] = {formatNum(f01)}</p>
              <p>f[x₁, x₂] = {formatNum(f12)}</p>
              <p>f[x₀, x₁, x₂] = {formatNum(f012)}</p>
              <p className="mt-2">
                f({x}) ≈ <b>{formatNum(result)}</b>
              </p>
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
