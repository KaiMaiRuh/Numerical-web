import { useState, useRef, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { secant as runSecant } from "../algorithms/secant";
import useProblems from "../hooks/useProblems";
import * as SecantService from "../services/SecantService";
import SavedProblems from "../components/SavedProblems";
import ResultsTableSimple from "../components/ResultsTableSimple";
import { makeFunc, formatNum } from "../utils/math";
import drawPlot from "../utils/drawPlot";

// ฟังก์ชันหลักสำหรับ Secant Method
export default function Secant() {
  // State สำหรับเก็บค่าต่าง ๆ
  const [expr, setExpr] = useState("");
  const [x0, setX0] = useState("");
  const [x1, setX1] = useState("");
  const [tol, setTol] = useState("");
  const [maxIter, setMaxIter] = useState("");
  const [iterations, setIterations] = useState([]);
  const [status, setStatus] = useState("สถานะ: ยังไม่ได้คำนวณ");
  const [root, setRoot] = useState("-");
  const [iters, setIters] = useState("-");
  const canvasRef = useRef(null);
  const { problems, removingIds, refresh, saveProblem, deleteProblem } = useProblems(SecantService);

  const handleSaveProblem = async () => {
    if (!expr || !x0 || !x1 || !tol || !maxIter) {
      alert("กรอกให้ครบก่อนบันทึกนะ");
      return;
    }
    try {
      await saveProblem({ expr, x0, x1, tol, maxIter });
      alert("บันทึกแล้ว!");
    } catch (e) {
      console.error("บันทึกโจทย์ผิดพลาด:", e);
      alert("บันทึกไม่สำเร็จ ลองเช็ค Firestore rules/console");
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
    try {
      deleteProblem(p.id);
    } catch (e) {
      console.error("ลบโจทย์ผิดพลาด:", e);
      alert("ลบไม่สำเร็จ");
    }
  };

  // makeFunc and formatNum delegated to ../utils/math

  // Secant algorithm: delegated to ../algorithms/secant (imported as runSecant)

  // formatNum delegated to ../utils/math

  // drawPlot delegated to ../utils/drawPlot

  // --- ส่วนจัดการ input และผลลัพธ์ ---
  const handleRun = () => {
    // สร้างฟังก์ชันจากสมการ
    const func = makeFunc(expr);
    if (!func) { setStatus("สถานะ: สมการไม่ถูกต้อง"); return; }
    const x0val = parseFloat(x0);
    const x1val = parseFloat(x1);
    const tolVal = parseFloat(tol);
    const maxVal = parseInt(maxIter, 10);

    // ตรวจสอบความถูกต้องของ input
    if (isNaN(x0val) || isNaN(x1val)) { setStatus("สถานะ: x0/x1 ไม่ถูกต้อง"); return; }
    if (!isFinite(tolVal) || tolVal <= 0) { setStatus("สถานะ: tol ต้องเป็นจำนวนบวก"); return; }
    if (!Number.isInteger(maxVal) || maxVal <= 0) { setStatus("สถานะ: Max Iteration ต้องเป็นจำนวนเต็มบวก"); return; }

  // เรียกฟังก์ชันคำนวณ (ใช้ canonical algorithm)
  const res = runSecant(func, x0val, x1val, tolVal, maxVal);
    if (res.error) { setStatus("สถานะ: " + res.error); return; }

    // อัปเดตผลลัพธ์
    setIterations(res.iterations);
    setStatus("สถานะ: เสร็จสิ้น " + (res.converged ? "(converged)" : "(ไม่ converged)"));
    setIters(res.iterations.length);
    setRoot(formatNum(res.root));
  drawPlot(canvasRef.current, func, x0val - 5, x1val + 5, res.iterations);
  };

  // --- รีเซ็ต input และกราฟ ---
  const handleReset = () => {
    setExpr(""); setX0(""); setX1(""); setTol(""); setMaxIter("");
    setIterations([]); setStatus("สถานะ: รีเซ็ตแล้ว");
    setIters("-"); setRoot("-");
  drawPlot(canvasRef.current, () => 0, -5, 5, []);
  };

  // --- วาดกราฟเริ่มต้นเมื่อโหลดหน้า ---
  useEffect(() => { drawPlot(canvasRef.current, () => 0, -5, 5, []); }, []);
  useEffect(() => { refresh().catch(console.error); }, [refresh]);

  // --- ส่วนแสดงผลหน้าจอ ---
  return (
    <div className="max-w-6xl mx-auto p-6">
      <PageHeader title="Secant Method" subtitle="ตาราง + กราฟ แสดงการทำงาน" />

      <div className="grid md:grid-cols-2 gap-6">
  {/* Input Card: รับค่าต่าง ๆ จากผู้ใช้ */}
  <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay1">
          <label className="block text-sm text-gray-400 mb-1">สมการ f(x)</label>
          <input type="text" value={expr} onChange={(e) => setExpr(e.target.value)}
            placeholder="เช่น x^3 - x - 2"
            className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 mb-3" />

          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">ค่า x0</label>
              <input type="number" value={x0} onChange={(e) => setX0(e.target.value)}
                placeholder="เช่น 1"
                className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700" />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">ค่า x1</label>
              <input type="number" value={x1} onChange={(e) => setX1(e.target.value)}
                placeholder="เช่น 2"
                className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700" />
            </div>
          </div>

          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Error</label>
              <input type="text" value={tol} onChange={(e) => setTol(e.target.value)}
                placeholder="เช่น 1e-6"
                className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700" />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Max Iteration</label>
              <input type="number" value={maxIter} onChange={(e) => setMaxIter(e.target.value)}
                placeholder="เช่น 50"
                className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700" />
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <button onClick={handleRun}
              className="flex-1 btn-primary glow-btn py-2 rounded font-semibold">คำนวณ</button>
            <button onClick={handleReset}
              className="flex-1 btn-danger border border-slate-600 py-2 rounded">รีเซ็ต</button>
          </div>

          <button
            onClick={handleSaveProblem}
            className="w-full btn-primary glow-btn py-2 rounded mb-3"
          >
            บันทึกโจทย์
          </button>

          {/* แสดงผลสถานะและผลลัพธ์ */}
          <div className="text-sm">
            <div>{status}</div>
            <div>Iterations: {iters}</div>
            <div>Root: {root}</div>
          </div>

          {/* Table: แสดงผลการคำนวณแต่ละ iteration */}
          <SavedProblems problems={problems} onLoad={handleLoadProblem} onDelete={handleDeleteProblem} removingIds={removingIds} />
        </div>

  {/* Graph Card: แสดงกราฟฟังก์ชันและจุด iteration */}
  <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay2">
          <label className="block text-sm text-gray-400 mb-2">กราฟฟังก์ชัน + Secant</label>
          <canvas ref={canvasRef} width={800} height={320}
            className="w-full h-72 bg-slate-900 rounded"></canvas>
          <div className="text-xs text-gray-400 mt-2">
            เส้นเขียว = เส้น secant ระหว่างแต่ละจุด, จุดส้ม = ค่าที่ได้, จุดส้มใหญ่ = ค่าสุดท้าย  
            Label = x0, x1, x2 …
          </div>
        </div>
      </div>
      {/* Big results table below both cards */}
      <div className="mt-6">
        <ResultsTableSimple iterations={iterations} />
      </div>
    </div>
  );
}
