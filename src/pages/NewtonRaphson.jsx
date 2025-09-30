import { useState, useRef, useEffect } from "react";

// ฟังก์ชันหลักสำหรับ Newton-Raphson Method
export default function NewtonRaphson() {
  // State สำหรับเก็บค่าต่าง ๆ
  const [expr, setExpr] = useState("");
  const [x0, setX0] = useState("");
  const [tol, setTol] = useState("");
  const [maxIter, setMaxIter] = useState("");
  const [iterations, setIterations] = useState([]);
  const [status, setStatus] = useState("สถานะ: ยังไม่ได้คำนวณ");
  const [root, setRoot] = useState("-");
  const [iters, setIters] = useState("-");
  const canvasRef = useRef(null);

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

  // ฟังก์ชันคำนวณอนุพันธ์ (ใช้สำหรับ Newton-Raphson)
  function derivative(func, x) {
    const h = 1e-6;
    return (func(x + h) - func(x - h)) / (2 * h);
  }

  // ฟังก์ชันหลักสำหรับคำนวณ Newton-Raphson
  function newtonRaphson(func, x0, tol, maxIter) {
    let iterations = [];
    let x = x0;
    let fx = func(x);
    // เก็บค่าเริ่มต้น (iter=0)
    iterations.push({ iter: 0, x, fx, error: null });

    // วนลูปคำนวณแต่ละ iteration
    for (let i = 1; i <= maxIter; i++) {
      let dfx = derivative(func, x);
      if (dfx === 0) return { error: "f'(x) = 0 หารด้วยศูนย์ไม่ได้" };

      let x1 = x - fx / dfx;
      let fx1 = func(x1);
      let err = Math.abs(x1 - x) / Math.abs(x1);

      iterations.push({ iter: i, x: x1, fx: fx1, error: err });

      // เช็คเงื่อนไขหยุด
      if (Math.abs(fx1) < tol || err < tol) {
        return { root: x1, iterations, converged: true };
      }
      x = x1;
      fx = fx1;
    }
    // ถ้าไม่ converge
    return { root: x, iterations, converged: false };
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
    const iterXs = iterations.map(it => it.x);
    const iterYs = iterations.map(it => it.fx);
    const minX = Math.min(...iterXs);
    const maxX = Math.max(...iterXs);
    const padX = (maxX - minX) * 0.3 || 1;
    const xmin = minX - padX, xmax = maxX + padX;
    const minY = Math.min(...iterYs);
    const maxY = Math.max(...iterYs);
    const padY = (maxY - minY) * 0.3 || 1;
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

    // วาดเส้นสัมผัสและ label
    iterations.forEach((it, idx) => {
      const px = mapX(it.x), py = mapY(it.fx);

      // วาดเส้นสัมผัสจากจุดไปยังแกน x (ถัดไป)
      if (idx < iterations.length - 1) {
        const x2 = iterations[idx + 1].x;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(mapX(x2), mapY(0));
        ctx.strokeStyle = "#22c55e";
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // วาดเส้นตั้งจากจุดไปยังแกน x
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px, mapY(0));
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.stroke();

      // Label ใต้แกน x
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "12px sans-serif";
      ctx.fillText("x" + idx, px - 10, mapY(0) + 14);

      // วาดจุด iteration
      ctx.beginPath();
      ctx.arc(px, py, idx === iterations.length - 1 ? 6 : 3, 0, 2 * Math.PI);
      ctx.fillStyle = idx === iterations.length - 1 ? "#fb923c" : "#f97316";
      ctx.fill();
    });
  }

  // --- ส่วนจัดการ input และผลลัพธ์ ---
  const handleRun = () => {
    // สร้างฟังก์ชันจากสมการ
    const func = makeFunc(expr);
    if (!func) { setStatus("สถานะ: สมการไม่ถูกต้อง"); return; }
    const x0val = parseFloat(x0);
    const tolVal = parseFloat(tol);
    const maxVal = parseInt(maxIter, 10);
    // ตรวจสอบความถูกต้องของ input
    if (isNaN(x0val)) { setStatus("สถานะ: x0 ไม่ถูกต้อง"); return; }
    if (!isFinite(tolVal) || tolVal <= 0) { setStatus("สถานะ: tol ต้องเป็นจำนวนบวก"); return; }
    if (!Number.isInteger(maxVal) || maxVal <= 0) { setStatus("สถานะ: Max Iteration ต้องเป็นจำนวนเต็มบวก"); return; }

    // เรียกฟังก์ชันคำนวณ
    const res = newtonRaphson(func, x0val, tolVal, maxVal);
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
    setExpr(""); setX0(""); setTol(""); setMaxIter("");
    setIterations([]); setStatus("สถานะ: รีเซ็ตแล้ว");
    setIters("-"); setRoot("-");
    drawPlot(() => 0, []);
  };

  // --- วาดกราฟเริ่มต้นเมื่อโหลดหน้า ---
  useEffect(() => { drawPlot(() => 0, []); }, []);

  // --- ส่วนแสดงผลหน้าจอ ---
  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="flex items-center justify-between gap-4 mb-4">
        <h1 className="text-xl font-bold text-cyan-400">Newton-Raphson Method</h1>
        <div className="text-sm text-gray-400">ตาราง + กราฟ แสดงการทำงาน</div>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Card: รับค่าต่าง ๆ จากผู้ใช้ */}
        <div className="bg-slate-800 rounded-lg p-4 shadow">
          <label className="block text-sm text-gray-400 mb-1">สมการ f(x)</label>
          <input type="text" value={expr} onChange={(e) => setExpr(e.target.value)}
            placeholder="เช่น x^3 - x - 2"
            className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 mb-3" />

          <div className="mb-3">
            <label className="block text-sm text-gray-400 mb-1">ค่า x0</label>
            <input type="number" value={x0} onChange={(e) => setX0(e.target.value)}
              placeholder="เช่น 1.5"
              className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700" />
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
              className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold py-2 rounded">คำนวณ</button>
            <button onClick={handleReset}
              className="flex-1 border border-slate-600 text-gray-400 py-2 rounded hover:bg-slate-700">รีเซ็ต</button>
          </div>

          {/* แสดงผลสถานะและผลลัพธ์ */}
          <div className="text-sm">
            <div>{status}</div>
            <div>Iterations: {iters}</div>
            <div>Root: {root}</div>
          </div>

          {/* Table: แสดงผลการคำนวณแต่ละ iteration */}
          {iterations.length > 0 && (
            <div className="overflow-auto max-h-64 mt-3">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-700 text-gray-400">
                    <th className="p-2 text-right">iter</th>
                    <th className="p-2 text-right">x</th>
                    <th className="p-2 text-right">f(x)</th>
                    <th className="p-2 text-right">error</th>
                  </tr>
                </thead>
                <tbody>
                  {iterations.map((r) => (
                    <tr key={r.iter} className="border-b border-slate-700">
                      <td className="p-2 text-right">{r.iter}</td>
                      <td className="p-2 text-right">{formatNum(r.x)}</td>
                      <td className="p-2 text-right">{formatNum(r.fx)}</td>
                      <td className="p-2 text-right">{r.error === null ? "-" : formatNum(r.error)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Graph Card: แสดงกราฟฟังก์ชันและจุด iteration */}
        <div className="bg-slate-800 rounded-lg p-4 shadow">
          <label className="block text-sm text-gray-400 mb-2">กราฟฟังก์ชัน + Iterations</label>
          <canvas ref={canvasRef} width={800} height={320}
            className="w-full h-72 bg-slate-900 rounded"></canvas>
          <div className="text-xs text-gray-400 mt-2">
            จุดส้ม = ค่าที่ได้ในแต่ละ iteration, จุดส้มใหญ่ = ค่าสุดท้าย  
            เส้นเขียว = เส้นสัมผัส f(x) ที่ x<sub>i</sub>, Label = x0, x1, x2 …
          </div>
        </div>
      </div>
    </div>
  );
}
