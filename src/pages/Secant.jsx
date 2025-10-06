import { useState, useRef, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import useProblems from "../hooks/useProblems";
import * as SecantService from "../services/SecantService";
import SavedProblems from "../components/SavedProblems";
import ResultsTableSimple from "../components/ResultsTableSimple";

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

  // ฟังก์ชันแปลง string เป็น function (รับสมการจาก input)
  function makeFunc(expr) {
    if (!expr || !expr.trim()) return null;
    let s = expr.replace(/\^/g, "**");
    s = s.replace(/\bln\s*\(/gi, "log(");
    s = s.replace(/\bpi\b/gi, "PI");
    s = s.replace(/\be\b/gi, "E");
    try {
      return new Function("x", "with(Math){ return (" + s + "); }");
    } catch {
      return null;
    }
  }

  // ฟังก์ชันหลักสำหรับคำนวณ Secant Method
  function secant(func, x0, x1, tol, maxIter) {
    let iterations = [];
    let f0 = func(x0), f1 = func(x1);

    // เก็บค่าเริ่มต้น (iter=0, iter=1)
    iterations.push({ iter: 0, x: x0, fx: f0, error: null });
    iterations.push({ iter: 1, x: x1, fx: f1, error: null });

    // วนลูปคำนวณแต่ละ iteration
    for (let i = 2; i <= maxIter; i++) {
      if (f1 - f0 === 0) return { error: "หารด้วยศูนย์ (f1 - f0 = 0)" };

      let x2 = x1 - f1 * (x1 - x0) / (f1 - f0);
      let f2 = func(x2);
      let err = Math.abs(x2 - x1) / Math.abs(x2);

      iterations.push({ iter: i, x: x2, fx: f2, error: err });

      // เช็คเงื่อนไขหยุด
      if (Math.abs(f2) < tol || err < tol) {
        return { root: x2, iterations, converged: true };
      }

      // ปรับค่า x0, x1 สำหรับ iteration ถัดไป
      x0 = x1; f0 = f1;
      x1 = x2; f1 = f2;
    }
    // ถ้าไม่ converge
    return { root: x1, iterations, converged: false };
  }

  // ฟังก์ชันจัดรูปแบบตัวเลข
  function formatNum(x) {
    if (x === null) return "-";
    if (!isFinite(x)) return String(x);
    return Number(x).toPrecision(6).replace(/(?:\.0+$)|(?:(?<=\.[0-9]*[1-9])0+$)/, "");
  }

  // ฟังก์ชันวาดกราฟผลลัพธ์และจุด iteration
  function drawPlot(func, iterations) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#061022";
    ctx.fillRect(0, 0, W, H);

    if (iterations.length === 0) return;

    // กำหนดขอบเขตกราฟจากค่าที่ได้
    const xs = iterations.map(it => it.x);
    const ys = iterations.map(it => it.fx);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const padX = (maxX - minX) * 0.3 || 1;
    const padY = (maxY - minY) * 0.3 || 1;
    const xmin = minX - padX, xmax = maxX + padX;
    const ymin = minY - padY, ymax = maxY + padY;

    // ฟังก์ชันแปลงค่าพิกัด
    const mapX = (x) => ((x - xmin) / (xmax - xmin)) * W;
    const mapY = (y) => H - ((y - ymin) / (ymax - ymin)) * H;

    // วาดแกน x, y
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    if (ymin < 0 && ymax > 0) {
      const y0 = mapY(0);
      ctx.beginPath(); ctx.moveTo(0, y0); ctx.lineTo(W, y0); ctx.stroke();
    }
    if (xmin < 0 && xmax > 0) {
      const x0 = mapX(0);
      ctx.beginPath(); ctx.moveTo(x0, 0); ctx.lineTo(x0, H); ctx.stroke();
    }

    // วาดกราฟฟังก์ชัน
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#8ab4ff";
    const N = 500;
    let started = false;
    for (let i = 0; i < N; i++) {
      const x = xmin + (xmax - xmin) * i / (N - 1);
      let y;
      try { y = func(x); } catch { y = NaN; }
      if (!isFinite(y)) { started = false; continue; }
      const px = mapX(x), py = mapY(y);
      if (!started) { ctx.moveTo(px, py); started = true; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // วาดจุด iteration และเส้น secant
    iterations.forEach((it, idx) => {
      const px = mapX(it.x), py = mapY(it.fx);

      // วาดเส้น secant ระหว่างจุดก่อนหน้า
      if (idx > 0) {
        const prev = iterations[idx - 1];
        ctx.beginPath();
        ctx.moveTo(mapX(prev.x), mapY(prev.fx));
        ctx.lineTo(px, py);
        ctx.strokeStyle = "#22c55e";
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // วาดจุด iteration
      ctx.beginPath();
      ctx.arc(px, py, idx === iterations.length - 1 ? 6 : 3, 0, 2 * Math.PI);
      ctx.fillStyle = idx === iterations.length - 1 ? "#fb923c" : "#f97316";
      ctx.fill();

      // Label ใต้แกน x
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "12px sans-serif";
      ctx.fillText("x" + idx, px - 10, mapY(0) + 14);
    });
  }

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

    // เรียกฟังก์ชันคำนวณ
    const res = secant(func, x0val, x1val, tolVal, maxVal);
    if (res.error) { setStatus("สถานะ: " + res.error); return; }

    // อัปเดตผลลัพธ์
    setIterations(res.iterations);
    setStatus("สถานะ: เสร็จสิ้น " + (res.converged ? "(converged)" : "(ไม่ converged)"));
    setIters(res.iterations.length);
    setRoot(formatNum(res.root));
    drawPlot(func, res.iterations);
  };

  // --- รีเซ็ต input และกราฟ ---
  const handleReset = () => {
    setExpr(""); setX0(""); setX1(""); setTol(""); setMaxIter("");
    setIterations([]); setStatus("สถานะ: รีเซ็ตแล้ว");
    setIters("-"); setRoot("-");
    drawPlot(() => 0, []);
  };

  // --- วาดกราฟเริ่มต้นเมื่อโหลดหน้า ---
  useEffect(() => { drawPlot(() => 0, []); }, []);
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
