import { useState, useRef, useEffect } from "react";
import {
  getBisectionProblems,
  saveBisectionProblem,
  deleteBisectionProblem,
} from "../services/BisectionService";

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
  const [problems, setProblems] = useState([]);
  const [removingIds, setRemovingIds] = useState(new Set());
  const canvasRef = useRef(null);

  // ---------- helpers ----------
  function makeFunc(e) {
    if (!e || !e.trim()) return null;
    let s = e.replace(/\^/g, "**");
    s = s.replace(/\bln\s*\(/gi, "log(");
    s = s.replace(/\bpi\b/gi, "PI");
    s = s.replace(/\be\b/gi, "E");
    try {
      return new Function("x", "with(Math){ return (" + s + "); }");
    } catch {
      return null;
    }
  }

  // ✅ Bisection ที่คำนวณถูกต้อง (x1 ต่อรอบ แล้วค่อยอัปเดตช่วง)
  function bisection(func, a, b, tol, maxIter) {
    let fa = func(a), fb = func(b);
    if (!isFinite(fa) || !isFinite(fb))
      return { error: "f(x) ไม่สามารถประเมินค่าได้" };
    if (fa * fb > 0)
      return { error: "f(a) และ f(b) ต้องต่างเครื่องหมาย" };

    const rows = [];
    let prev = null;

    for (let i = 0; i <= maxIter; i++) {
      const x1 = (a + b) / 2;
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
    return { root: (a + b) / 2, iterations: rows, converged: false };
  }

  function formatNum(x) {
    if (x === null || Number.isNaN(x)) return "-";
    if (!isFinite(x)) return String(x);
    return Number(x).toPrecision(8)
      .replace(/(?:\.0+$)|(?:(?<=\.[0-9]*[1-9])0+$)/, "");
  }

  function drawPlot(func, xl, xr, iterations) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#061022";
    ctx.fillRect(0, 0, W, H);

    const pad = (xr - xl) * 0.2 || 1;
    const xmin = xl - pad, xmax = xr + pad;
    const N = 500;
    let xs = [], ys = [], ymin = Infinity, ymax = -Infinity;
    for (let i = 0; i < N; i++) {
      const x = xmin + ((xmax - xmin) * i) / (N - 1);
      let y; try { y = func(x); } catch { y = NaN; }
      xs.push(x); ys.push(y);
      if (isFinite(y)) { if (y < ymin) ymin = y; if (y > ymax) ymax = y; }
    }
    if (ymin === Infinity) { ymin = -1; ymax = 1; }
    const ypad = (ymax - ymin) * 0.2 || 1; ymin -= ypad; ymax += ypad;

    const mapX = (x) => ((x - xmin) / (xmax - xmin)) * W;
    const mapY = (y) => H - ((y - ymin) / (ymax - ymin)) * H;

    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    if (ymin < 0 && ymax > 0) {
      const y0 = mapY(0); ctx.beginPath(); ctx.moveTo(0, y0); ctx.lineTo(W, y0); ctx.stroke();
    }
    if (xmin < 0 && xmax > 0) {
      const x0 = mapX(0); ctx.beginPath(); ctx.moveTo(x0, 0); ctx.lineTo(x0, H); ctx.stroke();
    }

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#8ab4ff";
    let started = false;
    for (let i = 0; i < N; i++) {
      const x = xs[i], y = ys[i];
      if (!isFinite(y)) { started = false; continue; }
      const px = mapX(x), py = mapY(y);
      if (!started) { ctx.moveTo(px, py); started = true; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // จุด x1 ของแต่ละ iteration
    iterations.forEach((it) => {
      const px = mapX(it.x1), py = mapY(it.fx1);
      ctx.beginPath(); ctx.arc(px, py, 3, 0, 2 * Math.PI);
      ctx.fillStyle = "#f97316"; ctx.fill();
    });

    // เส้น XL/XR
    const drawMarker = (x, color, label) => {
      const px = mapX(x);
      ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, H);
      ctx.strokeStyle = color; ctx.stroke();
      ctx.fillStyle = color; ctx.font = "12px sans-serif";
      ctx.fillText(label + "=" + formatNum(x), px + 6, 18);
    };
    drawMarker(xl, "#22c55e", "XL");
    drawMarker(xr, "#ef4444", "XR");

    // วง x1 สุดท้าย
    if (iterations.length) {
      const last = iterations[iterations.length - 1];
      const px = mapX(last.x1), py = mapY(last.fx1);
      ctx.beginPath(); ctx.arc(px, py, 6, 0, 2 * Math.PI);
      ctx.fillStyle = "#fb923c"; ctx.fill();
    }
  }

  // ---------- Firestore ----------
  async function refreshProblems() {
    const data = await getBisectionProblems();
    setProblems(data);
  }

  useEffect(() => {
    refreshProblems().catch(console.error);
    drawPlot(makeFunc("x"), -5, 5, []);
  }, []);

  const handleSaveProblem = async () => {
    if (!expr || !xl || !xr || !tol || !maxIter) {
      alert("กรอกให้ครบก่อนบันทึกนะ");
      return;
    }
    try {
      await saveBisectionProblem({ expr, xl, xr, tol, maxIter });
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
      // add animation class
      setRemovingIds((s) => new Set(s).add(p.id));
      // wait for animation then delete
      setTimeout(async () => {
        await deleteBisectionProblem(p.id);
        await refreshProblems();
        setRemovingIds((s) => {
          const n = new Set(s);
          n.delete(p.id);
          return n;
        });
      }, 480);
    } catch (e) {
      console.error("ลบโจทย์ผิดพลาด:", e);
      alert("ลบไม่สำเร็จ");
      setRemovingIds((s) => {
        const n = new Set(s);
        n.delete(p.id);
        return n;
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

    const res = bisection(func, a, b, tolVal, maxVal);
    if (res.error) { setStatus("สถานะ: " + res.error); return; }

    setIterations(res.iterations);
    setStatus("สถานะ: เสร็จสิ้น " + (res.converged ? "(converged)" : "(ไม่ converged)"));
    setIters(Math.max(0, res.iterations.length - 1)); // ไม่นับ iter 0 ที่ยังไม่มี error
    setRoot(formatNum(res.root));
    drawPlot(func, a, b, res.iterations);
  };

  const handleReset = () => {
    setExpr(""); setXl(""); setXr(""); setTol(""); setMaxIter("");
    setIterations([]); setStatus("สถานะ: รีเซ็ตแล้ว"); setIters("-"); setRoot("-");
    drawPlot(makeFunc("x"), -5, 5, []);
  };

  // ---------- UI ----------
  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="flex items-center justify-between gap-4 mb-4 fade-in">
        <h1 className="text-xl font-bold text-cyan-400">Bisection Method</h1>
        <div className="text-sm text-gray-400">ตาราง + กราฟ แสดงการทำงาน</div>
      </header>

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
              <ul className="text-xs text-gray-300 bg-slate-900 rounded p-2 max-h-48 overflow-auto">
                {problems.map((p) => (
                  <li key={p.id} className={`flex items-center justify-between gap-2 border-b border-slate-700 py-1 ${removingIds.has(p.id) ? 'fade-out' : ''}`}>
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

        {/* Graph */}
        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay2">
          <label className="block text-sm text-gray-400 mb-2">กราฟฟังก์ชัน</label>
          <canvas ref={canvasRef} width={800} height={320} className="w-full h-72 bg-slate-900 rounded"></canvas>
          <div className="text-xs text-gray-400 mt-2">
            เขียว = XL, แดง = XR, ส้ม = x1 ทุก iteration (วงใหญ่ = x1 สุดท้าย)
          </div>
        </div>
      </div>

      {/* ตารางผลลัพธ์ */}
      {iterations.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-4 shadow mt-6 overflow-auto fade-in-delay2">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-700 text-gray-200">
                <th className="p-2 text-right">iter</th>
                <th className="p-2 text-right">xl</th>
                <th className="p-2 text-right">xr</th>
                <th className="p-2 text-right">x1</th>
                <th className="p-2 text-right">f(x1)</th>
                <th className="p-2 text-right">error</th>
              </tr>
            </thead>
            <tbody>
              {iterations.map((r) => (
                <tr key={r.iter} className="border-b border-slate-700 text-gray-100">
                  <td className="p-2 text-right">{r.iter}</td>
                  <td className="p-2 text-right">{formatNum(r.xl)}</td>
                  <td className="p-2 text-right">{formatNum(r.xr)}</td>
                  <td className="p-2 text-right">{formatNum(r.x1)}</td>
                  <td className="p-2 text-right">{formatNum(r.fx1)}</td>
                  <td className="p-2 text-right">{r.error === null ? "-" : formatNum(r.error)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="text-sm text-gray-400 mt-6 fade-in-delay3">© 2025 Numer-Web — Developed by KaiMaiRuh</div>
    </div>
  );
}
