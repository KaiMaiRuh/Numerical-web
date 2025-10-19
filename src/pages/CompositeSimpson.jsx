// src/pages/CompositeSimpson.jsx
import { useState, useEffect } from "react";
import * as CompositeSimpsonService from "../services/CompositeSimpsonService";
import useProblems from "../hooks/useProblems";
import PageHeader from "../components/PageHeader";
import SavedProblems from "../components/SavedProblems";
import { formatNum, makeFunc, evalx } from "../utils/math";
import compositeSimpson from "../algorithms/compositeSimpson";

// ✅ ระบบ unified ใหม่
// Integration graph/table removed per configuration

export default function CompositeSimpson() {
  const [expr, setExpr] = useState("");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [n, setN] = useState(); // panels default left as 4 (allowed)
  const [result, setResult] = useState("-");
  const [status, setStatus] = useState("สถานะ: ยังไม่ได้คำนวณ");
  const [table, setTable] = useState([]);

  const { problems, removingIds, refresh, saveProblem, deleteProblem } =
    useProblems(CompositeSimpsonService);

  useEffect(() => {
    refresh().catch(console.error);
  }, [refresh]);

  // ---------------- Calculation ----------------
  const safeFunc = makeFunc(expr) || ((x) => evalx(expr, x));

  // ---------------- Handlers ----------------
  const handleRun = () => {
    try {
      // The UI `n` is the number of Simpson panels (parabolas). Composite Simpson requires an even
      // number of subintervals = 2 * panels. Convert here so the formula matches the documentation.
  const subintervals = Math.max(2, Math.floor(n) * 2);
  const { I, h, rows } = compositeSimpson(parseFloat(a), parseFloat(b), subintervals, safeFunc);
      setResult(I);
      setTable(rows);
      setStatus(`สถานะ: คำนวณสำเร็จ (h = ${formatNum(h)})`);
    } catch (err) {
      console.error(err);
      setResult("-");
      setStatus("สถานะ: " + (err.message || "เกิดข้อผิดพลาดในการคำนวณ"));
      setTable([]);
    }
  };

  const handleReset = () => {
    setExpr("");
    setA("");
    setB("");
    setN(4);
    setResult("-");
    setStatus("สถานะ: รีเซ็ตแล้ว");
    setTable([]);
  };

  const handleSaveProblem = async () => {
    try {
      const payload = { expr, a, b, n, method: "composite_simpson" };
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
    setN(p.n);
  };

  const handleDeleteProblem = (p) => {
    if (confirm("ลบโจทย์นี้ไหม?")) deleteProblem(p.id);
  };


  // ---------------- UI ----------------
  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader
        title="Composite Simpson’s Rule (1/3)"
        subtitle="การอินทิเกรตเชิงตัวเลขแบบหลายช่วงด้วย Simpson’s Rule"
      />

      <div className="bg-slate-800 rounded-lg p-4 shadow">
        {/* ===== Input Section ===== */}
        <label className="block text-sm text-gray-400 mb-1">ฟังก์ชัน f(x)</label>
        <input
          type="text"
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 mb-3"
          placeholder="กรอกสมการ เช่น x^2 + 1"
        />

        <div className="grid grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">a</label>
            <input
              type="number"
              value={a}
              onChange={(e) => setA(parseFloat(e.target.value))}
              className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">b</label>
            <input
              type="number"
              value={b}
              onChange={(e) => setB(parseFloat(e.target.value))}
              className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">n (คู่)</label>
            <input
              type="number"
              value={n}
              onChange={(e) => setN(Math.max(2, parseInt(e.target.value) || 2))}
              className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700"
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

        <div className="text-sm mb-2 text-gray-300">{status}</div>

        <SavedProblems
          problems={problems}
          onLoad={handleLoadProblem}
          onDelete={handleDeleteProblem}
          removingIds={removingIds}
        />

        {/* Inline result */}
        {result !== "-" && (
          <div className="mt-3 text-gray-300 text-sm">
            ค่าประมาณของ I ≈ <b>{formatNum(result)}</b>
          </div>
        )}

        {/* Results table removed per configuration */}
      </div>

      <div className="text-sm text-gray-400 mt-6 fade-in-delay3">© By KaiMaiRuh</div>
    </div>
  );
}
