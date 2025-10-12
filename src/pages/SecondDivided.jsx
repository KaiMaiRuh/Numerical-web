// src/pages/SecondDivided.jsx
import { useState, useEffect } from "react";
import * as SecondDividedService from "../services/SecondDividedService";
import useProblems from "../hooks/useProblems";
import PageHeader from "../components/PageHeader";
import SavedProblems from "../components/SavedProblems";
import { formatNum } from "../utils/math";
import secondDividedDiff from "../algorithms/secondDivided";
import GraphInterpolation from "../components/graphs/GraphInterpolation";
import TableInterpolation from "../components/tables/TableInterpolation";

export default function SecondDivided() {
  const [x0, setX0] = useState(1);
  const [x1, setX1] = useState(2);
  const [x2, setX2] = useState(3);
  const [fx0, setFx0] = useState(2);
  const [fx1, setFx1] = useState(5);
  const [fx2, setFx2] = useState(10);
  const [x, setX] = useState(2.5);

  const [f01, setF01] = useState("-");
  const [f12, setF12] = useState("-");
  const [f012, setF012] = useState("-");
  const [result, setResult] = useState("-");
  const [status, setStatus] = useState("สถานะ: ยังไม่ได้คำนวณ");

  const { problems, removingIds, refresh, saveProblem, deleteProblem } =
    useProblems(SecondDividedService);

  useEffect(() => {
    refresh().catch(console.error);
  }, [refresh]);

  const handleRun = () => {
    try {
      const { f01, f12, f012, Px } = secondDividedDiff(
        x0,
        x1,
        x2,
        fx0,
        fx1,
        fx2,
        x
      );
      setF01(f01);
      setF12(f12);
      setF012(f012);
      setResult(Px);
      setStatus("สถานะ: คำนวณสำเร็จ");
    } catch (err) {
      console.error(err);
      setStatus("สถานะ: เกิดข้อผิดพลาดในการคำนวณ");
    }
  };

  const handleReset = () => {
    setX0(1);
    setX1(2);
    setX2(3);
    setFx0(2);
    setFx1(5);
    setFx2(10);
    setX(2.5);
    setResult("-");
    setF01("-");
    setF12("-");
    setF012("-");
    setStatus("สถานะ: รีเซ็ตแล้ว");
  };

  const handleSaveProblem = async () => {
    try {
      const payload = {
        x0,
        x1,
        x2,
        fx0,
        fx1,
        fx2,
        x,
        method: "second_divided",
      };
      await saveProblem(payload);
      alert("บันทึกแล้ว!");
    } catch (e) {
      alert("บันทึกไม่สำเร็จ: " + (e?.message || String(e)));
    }
  };

  const handleLoadProblem = (p) => {
    setX0(p.x0);
    setX1(p.x1);
    setX2(p.x2);
    setFx0(p.fx0);
    setFx1(p.fx1);
    setFx2(p.fx2);
    setX(p.x);
  };

  const handleDeleteProblem = (p) => {
    if (confirm("ลบโจทย์นี้ไหม?")) deleteProblem(p.id);
  };

  const points = [
    { x: x0, y: fx0 },
    { x: x1, y: fx1 },
    { x: x2, y: fx2 },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <PageHeader
        title="Second Divided-Difference"
        subtitle="การประมาณค่า f(x) ด้วย Newton’s Second Divided-Difference"
      />

      <div className="grid md:grid-cols-2 gap-6">
        {/* ===== Input Section ===== */}
        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay1">
          <div className="grid grid-cols-3 gap-3 mb-3">
            {[0, 1, 2].map((i) => (
              <div key={i}>
                <label className="block text-sm text-gray-400 mb-1">
                  x{subscript(i)}
                </label>
                <input
                  type="number"
                  value={[x0, x1, x2][i]}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    if (i === 0) setX0(v);
                    else if (i === 1) setX1(v);
                    else setX2(v);
                  }}
                  className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700"
                />
                <label className="block text-sm text-gray-400 mb-1 mt-1">
                  f(x{subscript(i)})
                </label>
                <input
                  type="number"
                  value={[fx0, fx1, fx2][i]}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    if (i === 0) setFx0(v);
                    else if (i === 1) setFx1(v);
                    else setFx2(v);
                  }}
                  className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700"
                />
              </div>
            ))}
          </div>

          <div className="mb-3">
            <label className="block text-sm text-gray-400 mb-1">
              ต้องการหาค่า f(x) ที่ x =
            </label>
            <input
              type="number"
              value={x}
              onChange={(e) => setX(parseFloat(e.target.value))}
              className="w-32 px-2 py-1 rounded bg-slate-900 border border-slate-700"
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

          <div className="text-sm mb-2 text-gray-400">{status}</div>
          <SavedProblems
            problems={problems}
            onLoad={handleLoadProblem}
            onDelete={handleDeleteProblem}
            removingIds={removingIds}
          />
        </div>

        {/* ===== Output Section ===== */}
        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay2">
          <h3 className="text-gray-300 mb-2">กราฟ Second Divided-Difference</h3>
          <div className="w-full h-72 bg-slate-900 rounded">
            <GraphInterpolation
              points={points}
              xTarget={parseFloat(x)}
              method="Second Divided-Difference"
              className="w-full h-72"
            />
          </div>

          {f012 !== "-" && (
            <div className="text-sm text-gray-300 mt-3">
              <p>f[x₀, x₁] = {formatNum(f01)}</p>
              <p>f[x₁, x₂] = {formatNum(f12)}</p>
              <p>f[x₀, x₁, x₂] = {formatNum(f012)}</p>
              <p className="mt-2">
                f({x}) ≈ <b>{formatNum(result)}</b>
              </p>
            </div>
          )}
        </div>
      </div>

      {result !== "-" && (
        <div className="mt-6">
          <TableInterpolation points={points} method="Second Divided-Difference" />
        </div>
      )}

      <div className="text-sm text-gray-400 mt-6 fade-in-delay3">
        © By KaiMaiRuh
      </div>
    </div>
  );
}

function subscript(i) {
  return ["₀", "₁", "₂"][i];
}
