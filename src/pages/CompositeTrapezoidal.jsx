// src/pages/CompositeTrapezoidal.jsx
import { useState, useEffect } from "react";
import * as CompositeTrapService from "../services/CompositeTrapezoidalService";
import useProblems from "../hooks/useProblems";
import PageHeader from "../components/PageHeader";
import SavedProblems from "../components/SavedProblems";
import { formatNum, makeFunc, evalx } from "../utils/math";
import compositeTrapezoidal from "../algorithms/compositeTrapezoidal";

// ✅ ระบบ unified ใหม่
// Integration graph/table removed per configuration
// import GraphIntegration from "../components/graphs/GraphIntegration";
// import TableIntegration from "../components/tables/TableIntegration";

export default function CompositeTrapezoidal() {
  const [expr, setExpr] = useState("");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [n, setN] = useState("");
  const [result, setResult] = useState("-");
  const [status, setStatus] = useState("สถานะ: ยังไม่ได้คำนวณ");
  const [table, setTable] = useState([]);

  const { problems, removingIds, refresh, saveProblem, deleteProblem } =
    useProblems(CompositeTrapService);

  useEffect(() => {
    refresh().catch(console.error);
  }, [refresh]);

  // ---------------- Calculation ----------------
  // Use a unified safe function creator: prefer makeFunc(expr), fallback to evalx
  const safeFunc = makeFunc(expr) || ((x) => evalx(expr, x));

  // ---------------- Handlers ----------------
  const handleRun = () => {
    try {
  const { I, h, rows } = compositeTrapezoidal(a, b, n, safeFunc);
      setResult(I);
      setTable(rows);
      setStatus(`สถานะ: คำนวณสำเร็จ (h = ${formatNum(h)})`);
    } catch (err) {
      console.error(err);
      setResult("-");
      setStatus("สถานะ: เกิดข้อผิดพลาดในการคำนวณ");
      setTable([]);
    }
  };

  const handleReset = () => {
    setExpr("x^2 + 1");
    setA(0);
    setB(2);
    setN(4);
    setResult("-");
    setStatus("สถานะ: รีเซ็ตแล้ว");
    setTable([]);
  };

  const handleSaveProblem = async () => {
    try {
      const payload = { expr, a, b, n, method: "composite_trapezoidal" };
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

  // safeFunc already defined above

  // ---------------- UI ----------------
  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader
        title="Composite Trapezoidal Rule"
        subtitle="การอินทิเกรตเชิงตัวเลขแบบหลายช่วงด้วย Trapezoidal Rule"
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
            <label className="block text-sm text-gray-400 mb-1">n</label>
            <input
              type="number"
              value={n}
              onChange={(e) => setN(Math.max(1, parseInt(e.target.value) || 1))}
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

        {/* Inline result (explanatory, no table) */}
        {result !== "-" && (
          <div className="mt-3 text-gray-300 text-sm">
            <div className="mb-2">ผลลัพธ์:</div>
            <p>h = {formatNum((b - a) / n)}</p>
            <p>f(a) = {formatNum(safeFunc(a))}, f(b) = {formatNum(safeFunc(b))}</p>
            <p className="mt-2">ค่าประมาณของ I ≈ <b>{formatNum(result)}</b></p>
            <p className="text-gray-400 mt-1">สูตร: I = (h/2)[f(a) + 2Σ f(xᵢ) + f(b)] (Σ สำหรับ i = 1..n-1)</p>
            <p className="text-gray-400 mt-1">แบ่งเป็น {n} ช่วง (interior points = {Math.max(0, n - 1)})</p>
          </div>
        )}

        {/* Results table removed per configuration */}
      </div>

      <div className="text-sm text-gray-400 mt-6 fade-in-delay3">© By KaiMaiRuh</div>
    </div>
  );
}
