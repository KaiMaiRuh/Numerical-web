// src/pages/QuadraticSpline.jsx
import { useState, useEffect } from "react";
import * as QuadraticSplineService from "../services/QuadraticSplineService";
import useProblems from "../hooks/useProblems";
import PageHeader from "../components/PageHeader";
import SavedProblems from "../components/SavedProblems";
import { formatNum } from "../utils/math";
import solveQuadraticSpline from "../algorithms/quadraticSpline";
import GraphInterpolation from "../components/graphs/GraphInterpolation";
import TableInterpolation from "../components/tables/TableInterpolation";

export default function QuadraticSpline() {
  const [points, setPoints] = useState([
    { x: 0, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 4 },
  ]);
  const [xValue, setXValue] = useState("");
  const [yResult, setYResult] = useState(null);
  const [segments, setSegments] = useState([]);
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
      const res = solveQuadraticSpline(points, xNum);
      if (res.error) {
        setStatus("สถานะ: " + res.error);
        setYResult(null);
        return;
      }
      setYResult(res.y);
      setSegments(res.segments || []);
      setStatus("สถานะ: คำนวณสำเร็จ");
    } catch (e) {
      console.error(e);
      setStatus("สถานะ: เกิดข้อผิดพลาดในการคำนวณ");
    }
  };

  const handleReset = () => {
    setPoints([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 4 },
    ]);
    setXValue("");
    setYResult(null);
    setSegments([]);
    setStatus("สถานะ: รีเซ็ตแล้ว");
  };

  const handleAddPoint = () => {
    setPoints([...points, { x: 0, y: 0 }]);
  };

  const handleRemovePoint = (index) => {
    if (points.length <= 3) return alert("ต้องมีอย่างน้อย 3 จุด");
    setPoints(points.filter((_, i) => i !== index));
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
    <div className="max-w-6xl mx-auto p-6">
      <PageHeader
        title="Quadratic Spline Interpolation"
        subtitle="การประมาณค่า f(x) ด้วย Quadratic Spline"
      />

      <div className="grid md:grid-cols-2 gap-6">
        {/* ===== Input Section ===== */}
        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay1">
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
                        newPts[i].x = parseFloat(e.target.value) || 0;
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
                        newPts[i].y = parseFloat(e.target.value) || 0;
                        setPoints(newPts);
                      }}
                      className="w-20 px-2 py-1 rounded bg-slate-900 border border-slate-700"
                    />
                  </td>
                  <td className="p-1">
                    <button
                      onClick={() => handleRemovePoint(i)}
                      className="text-red-400 hover:text-red-300 text-xs"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={handleAddPoint}
            className="w-full btn-primary glow-btn py-2 rounded mb-3"
          >
            เพิ่มจุด
          </button>

          <div className="mb-3">
            <label className="block text-sm text-gray-400 mb-1">
              ค่า x ที่ต้องการหาค่า y
            </label>
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
        </div>

        {/* ===== Graph Section ===== */}
        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay2">
          <h3 className="text-gray-300 mb-2">กราฟ Quadratic Spline</h3>
          <div className="w-full h-72 bg-slate-900 rounded">
            <GraphInterpolation
              points={points}
              xTarget={parseFloat(xValue)}
              method="Quadratic Spline"
              className="w-full h-72"
            />
          </div>

          {yResult !== null ? (
            <div className="mt-3 text-sm text-gray-300">
              y({xValue}) ≈ <b>{formatNum(yResult)}</b>
            </div>
          ) : (
            <div className="text-sm text-gray-400 mt-3">ยังไม่มีการคำนวณ</div>
          )}
        </div>
      </div>

      {/* ===== Table Section ===== */}
      {segments.length > 0 && (
        <div className="mt-6">
          <TableInterpolation points={points} method="Quadratic Spline" />
        </div>
      )}

      <div className="text-sm text-gray-400 mt-6 fade-in-delay3">© By KaiMaiRuh</div>
    </div>
  );
}
