import { useState, useEffect } from "react";
import * as CubicSplineService from "../services/CubicSplineService";
import useProblems from "../hooks/useProblems";
import PageHeader from "../components/PageHeader";
import SavedProblems from "../components/SavedProblems";
import { formatNum } from "../utils/math";

export default function CubicSpline() {
  const [points, setPoints] = useState([
    { x: 0, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 4 },
    { x: 3, y: 9 },
  ]);
  const [xValue, setXValue] = useState("");
  const [yResult, setYResult] = useState(null);
  const [status, setStatus] = useState("สถานะ: ยังไม่ได้คำนวณ");

  const { problems, removingIds, refresh, saveProblem, deleteProblem } =
    useProblems(CubicSplineService);

  useEffect(() => {
    refresh().catch(console.error);
  }, [refresh]);

  // ----------- Helper functions -----------
  const solveCubicSpline = (pts, x) => {
    const n = pts.length;
    if (n < 3) return { error: "ต้องมีจุดอย่างน้อย 3 จุด" };

    const h = [];
    const alpha = [];
    const l = [];
    const mu = [];
    const z = [];
    const a = [];
    const b = [];
    const c = [];
    const d = [];

    for (let i = 0; i < n; i++) a[i] = pts[i].y;
    for (let i = 0; i < n - 1; i++) h[i] = pts[i + 1].x - pts[i].x;

    // ตรวจว่ามีค่า x ซ้ำไหม
    if (h.some((v) => v === 0)) return { error: "ค่าของ x ซ้ำกัน" };

    // step 1: alpha
    for (let i = 1; i < n - 1; i++) {
      alpha[i] =
        (3 / h[i]) * (a[i + 1] - a[i]) -
        (3 / h[i - 1]) * (a[i] - a[i - 1]);
    }

    // step 2: solve tridiagonal system (Natural Spline)
    l[0] = 1;
    mu[0] = 0;
    z[0] = 0;
    for (let i = 1; i < n - 1; i++) {
      l[i] = 2 * (pts[i + 1].x - pts[i - 1].x) - h[i - 1] * mu[i - 1];
      mu[i] = h[i] / l[i];
      z[i] = (alpha[i] - h[i - 1] * z[i - 1]) / l[i];
    }
    l[n - 1] = 1;
    z[n - 1] = 0;
    c[n - 1] = 0;

    // step 3: backward substitution
    for (let j = n - 2; j >= 0; j--) {
      c[j] = z[j] - mu[j] * c[j + 1];
      b[j] = (a[j + 1] - a[j]) / h[j] - h[j] * (c[j + 1] + 2 * c[j]) / 3;
      d[j] = (c[j + 1] - c[j]) / (3 * h[j]);
    }

    // หา segment ที่ x อยู่
    let i = n - 2;
    for (let j = 0; j < n - 1; j++) {
      if (x >= pts[j].x && x <= pts[j + 1].x) {
        i = j;
        break;
      }
    }

    const dx = x - pts[i].x;
    const y = a[i] + b[i] * dx + c[i] * dx ** 2 + d[i] * dx ** 3;
    return { a, b, c, d, y };
  };

  // ----------- Handlers -----------
  const handleRun = () => {
    try {
      const xNum = parseFloat(xValue);
      if (isNaN(xNum)) {
        setStatus("กรุณากรอกค่า x ให้ถูกต้อง");
        return;
      }
      const res = solveCubicSpline(points, xNum);
      if (res.error) {
        setStatus("สถานะ: " + res.error);
        setYResult(null);
        return;
      }
      setYResult(res.y);
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
      { x: 3, y: 9 },
    ]);
    setXValue("");
    setYResult(null);
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
        expr: `Cubic Spline (${points.length} points)`,
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

  // ----------- UI -----------
  return (
    <div className="max-w-6xl mx-auto p-6">
      <PageHeader
        title="Cubic Spline"
        subtitle="ประมาณค่า y ด้วย Cubic Spline Interpolation"
      />

      <div className="grid md:grid-cols-2 gap-6">
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

          <div className="text-sm mb-2">{status}</div>
          <SavedProblems
            problems={problems}
            onLoad={handleLoadProblem}
            onDelete={handleDeleteProblem}
            removingIds={removingIds}
          />
        </div>

        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay2">
          <h3 className="text-gray-300 mb-2">ผลลัพธ์</h3>
          {yResult !== null ? (
            <div className="text-sm text-gray-300">
              y({xValue}) = <span className="font-semibold">{formatNum(yResult)}</span>
            </div>
          ) : (
            <div className="text-sm text-gray-400">ยังไม่มีผลลัพธ์</div>
          )}
          <div className="mt-4 text-sm text-gray-400">
            Cubic Spline ใช้สมการกำลังสามแต่ละช่วง เพื่อให้เส้นต่อเนื่องทั้งค่าฟังก์ชันและอนุพันธ์
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-400 mt-6 fade-in-delay3">© By KaiMaiRuh</div>
    </div>
  );
}
