// src/pages/SingleTrapezoidal.jsx
import { useState, useEffect } from "react";
import * as SingleTrapezoidalService from "../services/SingleTrapezoidalService";
import useProblems from "../hooks/useProblems";
import PageHeader from "../components/PageHeader";
import SavedProblems from "../components/SavedProblems";
import { makeFunc, formatNum } from "../utils/math";
import singleTrapezoidal from "../algorithms/singleTrapezoidal";

export default function SingleTrapezoidal() {
  const [expr, setExpr] = useState("");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [result, setResult] = useState("-");
  const [status, setStatus] = useState("สถานะ: ยังไม่ได้คำนวณ");

  const { problems, removingIds, refresh, saveProblem, deleteProblem } =
    useProblems(SingleTrapezoidalService);

  useEffect(() => {
    refresh().catch(console.error);
  }, [refresh]);

  const handleRun = () => {
    const f = makeFunc(expr);
    if (!f) {
      setStatus("สถานะ: ฟังก์ชันไม่ถูกต้อง");
      return;
    }

    try {
      const { I, h, fa, fb } = singleTrapezoidal(parseFloat(a), parseFloat(b), f);
      setResult(I);
      setStatus(
        `สถานะ: คำนวณสำเร็จ (h = ${formatNum(h)}, f(a)=${formatNum(
          fa
        )}, f(b)=${formatNum(fb)})`
      );
    } catch (err) {
      console.error(err);
      setResult("-");
      setStatus("สถานะ: " + (err.message || "เกิดข้อผิดพลาดในการคำนวณ"));
    }
  };

  const handleReset = () => {
    setExpr("");
    setA("");
    setB("");
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

  const f = makeFunc(expr) || ((x) => x);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader
        title="Single Trapezoidal Rule"
        subtitle="การอินทิเกรตเชิงตัวเลขแบบ Trapezoidal (ช่วงเดียว)"
      />

      <div className="bg-slate-800 rounded-lg p-4 shadow">
        <label className="block text-sm text-gray-400 mb-1">ฟังก์ชัน f(x)</label>
        <input
          type="text"
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          placeholder="กรอกสมการ เช่น x^2 + 1"
          className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 mb-3"
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

        <div className="text-sm text-gray-300 mb-2">{status}</div>

        {result !== "-" && (
            <div className="mt-4 text-sm text-gray-300">
            <div className="mb-1">ผลลัพธ์:</div>
            <p>h = {formatNum(parseFloat(b) - parseFloat(a))}</p>
            <p>
              f(a) = {formatNum(f(parseFloat(a)))}, f(b) = {formatNum(f(parseFloat(b)))}
            </p>
            <p className="mt-2">
              ค่าประมาณของ I ≈ <b>{formatNum(result)}</b>
            </p>
            <p className="text-gray-400 mt-1">
              ใช้สูตร: I = (h / 2) [f(a) + f(b)]
            </p>
          </div>
        )}

        <div className="mt-4">
          <SavedProblems
            problems={problems}
            onLoad={handleLoadProblem}
            onDelete={handleDeleteProblem}
            removingIds={removingIds}
          />
        </div>
      </div>

      <div className="text-sm text-gray-400 mt-6 fade-in-delay3">© By KaiMaiRuh</div>
    </div>
  );
}
