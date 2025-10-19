import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { makeFunc, formatNum } from "../utils/math";
import GraphRoot from "../components/graphs/GraphRoot";
import useProblems from "../hooks/useProblems";
import SavedProblems from "../components/SavedProblems";
import * as GraphicalService from "../services/GraphicalMethodService";

export default function GraphicalMethod() {
  const [expr, setExpr] = useState("");
  const [xl, setXl] = useState("");
  const [xr, setXr] = useState("");
  const [tol, setTol] = useState("");
  const [iterations, setIterations] = useState([]);
  const [status, setStatus] = useState("สถานะ: ยังไม่ได้คำนวณ");

  // Graphical method (incremental scan):
  // 1) Scan from XL to XR with coarse step (default ~1 if range>=1)
  // 2) On sign change, zoom in (step /= 10) and rescan inside the bracket
  // 3) Repeat until the relative change in x (error) < tol or max levels reached
  const runGraphicalScan = (f, a, b, tolVal) => {
    const rows = [];
    const range = b - a;
    if (!(range > 0)) return { error: "ต้องมี XL < XR", iterations: [] };

    // choose coarse step: 1 for typical ranges >= 1, otherwise power of 10 for small ranges
    let step = 1;
    if (range < 1) {
      const exp = Math.floor(Math.log10(range));
      step = Math.pow(10, exp); // e.g. range 0.8 => step 0.1
    }

    const maxLevels = 6; // refine to 1e-6 scale
    const maxIter = 20000;

    let left = a;
    let right = b;
    let level = 0;

    let prevX = null;
    let prevY = null;

    // helper to push a row; compute relative x-change error like bisection
    const pushRow = (x, y) => {
      const prev = rows.length ? rows[rows.length - 1].x : null;
      const error = prev === null ? null : Math.abs((x - prev) / x);
      rows.push({ iter: rows.length + 1, x, fx: y, error });
      return error;
    };

    // If f(a) is NaN or infinite, bail early
    try {
      const ya = f(a);
      if (!isFinite(ya)) return { error: "ฟังก์ชันไม่สามารถประเมินค่าได้ที่ XL", iterations: [] };
    } catch {
      return { error: "สมการไม่ถูกต้องหรือประเมินค่าไม่ได้", iterations: [] };
    }

    while (level <= maxLevels && rows.length < maxIter) {
      let refined = false;
      prevX = null;
      prevY = null;
      // scan forward with current step
      for (let x = left; x <= right + 1e-12; x = +(x + step).toFixed(12)) {
        let y;
        try {
          y = f(x);
        } catch {
          continue;
        }
        if (!isFinite(y)) continue;

  const err = pushRow(x, y);
  if (err !== null && err <= tolVal) return { iterations: rows };

        if (prevX !== null && prevY !== null && prevY * y <= 0) {
          // found sign change; zoom into [prevX, x]
          left = Math.min(prevX, x);
          right = Math.max(prevX, x);
          step = step / 10;
          level += 1;
          refined = true;
          break; // restart scanning in the smaller bracket
        }
        prevX = x;
        prevY = y;
        if (rows.length >= maxIter) break;
      }

      if (!refined) break; // no sign change found; stop
    }

    return { iterations: rows };
  };

  // Saved problems
  const { problems, removingIds, refresh, saveProblem, deleteProblem } = useProblems(GraphicalService);
  useEffect(() => { refresh().catch(console.error); }, [refresh]);

  const handleSave = async () => {
    if (!expr || xl === "" || xr === "" || !tol) {
      alert("กรอกให้ครบก่อนบันทึก");
      return;
    }
    try {
      await saveProblem({ expr, xl, xr, tol, method: "graphical" });
      alert("บันทึกแล้ว!");
    } catch (e) {
      console.error("บันทึกโจทย์ผิดพลาด", e);
      alert("บันทึกไม่สำเร็จ");
    }
  };

  const handleLoad = (p) => {
    setExpr(p.expr ?? "");
    setXl(p.xl ?? "");
    setXr(p.xr ?? "");
    setTol(p.tol ?? "");
  };

  const handleDelete = (p) => {
    if (!confirm(`ลบโจทย์นี้ไหม?\n${p.expr}`)) return;
    deleteProblem(p.id).catch((e) => {
      console.error("ลบโจทย์ผิดพลาด", e);
      alert("ลบไม่สำเร็จ");
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <PageHeader
        title="Graphical Method"
        subtitle="หาค่ารากของสมการโดยดูจุดตัดแกน X จากกราฟ f(x)"
      />

      <div className="grid md:grid-cols-2 gap-6">
        {/* ===== Input Panel ===== */}
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

          <div className="mb-3">
            <label className="block text-sm text-gray-400 mb-1">Error (เช่น 1e-6)</label>
            <input
              type="text"
              value={tol}
              onChange={(e) => setTol(e.target.value)}
              placeholder="เช่น 1e-6"
              className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700"
            />
          </div>

          <div className="flex gap-3 mb-3">
            <button
              onClick={() => {
                const func = makeFunc(expr);
                if (!func) {
                  setStatus("สถานะ: สมการไม่ถูกต้อง");
                  setIterations([]);
                  return;
                }
                const a = parseFloat(xl);
                const b = parseFloat(xr);
                const tolVal = parseFloat(tol);

                if (Number.isNaN(a) || Number.isNaN(b)) {
                  setStatus("สถานะ: XL/XR ไม่ถูกต้อง");
                  return;
                }
                if (a >= b) {
                  setStatus("สถานะ: ต้องมี XL < XR");
                  return;
                }
                if (!isFinite(tolVal) || tolVal <= 0) {
                  setStatus("สถานะ: Error ต้องเป็นจำนวนบวก เช่น 1e-6");
                  return;
                }

                const res = runGraphicalScan(func, a, b, tolVal);
                if (res.error) {
                  setStatus("สถานะ: " + res.error);
                  setIterations([]);
                  return;
                }
                setIterations(res.iterations || []);
                setStatus("สถานะ: เสร็จสิ้น");
              }}
              className="flex-1 btn-primary glow-btn py-2 rounded font-semibold"
            >
              คำนวณ
            </button>
            <button
              onClick={() => {
                setExpr("");
                setXl("");
                setXr("");
                setTol("");
                setIterations([]);
                setStatus("สถานะ: รีเซ็ตแล้ว");
              }}
              className="flex-1 btn-danger border border-slate-600 py-2 rounded"
            >
              รีเซ็ต
            </button>
          </div>

          <button onClick={handleSave} className="w-full btn-primary glow-btn py-2 rounded mb-3">บันทึกโจทย์</button>

          <SavedProblems
            problems={problems}
            onLoad={handleLoad}
            onDelete={handleDelete}
            removingIds={removingIds}
          />

          <div className="text-sm text-gray-300 mt-3">{status}</div>
        </div>

        {/* ===== Graph Panel ===== */}
        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay2">
          <label className="block text-sm text-gray-400 mb-2">กราฟฟังก์ชัน f(x)</label>
          <div className="w-full h-72 bg-slate-900 rounded">
            <GraphRoot
              func={(() => { const f = makeFunc(expr); return f || ((x)=>x); })()}
              xl={Number.isFinite(parseFloat(xl)) ? parseFloat(xl) : -5}
              xr={Number.isFinite(parseFloat(xr)) ? parseFloat(xr) : 5}
              iterations={iterations}
              points={[]}
              caption="จุดแดง = (x_k, f(x_k)) ของแต่ละรอบ"
              className="w-full h-72 rounded"
            />
          </div>
        </div>
      </div>

      {/* ===== Results Table (Graphical method incremental scan) ===== */}
      {iterations.length > 0 && (
        <div className="bg-slate-800 rounded-xl shadow-md p-4 mt-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-700 text-gray-300">
              <tr>
                <th className="p-2 text-center">iter</th>
                <th className="p-2 text-center">x_k</th>
                <th className="p-2 text-center">y_k</th>
                <th className="p-2 text-center">error</th>
              </tr>
            </thead>
            <tbody>
              {iterations.map((it, i) => (
                <tr key={i} className="border-b border-slate-700 hover:bg-slate-900 transition-colors">
                  <td className="p-2 text-center font-medium">{it.iter ?? i}</td>
                  <td className="p-2 text-center">{it.x !== undefined ? formatNum(it.x) : "-"}</td>
                  <td className="p-2 text-center">{it.fx !== undefined ? formatNum(it.fx) : "-"}</td>
                  <td className="p-2 text-center">{it.error !== undefined && it.error !== null ? formatNum(it.error) : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right text-gray-300 mt-3">
            Total number of iterations: {iterations.length}
          </div>
        </div>
      )}

      <div className="text-sm text-gray-400 mt-6 fade-in-delay3">© By KaiMaiRuh</div>
    </div>
  );
}
