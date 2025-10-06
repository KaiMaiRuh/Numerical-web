import { useState, useEffect } from "react";
import { getFalsePositionProblems, saveFalsePositionProblem, deleteFalsePositionProblem } from "../services/FalsePositionService";
import { falsePosition as runFalsePosition } from "../algorithms/falsePosition";
import GraphCanvas from "../components/GraphCanvas";
import ResultsTable from "../components/ResultsTable";
import SavedProblems from "../components/SavedProblems";
import { makeFunc, formatNum } from "../utils/math";

export default function FalsePosition() {
  const [expr, setExpr] = useState("");
  const [xl, setXl] = useState("");
  const [xr, setXr] = useState("");
  const [tol, setTol] = useState("");
  const [maxIter, setMaxIter] = useState("");
  const [iterations, setIterations] = useState([]);
  const [status, setStatus] = useState("สถานะ: ยังไม่ได้คำนวณ");
  const [root, setRoot] = useState("-");
  const [iters, setIters] = useState("-");
  const [problems, setProblems] = useState([]);
  const [removingIds, setRemovingIds] = useState(new Set());

  // ---------- helpers ----------
  // makeFunc imported from utils

  // ✅ False Position (Regula Falsi)
  function falsePosition(func, a, b, tol, maxIter) {
    let fa = func(a), fb = func(b);
    if (!isFinite(fa) || !isFinite(fb))
      return { error: "f(x) ไม่สามารถประเมินค่าได้" };
    if (fa * fb > 0)
      return { error: "f(a) และ f(b) ต้องต่างเครื่องหมาย" };

    const rows = [];
    let prev = null;

    for (let i = 0; i <= maxIter; i++) {
      const x1 = (a * fb - b * fa) / (fb - fa);
      const fx1 = func(x1);

      let err = null;
      if (prev !== null) {
        const denom = Math.abs(x1) > 1e-12 ? Math.abs(x1) : 1;
        err = Math.abs(x1 - prev) / denom; // relative approx error
      }

      rows.push({ iter: i, xl: a, xr: b, x1, fx1, error: err });

      if (!isFinite(fx1)) return { error: "f(x1) คำนวณไม่ได้" };
      if (Math.abs(fx1) === 0 || (err !== null && err <= tol)) {
        return { root: x1, iterations: rows, converged: true };
      }

      if (fa * fx1 < 0) {
        b = x1; fb = fx1;
      } else {
        a = x1; fa = fx1;
      }
      prev = x1;
    }
    return { root: (a * fb - b * fa) / (fb - fa), iterations: rows, converged: false };
  }

  // formatNum imported from utils

  // graph rendering delegated to GraphCanvas

  // ---------- Firestore ----------
  async function refreshProblems() {
    const data = await getFalsePositionProblems();
    setProblems(data);
  }

  useEffect(() => {
    refreshProblems().catch(console.error);
  }, []);

  const handleSaveProblem = async () => {
    if (!expr || !xl || !xr || !tol || !maxIter) {
      alert("กรอกให้ครบก่อนบันทึกนะ");
      return;
    }
    try {
      await saveFalsePositionProblem({ expr, xl, xr, tol, maxIter });
      await refreshProblems();
      alert("บันทึกแล้ว!");
    } catch (e) {
      console.error("บันทึกโจทย์ผิดพลาด:", e);
      alert("บันทึกไม่สำเร็จ ลองเช็ค Firestore rules/console");
    }
  };

  const handleLoadProblem = (p) => {
    setExpr(p.expr ?? "");
    setXl(p.xl ?? "");
    setXr(p.xr ?? "");
    setTol(p.tol ?? "");
    setMaxIter(p.maxIter ?? "");
  };

  const handleDeleteProblem = async (p) => {
    if (!confirm(`ลบโจทย์นี้ไหม?\n${p.expr}`)) return;
    try {
      setRemovingIds((s) => new Set(s).add(p.id)); // add fade-out class
      setTimeout(async () => {
        await deleteFalsePositionProblem(p.id);
        await refreshProblems();
        setRemovingIds((s) => {
          const n = new Set(s); n.delete(p.id); return n;
        });
      }, 480);
    } catch (e) {
      console.error("ลบโจทย์ผิดพลาด:", e);
      alert("ลบไม่สำเร็จ");
      setRemovingIds((s) => {
        const n = new Set(s); n.delete(p.id); return n;
      });
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

  const res = runFalsePosition(func, a, b, tolVal, maxVal);
    if (res.error) { setStatus("สถานะ: " + res.error); return; }

    setIterations(res.iterations);
    setStatus("สถานะ: เสร็จสิ้น " + (res.converged ? "(converged)" : "(ไม่ converged)"));
    setIters(Math.max(0, res.iterations.length - 1));
    setRoot(formatNum(res.root));
  };

  const handleReset = () => {
    setExpr(""); setXl(""); setXr(""); setTol(""); setMaxIter("");
    setIterations([]); setStatus("สถานะ: รีเซ็ตแล้ว"); setIters("-"); setRoot("-");
    drawPlot(makeFunc("x"), -5, 5, []);
  };

  // ---------- UI ----------
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 mb-4 fade-in">
        <h1 className="text-xl font-bold text-cyan-400">False Position Method</h1>
        <div className="text-sm text-gray-400">ตาราง + กราฟ แสดงการทำงาน</div>
      </header>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Card */}
        <div className="bg-[#161b22] rounded-lg p-4 border border-[#30363d] fade-in-delay1">
          <label className="block text-sm text-gray-400 mb-1">สมการ f(x)</label>
          <input
            type="text"
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            placeholder="เช่น x^3 - x - 2 หรือ sin(x)"
            className="w-full px-3 py-2 rounded bg-[#0d1117] border border-[#30363d] mb-3 text-gray-200"
          />

          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">ค่า XL</label>
              <input
                type="number"
                value={xl}
                onChange={(e) => setXl(e.target.value)}
                placeholder="เช่น 1"
                className="w-full px-3 py-2 rounded bg-[#0d1117] border border-[#30363d] text-gray-200"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">ค่า XR</label>
              <input
                type="number"
                value={xr}
                onChange={(e) => setXr(e.target.value)}
                placeholder="เช่น 2"
                className="w-full px-3 py-2 rounded bg-[#0d1117] border border-[#30363d] text-gray-200"
              />
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Error (เช่น 1e-6)</label>
              <input
                type="text"
                value={tol}
                onChange={(e) => setTol(e.target.value)}
                placeholder="เช่น 1e-6"
                className="w-full px-3 py-2 rounded bg-[#0d1117] border border-[#30363d] text-gray-200"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Max Iteration</label>
              <input
                type="number"
                value={maxIter}
                onChange={(e) => setMaxIter(e.target.value)}
                placeholder="เช่น 50"
                className="w-full px-3 py-2 rounded bg-[#0d1117] border border-[#30363d] text-gray-200"
              />
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <button onClick={handleRun} className="btn-primary glow-btn flex-1 py-2 rounded font-semibold">
              คำนวณ
            </button>
            <button onClick={handleReset} className="btn-danger flex-1 border border-[#30363d] py-2 rounded">
              รีเซ็ต
            </button>
          </div>

          {/* Save / Load / Delete */}
          <button onClick={handleSaveProblem} className="w-full btn-primary glow-btn py-2 rounded mb-3">
            💾 บันทึกโจทย์นี้
          </button>

          <div className="text-sm mb-2">
            <div>{status}</div>
            <div>Iterations: {iters}</div>
            <div>Root: {root}</div>
          </div>

          {problems.length > 0 && (
            <div className="mt-2">
              <h2 className="text-sm text-gray-400 mb-2">📘 โจทย์ที่บันทึกไว้:</h2>
              <ul className="text-xs text-gray-300 bg-[#0d1117] rounded p-2 max-h-48 overflow-auto border border-[#30363d]">
                {problems.map((p) => (
                  <li
                    key={p.id}
                    className={`flex items-center justify-between gap-2 border-b border-[#30363d] py-1 ${removingIds.has(p.id) ? "fade-out" : ""}`}
                  >
                    <span className="truncate">{p.expr}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLoadProblem(p)}
                        className="text-slate-900 btn-primary px-2 py-0.5 rounded"
                      >
                        โหลด
                      </button>
                      <button
                        onClick={() => handleDeleteProblem(p)}
                        className="text-slate-900 btn-danger px-2 py-0.5 rounded glow-btn"
                      >
                        ลบ
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Graph Card */}
        <div className="bg-[#161b22] rounded-lg p-4 border border-[#30363d] fade-in-delay2">
          <label className="block text-sm text-gray-400 mb-2">กราฟฟังก์ชัน</label>
          <div className="w-full h-72 bg-[#0d1117] rounded">
            <GraphCanvas func={makeFunc(expr) || ((x)=>x)} xl={parseFloat(xl) || -5} xr={parseFloat(xr) || 5} iterations={iterations} className="w-full h-72 rounded" />
          </div>
          <div className="text-xs text-gray-400 mt-2">
            เขียว = XL, แดง = XR, ส้ม = X1 ทุก iteration (วงใหญ่ = X1 สุดท้าย)
          </div>
        </div>
      </div>

      {/* ตารางผลลัพธ์ (แยกออกมาเหมือน Bisection) */}
      <ResultsTable iterations={iterations} />
      <div className="text-sm text-gray-400 mt-6 fade-in-delay3">© Numerical Web — ฝีมือคุณ</div>
    </div>
  );
}
