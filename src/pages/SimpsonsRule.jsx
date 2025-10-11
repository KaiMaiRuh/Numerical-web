import { useState, useEffect } from "react";
import * as SimpsonsService from "../services/SimpsonsService";
import useProblems from "../hooks/useProblems";
import PageHeader from "../components/PageHeader";
import SavedProblems from "../components/SavedProblems";
import { evaluate } from "mathjs";
import { formatNum } from "../utils/math";

export default function SimpsonsRule() {
  const [expr, setExpr] = useState("x^2 + 1");
  const [a, setA] = useState(0);
  const [b, setB] = useState(2);
  const [n, setN] = useState(4); // ต้องเป็นเลขคู่
  const [result, setResult] = useState("-");
  const [status, setStatus] = useState("สถานะ: ยังไม่ได้คำนวณ");
  const [table, setTable] = useState([]);

  const { problems, removingIds, refresh, saveProblem, deleteProblem } =
    useProblems(SimpsonsService);

  useEffect(() => {
    refresh().catch(console.error);
  }, [refresh]);

  // ---------------- Calculation ----------------
  const f = (x) => {
    try {
      return evaluate(expr, { x });
    } catch {
      throw new Error("ไม่สามารถประเมินสมการได้");
    }
  };

  const simpsonsRule = (a, b, n, f) => {
    if (n % 2 !== 0) throw new Error("n ต้องเป็นจำนวนคู่เท่านั้น");

    const h = (b - a) / n;
    let sum = f(a) + f(b);
    const rows = [{ i: 0, x: a, fx: f(a) }];

    for (let i = 1; i < n; i++) {
      const xi = a + i * h;
      const fx = f(xi);
      sum += i % 2 === 0 ? 2 * fx : 4 * fx;
      rows.push({ i, x: xi, fx });
    }

    rows.push({ i: n, x: b, fx: f(b) });
    const I = (h / 3) * sum;
    return { I, h, rows };
  };

  // ---------------- Handlers ----------------
  const handleRun = () => {
    try {
      const { I, h, rows } = simpsonsRule(a, b, n, f);
      setResult(I);
      setTable(rows);
      setStatus(`สถานะ: คำนวณสำเร็จ (h = ${formatNum(h)})`);
    } catch (err) {
      console.error(err);
      setResult("-");
      setStatus("สถานะ: " + (err.message || "เกิดข้อผิดพลาดในการคำนวณ"));
      setTable([]);
    }
  };

  const handleReset = () => {
    setExpr("x^2 + 1");
    setA(0);
    setB(2);
    setN(4);
    setResult("-");
    setStatus("สถานะ: รีเซ็ตแล้ว");
    setTable([]);
  };

  const handleSaveProblem = async () => {
    try {
      const payload = { expr, a, b, n, method: "simpson" };
      await saveProblem(payload);
      alert("บันทึกแล้ว!");
    } catch (e) {
      alert("บันทึกไม่สำเร็จ: " + (e?.message || String(e)));
    }
  };

  const handleLoadProblem = (p) => {
    setExpr(p.expr);
    setA(p.a);
    setB(p.b);
    setN(p.n);
  };

  const handleDeleteProblem = (p) => {
    if (confirm("ลบโจทย์นี้ไหม?")) deleteProblem(p.id);
  };

  // ---------------- UI ----------------
  return (
    <div className="max-w-6xl mx-auto p-6">
      <PageHeader
        title="Simpson's Rule (1/3)"
        subtitle="การอินทิเกรตเชิงตัวเลขด้วย Simpson’s Composite Rule"
      />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay1">
          <label className="block text-sm text-gray-400 mb-1">
            ฟังก์ชัน f(x)
          </label>
          <input
            type="text"
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 mb-3"
            placeholder="กรอกสมการ เช่น x^2 + 1"
          />

          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">a</label>
              <input
                type="number"
                value={a}
                onChange={(e) => setA(parseFloat(e.target.value))}
                className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">b</label>
              <input
                type="number"
                value={b}
                onChange={(e) => setB(parseFloat(e.target.value))}
                className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">n (คู่)</label>
              <input
                type="number"
                value={n}
                onChange={(e) =>
                  setN(Math.max(2, parseInt(e.target.value) || 2))
                }
                className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700"
              />
            </div>
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

        {/* Output Section */}
        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay2">
          <h3 className="text-gray-300 mb-2">ผลลัพธ์</h3>
          <div className="text-sm text-gray-400 mb-3">
            ใช้สูตร Simpson’s 1/3 Rule:
            <br />
            I = (h / 3) [f(x₀) + 4∑f(xᵢ_คี่) + 2∑f(xᵢ_คู่) + f(xₙ)]
          </div>

          {table.length > 0 && (
            <div className="overflow-x-auto mb-3 text-sm text-gray-300">
              <table className="min-w-full border border-slate-700">
                <thead>
                  <tr className="bg-slate-700">
                    <th className="px-2 py-1 border border-slate-600">i</th>
                    <th className="px-2 py-1 border border-slate-600">xᵢ</th>
                    <th className="px-2 py-1 border border-slate-600">f(xᵢ)</th>
                    <th className="px-2 py-1 border border-slate-600">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {table.map((row) => (
                    <tr key={row.i}>
                      <td className="px-2 py-1 border border-slate-700">
                        {row.i}
                      </td>
                      <td className="px-2 py-1 border border-slate-700">
                        {formatNum(row.x)}
                      </td>
                      <td className="px-2 py-1 border border-slate-700">
                        {formatNum(row.fx)}
                      </td>
                      <td className="px-2 py-1 border border-slate-700 text-center">
                        {row.i === 0 || row.i === table.length - 1
                          ? "1"
                          : row.i % 2 === 0
                          ? "2"
                          : "4"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {result !== "-" && (
            <div className="text-sm text-gray-300">
              <p>ค่าประมาณของ I ≈ <b>{formatNum(result)}</b></p>
            </div>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-400 mt-6 fade-in-delay3">
        © By KaiMaiRuh
      </div>
    </div>
  );
}
