import { useState, useEffect } from "react";
import * as BisectionService from "../services/BisectionService";
import useProblems from "../hooks/useProblems";
import { bisection as runBisection } from "../algorithms/bisection";
import GraphCanvas from "../components/GraphCanvas";
import SavedProblems from "../components/SavedProblems";
import ResultsTable from "../components/ResultsTable";
import PageHeader from "../components/PageHeader";
import { makeFunc, formatNum } from "../utils/math";

export default function Bisection() {
  const [expr, setExpr] = useState("");
  const [xl, setXl] = useState("");
  const [xr, setXr] = useState("");
  const [tol, setTol] = useState("");
  const [maxIter, setMaxIter] = useState("");
  const [iterations, setIterations] = useState([]);
  const [status, setStatus] = useState("สถานะ: ยังไม่ได้คำนวณ");
  const [root, setRoot] = useState("-");
  const [iters, setIters] = useState("-");
  const { problems, removingIds, refresh, saveProblem, deleteProblem } = useProblems(BisectionService);
  // canvas rendering moved to GraphCanvas component

  // ---------- helpers ----------
  // makeFunc imported from ../utils/math

  // Bisection algorithm delegated to src/algorithms/bisection (imported as runBisection)

  // formatNum imported from ../utils/math

  // Graph rendering moved into GraphCanvas

  // problems/removingIds/save/delete handled by useProblems hook
  useEffect(() => {
    refresh().catch(console.error);
  }, [refresh]);


  const handleLoadProblem = (p) => {
    setExpr(p.expr ?? "");
    setXl(p.xl ?? "");
    setXr(p.xr ?? "");
    setTol(p.tol ?? "");
    setMaxIter(p.maxIter ?? "");
  };

  const handleDeleteProblem = (p) => {
    if (!confirm(`ลบโจทย์นี้ไหม?\n${p.expr}`)) return;
    try {
      deleteProblem(p.id);
    } catch (e) {
      console.error("ลบโจทย์ผิดพลาด:", e);
      alert("ลบไม่สำเร็จ");
    }
  };

  const handleSaveProblem = async () => {
    if (!expr || !xl || !xr || !tol || !maxIter) {
      alert("กรอกให้ครบก่อนบันทึกนะ");
      return;
    }
    try {
      await saveProblem({ expr, xl, xr, tol, maxIter });
      alert("บันทึกแล้ว!");
    } catch (e) {
      console.error("บันทึกโจทย์ผิดพลาด:", e);
      alert("บันทึกไม่สำเร็จ ลองเช็ค Firestore rules/console");
    }
  };

  // ---------- Run/Reset ----------
  const handleRun = () => {
    const func = makeFunc(expr);
    if (!func) { setStatus("สถานะ: สมการไม่ถูกต้อง"); return; }

    const a = parseFloat(xl), b = parseFloat(xr);
    const tolVal = parseFloat(tol);
    const maxVal = parseInt(maxIter, 10);

    if (isNaN(a) || isNaN(b)) { setStatus("สถานะ: XL/XR ไม่ถูกต้อง"); return; }
    if (a >= b) { setStatus("สถานะ: ต้องมี XL < XR"); return; }
    if (!isFinite(tolVal) || tolVal <= 0) { setStatus("สถานะ: Error (tol) ต้องเป็นจำนวนบวก เช่น 1e-6"); return; }
    if (!Number.isInteger(maxVal) || maxVal <= 0) { setStatus("สถานะ: Max Iteration ต้องเป็นจำนวนเต็มบวก เช่น 50"); return; }

  const res = runBisection(func, a, b, tolVal, maxVal);
    if (res.error) { setStatus("สถานะ: " + res.error); return; }

    setIterations(res.iterations);
    setStatus("สถานะ: เสร็จสิ้น " + (res.converged ? "(converged)" : "(ไม่ converged)"));
    setIters(Math.max(0, res.iterations.length - 1));
    setRoot(formatNum(res.root));
  };

  const handleReset = () => {
    setExpr(""); setXl(""); setXr(""); setTol(""); setMaxIter("");
    setIterations([]); setStatus("สถานะ: รีเซ็ตแล้ว"); setIters("-"); setRoot("-");
    // GraphCanvas will render default when iterations empty
  };

  // ---------- UI ----------
  return (
    <div className="max-w-6xl mx-auto p-6">
      <PageHeader title="Bisection Method" subtitle="ตาราง + กราฟ แสดงการทำงาน" />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input */}
  <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay1">
          <label className="block text-sm text-gray-400 mb-1">สมการ f(x)</label>
          <input
            type="text"
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            placeholder="เช่น x^3 - x - 2 หรือ sin(x)"
            className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 mb-3"
          />

          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">ค่า XL</label>
              <input
                type="number"
                value={xl}
                onChange={(e) => setXl(e.target.value)}
                placeholder="เช่น 1"
                className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">ค่า XR</label>
              <input
                type="number"
                value={xr}
                onChange={(e) => setXr(e.target.value)}
                placeholder="เช่น 2"
                className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700"
              />
            </div>
          </div>

          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Error (เช่น 1e-6)</label>
              <input
                type="text"
                value={tol}
                onChange={(e) => setTol(e.target.value)}
                placeholder="เช่น 1e-6"
                className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Max Iteration</label>
              <input
                type="number"
                value={maxIter}
                onChange={(e) => setMaxIter(e.target.value)}
                placeholder="เช่น 50"
                className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700"
              />
            </div>
          </div>

          <div className="flex gap-3 mb-4">
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

          {/* บันทึก/โหลด/ลบโจทย์ */}
          <button
            onClick={handleSaveProblem}
            className="w-full btn-primary glow-btn py-2 rounded mb-3"
          >
            บันทึกโจทย์
          </button>

          <div className="text-sm mb-2">
            <div>{status}</div>
            <div>Iterations: {iters}</div>
            <div>Root: {root}</div>
          </div>

          <SavedProblems problems={problems} onLoad={handleLoadProblem} onDelete={handleDeleteProblem} removingIds={removingIds} />
        </div>

        {/* Graph */}
        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay2">
          <label className="block text-sm text-gray-400 mb-2">กราฟฟังก์ชัน</label>
          <div className="w-full h-72 bg-slate-900 rounded">
            <GraphCanvas func={makeFunc(expr) || ((x)=>x)} xl={parseFloat(xl) || -5} xr={parseFloat(xr) || 5} iterations={iterations} className="w-full h-72 rounded" />
          </div>
          <div className="text-xs text-gray-400 mt-2">
            เขียว = XL, แดง = XR, ส้ม = x1 ทุก iteration (วงใหญ่ = x1 สุดท้าย)
          </div>
        </div>
      </div>

      {/* ตารางผลลัพธ์ */}
      <ResultsTable iterations={iterations} />
      <div className="text-sm text-gray-400 mt-6 fade-in-delay3">© By KaiMaiRuh</div>
    </div>
  );
}
