import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { makeFunc, formatNum } from "../utils/math";
import TableRoot from "../components/tables/TableRoot";
import GraphRoot from "../components/graphs/GraphRoot";
import SavedProblems from "../components/SavedProblems";
import useProblems from "../hooks/useProblems";
import * as OnePointService from "../services/OnePointService";
import { onePoint as runOnePoint } from "../algorithms/onePoint";

export default function OnePoint() {
  const [gxExpr, setGxExpr] = useState(""); // x_{n+1} = g(x)
  const [x0, setX0] = useState("");
  const [tol, setTol] = useState("");
  const [maxIter, setMaxIter] = useState("");
  const [iterations, setIterations] = useState([]);
  const [status, setStatus] = useState("สถานะ: ยังไม่ได้คำนวณ");
  const [root, setRoot] = useState("-");
  const [iters, setIters] = useState("-");

  const handleRun = () => {
    const g = makeFunc(gxExpr);
    if (!g) {
      setStatus("สถานะ: x_{n+1} ไม่ถูกต้อง");
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

    const res = runOnePoint(g, x0v, null, tolv, maxv);
    if (res.error) {
      setStatus("สถานะ: " + res.error);
      setIterations([]);
      setIters("-");
      setRoot("-");
      return;
    }
    // Build iterations with an initial row (iter 0 = x0) and y=x so graph can plot
    const its = [];
    its.push({ iter: 0, x0: x0v, y: x0v, error: null });
    for (const it of res.iterations || []) {
      // shift iteration index by +1 so iter 0 is the initial x0 row
      its.push({
        iter: (it.iter ?? 0) + 1,
        x1: it.x1,
        y: it.x1, // plot (x_k, x_k)
        error: it.error,
      });
    }
    setIterations(its);
    setStatus("สถานะ: เสร็จสิ้น " + (res.converged ? "(converged)" : "(ไม่ converged)"));
    setIters(Math.max(0, its.length - 1)); // exclude initial row when counting
    setRoot(formatNum(res.root));
  };

  // --- Saved problems ---
  const { problems, removingIds, refresh, saveProblem, deleteProblem } = useProblems(OnePointService);

  // load saved list on mount
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useState(() => {
    refresh().catch(console.error);
    // no-op setter; we just want to run refresh on mount
    return undefined;
  });

  const handleLoadProblem = (p) => {
    setGxExpr(p.gxExpr ?? p.expr ?? "");
    setX0(p.x0 ?? "");
    setTol(p.tol ?? "");
    setMaxIter(p.maxIter ?? "");
  };

  const handleDeleteProblem = (p) => {
    if (!confirm(`ลบโจทย์นี้ไหม?\n${p.gxExpr || p.expr || ''}`)) return;
    deleteProblem(p.id).catch((e) => {
      console.error("ลบโจทย์ผิดพลาด:", e);
      alert("ลบไม่สำเร็จ");
    });
  };

  const handleSaveProblem = async () => {
    if (!gxExpr || x0 === "" || !tol || !maxIter) {
      alert("กรอกให้ครบก่อนบันทึกนะ");
      return;
    }
    try {
      await saveProblem({ gxExpr, x0, tol, maxIter, method: "onepoint" });
      alert("บันทึกแล้ว!");
      await refresh();
    } catch (e) {
      console.error("บันทึกโจทย์ผิดพลาด:", e);
      alert("บันทึกไม่สำเร็จ ลองเช็ค console หรือการตั้งค่าการจัดเก็บข้อมูล");
    }
  };

  const handleReset = () => {
    setGxExpr("");
    setX0("");
    setTol("");
    setMaxIter("");
    setIterations([]);
    setStatus("สถานะ: รีเซ็ตแล้ว");
    setIters("-");
    setRoot("-");
  };

  const x0Num = parseFloat(x0);
  const xlForGraph = Number.isFinite(x0Num) ? x0Num - 5 : -5;
  const xrForGraph = Number.isFinite(x0Num) ? x0Num + 5 : 5;
  // Plot y = x (diagonal) as requested
  const identityFunc = (x) => x;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <PageHeader title="One-Point Iteration" subtitle="ระบุ x_{n+1} = g(x) โดยตรง" />

      <div className="grid md:grid-cols-2 gap-6">
        {/* ===== Input Panel ===== */}
        <div className="bg-slate-800 rounded-lg p-4 shadow">
          <label className="block text-sm text-gray-400 mb-1">x_{"{"}n+1{"}"} = g(x)</label>
          <input
            type="text"
            value={gxExpr}
            onChange={(e) => setGxExpr(e.target.value)}
            placeholder="เช่น (1 + 43*x)/86"
            className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 mb-3"
          />

          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">ค่าเริ่มต้น x0</label>
              <input
                type="number"
                value={x0}
                onChange={(e) => setX0(e.target.value)}
                placeholder="เช่น 0.01"
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

          <div className="flex gap-3 mb-4">
            <button onClick={handleRun} className="flex-1 btn-primary glow-btn py-2 rounded font-semibold">คำนวณ</button>
            <button onClick={handleReset} className="flex-1 btn-danger border border-slate-600 py-2 rounded">รีเซ็ต</button>
          </div>

          {/* บันทึก/โหลด/ลบโจทย์ */}
          <button onClick={handleSaveProblem} className="w-full btn-primary glow-btn py-2 rounded mb-3">บันทึกโจทย์</button>

          <div className="text-sm text-gray-300">
            <div>{status}</div>
            <div>Iterations: {iters}</div>
            <div>Root: {root}</div>
          </div>

          <SavedProblems problems={problems} onLoad={handleLoadProblem} onDelete={handleDeleteProblem} removingIds={removingIds} />

          {/* ตารางคำตอบ */}
          {iterations.length > 0 && <TableRoot iterations={iterations} hideFx />}
        </div>

        {/* ===== Graph Panel ===== */}
        <div className="bg-slate-800 rounded-lg p-4 shadow">
          <label className="block text-sm text-gray-400 mb-2">กราฟฟังก์ชัน</label>
          <div className="w-full h-72 bg-slate-900 rounded overflow-hidden">
            <GraphRoot
              func={identityFunc}
              xl={xlForGraph}
              xr={xrForGraph}
              iterations={iterations}
              staircase
              className="w-full h-72 rounded"
              caption="ขั้นบันไดแดง: (x_k,x_k) → (x_k,x_{k+1}) → (x_{k+1},x_{k+1})"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
