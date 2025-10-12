import { useState, useEffect } from "react";
import * as SingleTrapService from "../services/SingleTrapezoidalService";
import useProblems from "../hooks/useProblems";
import PageHeader from "../components/PageHeader";
import SavedProblems from "../components/SavedProblems";
import { formatNum } from "../utils/math";
import trapezoidal from "../algorithms/singleTrapezoidal";

export default function SingleTrapezoidal() {
  const [expr, setExpr] = useState("x^2 + 1");
  const [a, setA] = useState(0);
  const [b, setB] = useState(2);
  const [result, setResult] = useState("-");
  const [status, setStatus] = useState("สถานะ: ยังไม่ได้คำนวณ");

  const { problems, removingIds, refresh, saveProblem, deleteProblem } =
    useProblems(SingleTrapService);

  useEffect(() => {
    refresh().catch(console.error);
  }, [refresh]);

  // Algorithm moved to src/algorithms/singleTrapezoidal.js

  // ---------------- Handlers ----------------
  const handleRun = () => {
    try {
      const I = trapezoidal(a, b, f);
      setResult(I);
      setStatus("สถานะ: คำนวณสำเร็จ");
    } catch (err) {
      console.error(err);
      setStatus("สถานะ: เกิดข้อผิดพลาดในการคำนวณ");
      setResult("-");
    }
  };

  const handleReset = () => {
    setExpr("x^2 + 1");
    setA(0);
    setB(2);
    setResult("-");
    setStatus("สถานะ: รีเซ็ตแล้ว");
  };

  const handleSaveProblem = async () => {
    try {
      const payload = { expr, a, b, method: "single_trapezoidal" };
      await saveProblem(payload);
      alert("บันทึกแล้ว!");
    } catch (e) {
      alert("บันทึกไม่สำเร็จ: " + (e?.message || String(e)));
    }
  };

  const handleLoadProblem = (p) => {
    setExpr(p.expr);
    setA(p.a);
    setB(p.b);
  };

  const handleDeleteProblem = (p) => {
    if (confirm("ลบโจทย์นี้ไหม?")) deleteProblem(p.id);
  };

  // ---------------- UI ----------------
  return (
    <div className="max-w-6xl mx-auto p-6">
      <PageHeader
        title="Single Trapezoidal Rule"
        subtitle="หาค่าประมาณเชิงตัวเลขของการอินทิเกรตแบบ Trapezoidal (หนึ่งช่วง)"
      />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Zone */}
        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay1">
          <label className="block text-sm text-gray-400 mb-1">
            ฟังก์ชัน f(x)
          </label>
          <input
            type="text"
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 mb-3"
            placeholder="กรอกสมการ เช่น x^2 + 1"
          />

          <div className="flex gap-3 mb-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">a</label>
              <input
                type="number"
                value={a}
                onChange={(e) => setA(parseFloat(e.target.value))}
                className="w-24 px-2 py-1 rounded bg-slate-900 border border-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">b</label>
              <input
                type="number"
                value={b}
                onChange={(e) => setB(parseFloat(e.target.value))}
                className="w-24 px-2 py-1 rounded bg-slate-900 border border-slate-700"
              />
            </div>
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

        {/* Output Zone */}
        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay2">
          <h3 className="text-gray-300 mb-2">ผลลัพธ์</h3>
          <div className="text-sm text-gray-400 mb-3">
            ใช้สูตร: I = (h / 2) [f(a) + f(b)], โดย h = b - a
          </div>
          {result !== "-" && (
            <div className="text-gray-300 text-sm">
              <p>h = {formatNum(b - a)}</p>
              <p>
                f(a) = {formatNum(f(a))}, f(b) = {formatNum(f(b))}
              </p>
              <p className="mt-2">
                ค่าประมาณของ I ≈ <b>{formatNum(result)}</b>
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