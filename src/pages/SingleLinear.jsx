// src/pages/SingleLinear.jsx
import { useState, useEffect } from "react";
import * as SingleLinearService from "../services/SingleLinearService";
import useProblems from "../hooks/useProblems";
import PageHeader from "../components/PageHeader";
import SavedProblems from "../components/SavedProblems";
import { formatNum } from "../utils/math";
import solveSingleLinearRegression from "../algorithms/singleLinear";
import GraphSimpleRegression from "../components/graphs/GraphSimpleRegression";

export default function SingleLinear() {
  // start with empty input rows
  const [points, setPoints] = useState([
    { x: "", y: "" },
    { x: "", y: "" },
    { x: "", y: "" },
  ]);
  const [xPredict, setXPredict] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("สถานะ: ยังไม่ได้คำนวณ");

  const { problems, removingIds, refresh, saveProblem, deleteProblem } =
    useProblems(SingleLinearService);

  useEffect(() => {
    refresh().catch(console.error);
  }, [refresh]);

  const handleRun = () => {
    try {
      // validate inputs
      const numericPoints = points.map((p) => ({ x: parseFloat(p.x), y: parseFloat(p.y) }));
      if (numericPoints.some((p) => Number.isNaN(p.x) || Number.isNaN(p.y))) {
        setStatus("กรุณากรอกจุดข้อมูลให้ครบและเป็นตัวเลข");
        return;
      }
      const xNum = parseFloat(xPredict);
      if (Number.isNaN(xNum)) {
        setStatus("กรุณากรอกค่า x ที่ต้องการทำนาย");
        return;
      }
      const res = solveSingleLinearRegression(numericPoints, xNum);
      if (res.error) {
        setStatus("สถานะ: " + res.error);
        setResult(null);
        return;
      }
      setResult(res);
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
    setXPredict("");
    setResult(null);
    setStatus("สถานะ: รีเซ็ตแล้ว");
  };

  const handleAddPoint = () => {
    setPoints([...points, { x: 0, y: 0 }]);
  };

  const handleRemovePoint = (index) => {
    if (points.length <= 2) return alert("ต้องมีอย่างน้อย 2 จุด");
    setPoints(points.filter((_, i) => i !== index));
  };

  const handleSaveProblem = async () => {
    try {
      const payload = {
        points: JSON.stringify(points),
        xPredict,
        expr: `Single Linear Regression (${points.length} points)`,
        method: "single_linear_regression",
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
      setXPredict(p.xPredict || "");
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
        title="Single Linear Regression"
        subtitle="การหาสมการเส้นตรงที่เหมาะสมกับข้อมูล (y = a + bx)"
      />

      <div className="grid md:grid-cols-2 gap-6">
        {/* ===== Input Section ===== */}
        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay1">
          <label className="block text-sm text-gray-400 mb-1">
            จุดข้อมูล (x, y)
          </label>
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
                        newPts[i].x = e.target.value === "" ? "" : parseFloat(e.target.value);
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
                        newPts[i].y = e.target.value === "" ? "" : parseFloat(e.target.value);
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
              ค่า x ที่ต้องการทำนาย (xₚ)
            </label>
            <input
              type="number"
              value={xPredict}
              onChange={(e) => setXPredict(e.target.value)}
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

        {/* ===== Output Section ===== */}
        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay2">
          <h3 className="text-gray-300 mb-2">กราฟ Single Linear Regression</h3>
          <div className="w-full h-72 rounded overflow-hidden">
            <GraphSimpleRegression
              xs={points.map((p) => p.x)}
              ys={points.map((p) => p.y)}
              a={result?.a}
              b={result?.b}
              className="w-full h-full"
            />
          </div>

          {result ? (
            <div className="text-sm text-gray-300 space-y-1 mt-3">
              <div>a = {formatNum(result.a)} <span className="text-gray-400">(จุดตัดแกน y หรือค่าคงที่)</span></div>
              <div>b = {formatNum(result.b)} <span className="text-gray-400">(ความชันของเส้นตรง)</span></div>
              <div>
                สมการ: y = {formatNum(result.a)} + {formatNum(result.b)}x
              </div>
              <div>
                y({xPredict}) = <span className="font-semibold">{formatNum(result.yPred)}</span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-400 mt-3">ยังไม่มีผลลัพธ์</div>
          )}
        </div>
      </div>

      {/* ===== Table Section ===== */}
      {/* Regression table removed per configuration (graph only) */}

      <div className="text-sm text-gray-400 mt-6 fade-in-delay3">
        © By KaiMaiRuh
      </div>
    </div>
  );
}
