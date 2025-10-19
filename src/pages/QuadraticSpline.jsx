// src/pages/QuadraticSpline.jsx
import { useState, useEffect } from "react";
import * as QuadraticSplineService from "../services/QuadraticSplineService";
import useProblems from "../hooks/useProblems";
import PageHeader from "../components/PageHeader";
import SavedProblems from "../components/SavedProblems";
import { formatNum } from "../utils/math";
import solveQuadraticSpline from "../algorithms/quadraticSpline";

export default function QuadraticSpline() {
  const [points, setPoints] = useState([
    { x: "", y: "" },
    { x: "", y: "" },
    { x: "", y: "" },
  ]);
  const [xValue, setXValue] = useState("");
  const [yResult, setYResult] = useState(null);
  const [segments, setSegments] = useState([]); // will store global-form coefficients per segment
  const [status, setStatus] = useState("สถานะ: ยังไม่ได้คำนวณ");

  const { problems, removingIds, refresh, saveProblem, deleteProblem } =
    useProblems(QuadraticSplineService);

  useEffect(() => {
    refresh().catch(console.error);
  }, [refresh]);

  const handleRun = () => {
    try {
      const xNum = parseFloat(xValue);
      if (isNaN(xNum)) {
        setStatus("กรุณากรอกค่า x ให้ถูกต้อง");
        return;
      }
      // Build numeric points from inputs
      const numericPoints = points
        .map((p) => ({ x: parseFloat(p.x), y: parseFloat(p.y) }))
        .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y))
        .sort((p1, p2) => p1.x - p2.x);

      if (numericPoints.length < 3) {
        setStatus("ต้องมีอย่างน้อย 3 จุด และต้องเป็นตัวเลข");
        setYResult(null);
        setSegments([]);
        return;
      }

      const res = solveQuadraticSpline(numericPoints, xNum);
      if (res.error) {
        setStatus("สถานะ: " + res.error);
        setYResult(null);
        return;
      }
      setYResult(res.y);

      // Convert local form y = a + b*dx + c*dx^2 (dx = x - x_i)
      // to global form y = A*x^2 + B*x + C for each segment [x_i, x_{i+1}]
      const segs = [];
      const n = numericPoints.length - 1;
      for (let i = 0; i < n; i++) {
        const xi = numericPoints[i].x;
        const xl = numericPoints[i].x;
        const xr = numericPoints[i + 1].x;
        const c = res.c?.[i] ?? 0; // quadratic term coefficient for dx^2
        const b = res.b?.[i] ?? 0; // linear term for dx
        const a = res.a?.[i] ?? 0; // constant term
        const A = c;
        const B = b - 2 * c * xi;
        const C = a - b * xi + c * xi * xi;
        segs.push({ i: i + 1, A, B, C, xl, xr });
      }
      setSegments(segs);
      setStatus("สถานะ: คำนวณสำเร็จ");
    } catch (e) {
      console.error(e);
      setStatus("สถานะ: เกิดข้อผิดพลาดในการคำนวณ");
    }
  };

  const handleReset = () => {
    setPoints([
      { x: "", y: "" },
      { x: "", y: "" },
      { x: "", y: "" },
    ]);
    setXValue("");
    setYResult(null);
    setSegments([]);
    setStatus("สถานะ: รีเซ็ตแล้ว");
  };

  const handleSaveProblem = async () => {
    try {
      const payload = {
        points: JSON.stringify(points),
        xValue,
        expr: `Quadratic Spline (${points.length} points)`,
        method: "quadratic_spline",
      };
      await saveProblem(payload);
      alert("บันทึกแล้ว!");
    } catch (e) {
      console.error("save problem failed:", e);
      alert("บันทึกไม่สำเร็จ: " + (e?.message || String(e)));
    }
  };

  const handleLoadProblem = (p) => {
    try {
      const parsedPoints =
        typeof p.points === "string" ? JSON.parse(p.points) : p.points || [];
      setPoints(parsedPoints);
      setXValue(p.xValue || "");
    } catch (err) {
      console.error("failed to parse saved problem", err, p);
      alert("ไม่สามารถโหลดโจทย์: ข้อมูลที่บันทึกไม่ถูกต้อง");
    }
  };

  const handleDeleteProblem = (p) => {
    if (!confirm("ลบโจทย์นี้ไหม?")) return;
    deleteProblem(p.id);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader
        title="Quadratic Spline Interpolation"
        subtitle="การประมาณค่า f(x) ด้วย Quadratic Spline"
      />

      <div className="bg-slate-800 rounded-lg p-4 shadow">
        {/* ===== Input Section ===== */}
        <label className="block text-sm text-gray-400 mb-1">จำนวนจุดข้อมูล (≥ 3)</label>
        <input
          type="number"
          value={points.length}
          onChange={(e) => {
            const n = Math.max(3, parseInt(e.target.value) || 3);
            setPoints(Array.from({ length: n }, () => ({ x: "", y: "" })));
          }}
          className="w-24 px-3 py-2 rounded bg-slate-900 border border-slate-700 mb-3"
        />
        <label className="block text-sm text-gray-400 mb-1">จุดข้อมูล (x, y)</label>
        <table className="text-sm border-collapse mb-3">
          <tbody>
            {points.map((p, i) => (
              <tr key={i}>
                <td className="p-1">
                  <input
                    type="number"
                    value={p.x}
                    onChange={(e) => {
                      const newPts = [...points];
                      newPts[i].x = e.target.value;
                      setPoints(newPts);
                    }}
                    className="w-20 px-2 py-1 rounded bg-slate-900 border border-slate-700"
                  />
                </td>
                <td className="p-1">
                  <input
                    type="number"
                    value={p.y}
                    onChange={(e) => {
                      const newPts = [...points];
                      newPts[i].y = e.target.value;
                      setPoints(newPts);
                    }}
                    className="w-20 px-2 py-1 rounded bg-slate-900 border border-slate-700"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mb-3">
          <label className="block text-sm text-gray-400 mb-1">ค่า x ที่ต้องการหาค่า y</label>
          <input
            type="number"
            value={xValue}
            onChange={(e) => setXValue(e.target.value)}
            className="w-32 px-3 py-2 rounded bg-slate-900 border border-slate-700"
          />
        </div>

        <div className="flex gap-3 mb-3">
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

        <button
          onClick={handleSaveProblem}
          className="w-full btn-primary glow-btn py-2 rounded mb-3"
        >
          บันทึกโจทย์
        </button>

        <div className="text-sm mb-2 text-gray-300">{status}</div>
        <SavedProblems
          problems={problems}
          onLoad={handleLoadProblem}
          onDelete={handleDeleteProblem}
          removingIds={removingIds}
        />

        {/* Results */}
        {yResult !== null && (
          <div className="mt-4 text-sm text-gray-200">
            <div className="mb-2">ผลลัพธ์ y = {formatNum(yResult)}</div>
            {segments && segments.length > 0 && (
              <div className="mt-3 text-sm text-gray-300">
                <div className="mb-2">ฟังก์ชันในแต่ละช่วง:</div>
                <ul className="space-y-1">
                  {segments.map((s, idx) => (
                    <li key={idx} className="whitespace-pre-wrap">
                      {`f${s.i}(x) = (${formatNum(s.A)})x^2 + (${formatNum(s.B)})x + (${formatNum(s.C)});  ${formatNum(s.xl)} ≤ x ≤ ${formatNum(s.xr)}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="text-sm text-gray-400 mt-6 fade-in-delay3">© By KaiMaiRuh</div>
    </div>
  );
}
