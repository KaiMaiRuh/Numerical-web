import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import { makeFunc, formatNum } from "../utils/math";
import TableRoot from "../components/tables/TableRoot";

export default function OnePoint() {
  const [fxExpr, setFxExpr] = useState("");
  const [x0, setX0] = useState("");
  const [tol, setTol] = useState("");
  const [maxIter, setMaxIter] = useState("");
  const [iterations, setIterations] = useState([]);
  const [status, setStatus] = useState("สถานะ: ยังไม่ได้คำนวณ");
  const [root, setRoot] = useState("-");
  const [iters, setIters] = useState("-");
  const [lambdaPreview, setLambdaPreview] = useState(null);
  const [f2String, setF2String] = useState(""); // แสดง f2(x) ให้ผู้ใช้เห็น

  // use makeFunc and formatNum from ../utils/math

  // อนุพันธ์เชิงตัวเลขแบบ central difference
  function numericDerivative(f, x) {
    const h = Math.cbrt(Number.EPSILON) * (Math.abs(x) + 1); // ขั้นเล็กแบบเสถียร
    const f1 = f(x + h);
    const f2 = f(x - h);
    return (f1 - f2) / (2 * h);
  }

  // คำนวณ λ อัตโนมัติจาก f'(x0)
  function computeLambda(f, x0) {
    try {
      const df = numericDerivative(f, x0);
      if (!isFinite(df) || df === 0) return 0.5; // fallback
      // ทำให้ไม่เกิน 1 เพื่อลดโอกาส overshoot
      return 1 / Math.max(1, Math.abs(df));
    } catch {
      return 0.5;
    }
  }

  // ---------- ทำ iteration: x_{i+1} = x_i - λ f(x_i) ----------
  function onePointWithLambda(f, x0, tol, maxIter, lambda) {
    let its = [];
    let prev = x0;

    its.push({ iter: 0, x: prev, error: null });

    for (let i = 1; i <= maxIter; i++) {
      const curr = prev - lambda * f(prev);
      const err = Math.abs((curr - prev) / curr);

      its.push({ iter: i, x: curr, error: err });

      if (!isFinite(curr)) {
        return { error: "ค่า x ไม่เป็นจำนวนจำกัด (อาจ Diverge)" };
      }
      if (err <= tol) {
        return { root: curr, iterations: its, converged: true, lambda };
      }
      prev = curr;
    }
    return { root: its[its.length - 1].x, iterations: its, converged: false, lambda };
  }

  // preview f2(x) เมื่อผู้ใช้กรอก f(x) หรือ x0
  useEffect(() => {
    const f = makeFunc(fxExpr);
    const x0v = parseFloat(x0);
    if (!f || !isFinite(x0v)) {
      setLambdaPreview(null);
      setF2String("");
      return;
    }
    const lam = computeLambda(f, x0v);
    setLambdaPreview(lam);
    // แสดงสตริง f2(x) อ่านง่าย
    const fxNorm = fxExpr.replace(/\s+/g, " ").trim();
    setF2String(`f2(x) = x - (${lam.toPrecision(6)}) * [ ${fxNorm || "f(x)"} ]`);
  }, [fxExpr, x0]);

  const handleRun = () => {
    const f = makeFunc(fxExpr);
    if (!f) {
      setStatus("สถานะ: f(x) ไม่ถูกต้อง");
      return;
    }
    const x0v = parseFloat(x0);
    const tolv = parseFloat(tol);
    const maxv = parseInt(maxIter, 10);

    if (!isFinite(x0v)) {
      setStatus("สถานะ: ค่าเริ่มต้น x0 ไม่ถูกต้อง");
      return;
    }
    if (!isFinite(tolv) || tolv <= 0) {
      setStatus("สถานะ: Error (tol) ต้องเป็นจำนวนบวก เช่น 1e-6");
      return;
    }
    if (!Number.isInteger(maxv) || maxv <= 0) {
      setStatus("สถานะ: Max Iteration ต้องเป็นจำนวนเต็มบวก เช่น 50");
      return;
    }

    const lam = computeLambda(f, x0v);
    const res = onePointWithLambda(f, x0v, tolv, maxv, lam);
    if (res.error) {
      setStatus("สถานะ: " + res.error);
      setIterations([]);
      setIters("-");
      setRoot("-");
      return;
    }
    setIterations(res.iterations);
    setStatus("สถานะ: เสร็จสิ้น " + (res.converged ? "(converged)" : "(ไม่ converged)"));
    setIters(res.iterations.length);
    setRoot(formatNum(res.root));
    setLambdaPreview(res.lambda);
    const fxNorm = fxExpr.replace(/\s+/g, " ").trim();
    setF2String(`f2(x) = x - (${res.lambda.toPrecision(6)}) * [ ${fxNorm || "f(x)"} ]`);
  };

  const handleReset = () => {
    setFxExpr("");
    setX0("");
    setTol("");
    setMaxIter("");
    setIterations([]);
    setStatus("สถานะ: รีเซ็ตแล้ว");
    setIters("-");
    setRoot("-");
    setLambdaPreview(null);
    setF2String("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader title="One-Point Iteration" subtitle="แปลง f(x) → f2(x) อัตโนมัติ" />

      <div className="bg-slate-800 rounded-lg p-4 shadow">
        {/* f(x) */}
        <label className="block text-sm text-gray-400 mb-1">f(x)</label>
        <input
          type="text"
          value={fxExpr}
          onChange={(e) => setFxExpr(e.target.value)}
          placeholder="เช่น x^3 + x - 1,  sin(x) - x/2,  ln(x) - 1"
          className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 mb-3"
        />

        {/* x0, tol, maxIter */}
        <div className="flex gap-3 mb-3">
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">ค่าเริ่มต้น x0</label>
            <input
              type="number"
              value={x0}
              onChange={(e) => setX0(e.target.value)}
              placeholder="เช่น 0.5"
              className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">Error</label>
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

        {/* แสดง f2(x) ที่ระบบแปลงให้ */}
        <div className="rounded-md bg-slate-900 border border-slate-700 p-3 text-sm text-gray-300 mb-4">
          <div className="font-semibold text-cyan-300 mb-1">f2(x) ที่ใช้ในการคำนวณ</div>
          <div className="break-words">{f2String || "— (กรอก f(x) และ x0 เพื่อดู f2(x))"}</div>
          {lambdaPreview !== null && (
            <div className="text-xs text-gray-400 mt-1">
              λ (อัตโนมัติ) = {formatNum(lambdaPreview)}
            </div>
          )}
        </div>

        {/* ปุ่ม */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={handleRun}
            className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold py-2 rounded"
          >
            คำนวณ
          </button>
          <button
            onClick={handleReset}
            className="flex-1 border border-slate-600 text-gray-400 py-2 rounded hover:bg-slate-700"
          >
            รีเซ็ต
          </button>
        </div>

        {/* สถานะ */}
        <div className="text-sm mb-3">
          <div>{status}</div>
          <div>Iterations: {iters}</div>
          <div>Root: {root}</div>
        </div>

        {/* ตารางผลลัพธ์ */}
        {iterations.length > 0 && (
          <div className="mt-3">
            <TableRoot iterations={iterations} />
          </div>
        )}

        {/* คำแนะนำสั้น ๆ */}
        <div className="text-xs text-gray-400 mt-4">
          <div>หมายเหตุ: ใช้หน่วยเรเดียนสำหรับ sin/cos/tan; เขียนคูณให้ชัด เช่น 2*x (ไม่ใช่ 2x)</div>
          <div>ตัวอย่าง f(x): x^3 + x - 1,  e^(-x) - x,  ln(x) - 1,  sin(x) - x/2</div>
        </div>
      </div>
    </div>
  );
}
