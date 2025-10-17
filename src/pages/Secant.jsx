// src/pages/Secant.jsx
import { useState, useEffect } from "react";
import * as SecantService from "../services/SecantService";
import useProblems from "../hooks/useProblems";
import PageHeader from "../components/PageHeader";
import SavedProblems from "../components/SavedProblems";
import { makeFunc, formatNum } from "../utils/math";
import { secant as runSecant } from "../algorithms/secant";
import GraphRoot from "../components/graphs/GraphRoot";
import TableRoot from "../components/tables/TableRoot";

export default function Secant() {
  const [expr, setExpr] = useState("");
  const [x0, setX0] = useState("");
  const [x1, setX1] = useState("");
  const [tol, setTol] = useState("");
  const [maxIter, setMaxIter] = useState("");
  const [iterations, setIterations] = useState([]);
  const [status, setStatus] = useState("สถานะ: ยังไม่ได้คำนวณ");
  const [root, setRoot] = useState("-");
  const [iters, setIters] = useState("-");
  const { problems, removingIds, refresh, saveProblem, deleteProblem } = useProblems(SecantService);

  useEffect(() => {
    refresh().catch(console.error);
  }, [refresh]);

  const handleRun = () => {
    const func = makeFunc(expr);
    if (!func) {
      setStatus("สถานะ: สมการไม่ถูกต้อง");
      return;
    }

    const x0val = parseFloat(x0);
    const x1val = parseFloat(x1);
    const tolVal = parseFloat(tol);
    const maxVal = parseInt(maxIter, 10);

    if (isNaN(x0val) || isNaN(x1val)) {
      setStatus("สถานะ: x0/x1 ไม่ถูกต้อง");
      return;
    }
    if (!isFinite(tolVal) || tolVal <= 0) {
      setStatus("สถานะ: Error (tol) ต้องเป็นจำนวนบวก เช่น 1e-6");
      return;
    }
    if (!Number.isInteger(maxVal) || maxVal <= 0) {
      setStatus("สถานะ: Max Iteration ต้องเป็นจำนวนเต็มบวก เช่น 50");
      return;
    }

    const res = runSecant(func, x0val, x1val, tolVal, maxVal);
    if (res.error) {
      setStatus("สถานะ: " + res.error);
      return;
    }

    setIterations(res.iterations);
    setStatus("สถานะ: เสร็จสิ้น " + (res.converged ? "(Converged)" : "(ไม่ Converged)"));
    setIters(res.iterations.length);
    setRoot(formatNum(res.root));
  };

  const handleReset = () => {
    setExpr("");
    setX0("");
    setX1("");
    setTol("");
    setMaxIter("");
    setIterations([]);
    setStatus("สถานะ: รีเซ็ตแล้ว");
    setIters("-");
    setRoot("-");
  };

  const handleSaveProblem = async () => {
    if (!expr || !x0 || !x1 || !tol || !maxIter) {
      alert("กรอกให้ครบก่อนบันทึกนะ");
      return;
    }
    try {
      await saveProblem({ expr, x0, x1, tol, maxIter, method: "secant" });
      alert("บันทึกแล้ว!");
    } catch (e) {
      console.error("บันทึกโจทย์ผิดพลาด:", e);
      alert("บันทึกไม่สำเร็จ ลองเช็ค console หรือการตั้งค่าการจัดเก็บข้อมูล");
    }
  };

  const handleLoadProblem = (p) => {
    setExpr(p.expr ?? "");
    setX0(p.x0 ?? "");
    setX1(p.x1 ?? "");
    setTol(p.tol ?? "");
    setMaxIter(p.maxIter ?? "");
  };

  const handleDeleteProblem = (p) => {
    if (!confirm(`ลบโจทย์นี้ไหม?\n${p.expr}`)) return;
    deleteProblem(p.id);
  };

  const safeFunc = makeFunc(expr) || ((x) => x);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <PageHeader title="Secant Method" subtitle="ตาราง + กราฟ แสดงการทำงาน (เวอร์ชันใหม่)" />

      <div className="grid md:grid-cols-2 gap-6">
        {/* ===== Input Section ===== */}
        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay1">
          <label className="block text-sm text-gray-400 mb-1">สมการ f(x)</label>
          <input
            type="text"
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            placeholder="เช่น x^3 - x - 2"
            className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 mb-3"
          />

          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">ค่า x₀</label>
              <input
                type="number"
                value={x0}
                onChange={(e) => setX0(e.target.value)}
                placeholder="เช่น 1"
                className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">ค่า x₁</label>
              <input
                type="number"
                value={x1}
                onChange={(e) => setX1(e.target.value)}
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
                className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Max Iteration</label>
              <input
                type="number"
                value={maxIter}
                onChange={(e) => setMaxIter(e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700"
              />
            </div>
          </div>

          <div className="flex gap-3 mb-4">
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

          <div className="text-sm mb-2 text-gray-300">
            <div>{status}</div>
            <div>Iterations: {iters}</div>
            <div>Root: {root}</div>
          </div>

          <SavedProblems problems={problems} onLoad={handleLoadProblem} onDelete={handleDeleteProblem} removingIds={removingIds} />
        </div>

        {/* ===== Graph Section ===== */}
        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay2">
          <label className="block text-sm text-gray-400 mb-2">กราฟฟังก์ชัน</label>
          <div className="w-full h-72 bg-slate-900 rounded">
            <GraphRoot
              func={safeFunc}
              xl={parseFloat(x0) - 2 || -5}
              xr={parseFloat(x1) + 2 || 5}
              iterations={iterations}
              method="Secant"
              className="w-full h-72"
            />
          </div>
          <div className="text-xs text-gray-400 mt-2">
            จุดสีเขียว = x₀, จุดสีแดง = x₁, จุดส้ม = x<sub>i+1</sub> แต่ละรอบ, วงกลมใหญ่ = ค่าสุดท้าย
          </div>
        </div>
      </div>

      {/* ===== Table Section ===== */}
      <div className="mt-6">
        <TableRoot iterations={iterations} />
      </div>

      <div className="text-sm text-gray-400 mt-6 fade-in-delay3">© By KaiMaiRuh</div>
    </div>
  );
}
