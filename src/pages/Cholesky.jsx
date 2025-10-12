import { useState, useEffect } from "react";
import * as CholeskyService from "../services/CholeskyService";
import useProblems from "../hooks/useProblems";
import PageHeader from "../components/PageHeader";
import SavedProblems from "../components/SavedProblems";
import { formatNum } from "../utils/math";
import choleskyDecomposition from "../algorithms/cholesky";

export default function Cholesky() {
  const [size, setSize] = useState(3);
  const [A, setA] = useState([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
  const [b, setB] = useState([0, 0, 0]);
  const [solution, setSolution] = useState([]);
  const [status, setStatus] = useState("สถานะ: ยังไม่ได้คำนวณ");
  const { problems, removingIds, refresh, saveProblem, deleteProblem } = useProblems(CholeskyService);

  useEffect(() => {
    refresh().catch(console.error);
  }, [refresh]);

  // algorithm moved to src/algorithms/cholesky.js

  // ---------- Handlers ----------
  const handleRun = () => {
    try {
      const res = choleskyDecomposition(A, b);
      if (res.error) {
        setStatus("สถานะ: " + res.error);
        setSolution([]);
        return;
      }
      setSolution(res.solution);
      setStatus("สถานะ: เสร็จสิ้น (Cholesky Decomposition สำเร็จ)");
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
      };
      console.log("Cholesky: saving problem (serialized)", payload);
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

  // ---------- UI ----------
  return (
    <div className="max-w-6xl mx-auto p-6">
      <PageHeader title="Cholesky Decomposition Method" subtitle="การแยกเมทริกซ์สมมาตรบวกกำหนดแน่นอน A = L·Lᵀ" />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: Input */}
        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay1">
          <label className="block text-sm text-gray-400 mb-1">ขนาดเมทริกซ์ (n x n)</label>
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
            <button onClick={handleRun} className="flex-1 btn-primary glow-btn py-2 rounded font-semibold">
              คำนวณ
            </button>
            <button onClick={handleReset} className="flex-1 btn-danger border border-slate-600 py-2 rounded">
              รีเซ็ต
            </button>
          </div>

          <button onClick={handleSaveProblem} className="w-full btn-primary glow-btn py-2 rounded mb-3">
            บันทึกโจทย์
          </button>

          <div className="text-sm mb-2"><div>{status}</div></div>

          <SavedProblems
            problems={problems}
            onLoad={handleLoadProblem}
            onDelete={handleDeleteProblem}
            removingIds={removingIds}
          />
        </div>

        {/* Right: Info */}
        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay2">
          <h3 className="text-gray-300 mb-2">ข้อมูล</h3>
          <div className="text-sm text-gray-400">
            วิธี Cholesky Decomposition ใช้สำหรับเมทริกซ์สมมาตรบวกกำหนดแน่นอน โดยแยก A = L·Lᵀ 
            จากนั้นแก้สมการ L·y = b และ Lᵀ·x = y เพื่อหาคำตอบของตัวแปร x₁, x₂, ..., xₙ
          </div>

          {solution.length > 0 && (
            <div className="mt-4 text-sm text-gray-300">
              <div className="mb-2">ผลลัพธ์ (x):</div>
              <ul>
                {solution.map((x, i) => (
                  <li key={i}>x{i + 1} = {formatNum(x)}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-400 mt-6 fade-in-delay3">© By KaiMaiRuh</div>
    </div>
  );
}
