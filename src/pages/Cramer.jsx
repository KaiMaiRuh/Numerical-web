import { useState, useEffect } from "react";
import * as CramerService from "../services/CramerService";
import useProblems from "../hooks/useProblems";
import PageHeader from "../components/PageHeader";
import SavedProblems from "../components/SavedProblems";
import { formatNum } from "../utils/math";

export default function Cramer() {
  const [size, setSize] = useState(3); // ขนาดของเมทริกซ์ n x n
  const [A, setA] = useState([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
  const [b, setB] = useState([0, 0, 0]);
  const [solution, setSolution] = useState([]);
  const [status, setStatus] = useState("สถานะ: ยังไม่ได้คำนวณ");
  const { problems, removingIds, refresh, saveProblem, deleteProblem } = useProblems(CramerService);

  useEffect(() => {
    refresh().catch(console.error);
  }, [refresh]);

  // ----------- Helper functions -----------
  const determinant = (matrix) => {
    const n = matrix.length;
    if (n === 1) return matrix[0][0];
    if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

    let det = 0;
    for (let i = 0; i < n; i++) {
      const subMatrix = matrix.slice(1).map((row) => row.filter((_, j) => j !== i));
      det += matrix[0][i] * determinant(subMatrix) * (i % 2 === 0 ? 1 : -1);
    }
    return det;
  };

  const solveCramer = (A, b) => {
    const detA = determinant(A);
    if (Math.abs(detA) < 1e-12) return { error: "Determinant = 0 (ไม่มีคำตอบหรือมีหลายคำตอบ)" };
    const n = A.length;
    const results = [];
    for (let i = 0; i < n; i++) {
      const Ai = A.map((row, r) => row.map((val, c) => (c === i ? b[r] : val)));
      results.push(determinant(Ai) / detA);
    }
    return { detA, results };
  };

  // ----------- Handlers -----------
  const handleRun = () => {
    try {
      const res = solveCramer(A, b);
      if (res.error) {
        setStatus("สถานะ: " + res.error);
        setSolution([]);
        return;
      }
      setSolution(res.results);
      setStatus("สถานะ: เสร็จสิ้น (detA = " + formatNum(res.detA) + ")");
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
      // Firestore disallows nested arrays (arrays of arrays). Serialize matrix/vector as JSON strings.
      const payload = {
        A: JSON.stringify(A),
        b: JSON.stringify(b),
        size,
        // provide a short label so SavedProblems shows something meaningful
        expr: `Matrix ${size}x${size}`,
      };
      console.log("Cramer: saving problem (serialized)", payload);
      await saveProblem(payload);
      alert("บันทึกแล้ว!");
    } catch (e) {
      console.error("save problem failed:", e);
      // show more detailed error to user so debugging is easier
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

  // ----------- UI -----------
  return (
    <div className="max-w-6xl mx-auto p-6">
      <PageHeader title="Cramer's Rule" subtitle="หาคำตอบระบบสมการเชิงเส้นโดยใช้ Determinant" />

      <div className="grid md:grid-cols-2 gap-6">
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

          <div className="flex gap-3 mb-3">
            <button onClick={handleRun} className="flex-1 btn-primary glow-btn py-2 rounded font-semibold">คำนวณ</button>
            <button onClick={handleReset} className="flex-1 btn-danger border border-slate-600 py-2 rounded">รีเซ็ต</button>
          </div>

          <button onClick={handleSaveProblem} className="w-full btn-primary glow-btn py-2 rounded mb-3">บันทึกโจทย์</button>

          <div className="text-sm mb-2">
            <div>{status}</div>
          </div>

          <SavedProblems problems={problems} onLoad={handleLoadProblem} onDelete={handleDeleteProblem} removingIds={removingIds} />
        </div>

        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay2">
          <h3 className="text-gray-300 mb-2">ข้อมูล</h3>
          <div className="text-sm text-gray-400">
            ใส่เมทริกซ์ A และเวกเตอร์ b แล้วกด "คำนวณ" โปรแกรมจะคำนวณโดยใช้ Cramer's Rule
            หาก det(A) = 0 จะถือว่าไม่มีคำตอบหรือมีคำตอบไม่เป็นเอกเทศ
          </div>

          {/* Show determinant and solution preview */}
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
