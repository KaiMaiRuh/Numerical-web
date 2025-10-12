// src/pages/GaussJordan.jsx
import { useState, useEffect } from "react";
import * as GaussJordanService from "../services/GaussJordanService";
import useProblems from "../hooks/useProblems";
import PageHeader from "../components/PageHeader";
import SavedProblems from "../components/SavedProblems";
import { formatNum } from "../utils/math";
import gaussJordan from "../algorithms/gaussJordan";
import GraphLinearSystem from "../components/graphs/GraphLinearSystem";
import TableLinearSystem from "../components/tables/TableLinearSystem";

export default function GaussJordan() {
  const [size, setSize] = useState(3);
  const [A, setA] = useState([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);
  const [b, setB] = useState([0, 0, 0]);
  const [solution, setSolution] = useState([]);
  const [iterationsState, setIterationsState] = useState([]);
  const [status, setStatus] = useState("สถานะ: ยังไม่ได้คำนวณ");

  const { problems, removingIds, refresh, saveProblem, deleteProblem } =
    useProblems(GaussJordanService);

  useEffect(() => {
    refresh().catch(console.error);
  }, [refresh]);

  const handleRun = () => {
    try {
      const res = gaussJordan(A, b);
      if (res.error) {
        setStatus("สถานะ: " + res.error);
        setSolution([]);
        setIterationsState([]);
        return;
      }
      setSolution(res.solution);
      setIterationsState(res.iterations ?? []);
      setStatus("สถานะ: เสร็จสิ้น (Reduced Row-Echelon Form สำเร็จ)");
    } catch (e) {
      console.error(e);
      setStatus("สถานะ: เกิดข้อผิดพลาดในการคำนวณ");
    }
  };

  const handleReset = () => {
    setA(Array(size).fill().map(() => Array(size).fill(0)));
    setB(Array(size).fill(0));
    setSolution([]);
    setStatus("สถานะ: รีเซ็ตแล้ว");
  };

  const handleSaveProblem = async () => {
    try {
      const payload = {
        A: JSON.stringify(A),
        b: JSON.stringify(b),
        size,
        expr: `Matrix ${size}x${size}`,
        method: "gauss_jordan",
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
      const parsedA = typeof p.A === "string" ? JSON.parse(p.A) : p.A || [];
      const parsedB = typeof p.b === "string" ? JSON.parse(p.b) : p.b || [];
      setA(parsedA);
      setB(parsedB);
      if (parsedA && Array.isArray(parsedA)) setSize(parsedA.length);
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
        title="Gauss–Jordan Elimination"
        subtitle="วิธีการกำจัดแบบเกาส์–จอร์แดน (Reduced Row-Echelon Form)"
      />

      <div className="grid md:grid-cols-2 gap-6">
        {/* ===== Input Section ===== */}
        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay1">
          <label className="block text-sm text-gray-400 mb-1">
            ขนาดเมทริกซ์ (n × n)
          </label>
          <input
            type="number"
            value={size}
            onChange={(e) => {
              const n = Math.max(1, parseInt(e.target.value) || 1);
              setSize(n);
              setA(Array(n).fill().map(() => Array(n).fill(0)));
              setB(Array(n).fill(0));
            }}
            className="w-24 px-3 py-2 rounded bg-slate-900 border border-slate-700 mb-3"
          />

          {/* Matrix A */}
          <div className="overflow-x-auto mb-3">
            <label className="block text-sm text-gray-400 mb-1">Matrix A</label>
            <table className="text-sm border-collapse">
              <tbody>
                {A.map((row, i) => (
                  <tr key={i}>
                    {row.map((val, j) => (
                      <td key={j} className="p-1">
                        <input
                          type="number"
                          value={val}
                          onChange={(e) => {
                            const newA = A.map((r) => [...r]);
                            newA[i][j] = parseFloat(e.target.value) || 0;
                            setA(newA);
                          }}
                          className="w-16 px-2 py-1 rounded bg-slate-900 border border-slate-700"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vector b */}
          <div className="mb-3">
            <label className="block text-sm text-gray-400 mb-1">Vector b</label>
            <div className="flex gap-2">
              {b.map((val, i) => (
                <input
                  key={i}
                  type="number"
                  value={val}
                  onChange={(e) => {
                    const newB = [...b];
                    newB[i] = parseFloat(e.target.value) || 0;
                    setB(newB);
                  }}
                  className="w-16 px-2 py-1 rounded bg-slate-900 border border-slate-700"
                />
              ))}
            </div>
          </div>

          {/* Buttons */}
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
          <label className="block text-sm text-gray-400 mb-2">
            การลู่เข้าสู่ผลลัพธ์ (Visualization)
          </label>
          <div className="w-full h-72 bg-slate-900 rounded">
            <GraphLinearSystem
              A={A}
              b={b}
              solution={solution}
              method="Gauss-Jordan"
              className="w-full h-72"
            />
          </div>

          {solution.length > 0 && (
            <div className="mt-4 text-sm text-gray-300">
              <div className="mb-2">ผลลัพธ์ (x):</div>
              <ul>
                {solution.map((x, i) => (
                  <li key={i}>
                    x{i + 1} = {formatNum(x)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* ===== Results Table ===== */}
      {solution.length > 0 && (
        <div className="mt-6">
          <TableLinearSystem A={A} b={b} solution={solution} iterations={iterationsState} />
        </div>
      )}

      <div className="text-sm text-gray-400 mt-6 fade-in-delay3">
        © By KaiMaiRuh
      </div>
    </div>
  );
}
