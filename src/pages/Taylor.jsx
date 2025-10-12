import { useState, useEffect } from "react";
import * as TaylorService from "../services/TaylorService";
import useProblems from "../hooks/useProblems";
import PageHeader from "../components/PageHeader";
import SavedProblems from "../components/SavedProblems";
import taylorApprox from "../algorithms/taylor";
import { formatNum } from "../utils/math";

export default function Taylor() {
  const [expr, setExpr] = useState("e^x");
  const [x0, setX0] = useState(0);
  const [x, setX] = useState(1);
  const [n, setN] = useState(3);
  const [result, setResult] = useState("-");
  const [status, setStatus] = useState("สถานะ: ยังไม่ได้คำนวณ");
  const [terms, setTerms] = useState([]);

  const { problems, removingIds, refresh, saveProblem, deleteProblem } =
    useProblems(TaylorService);

  useEffect(() => {
    refresh().catch(console.error);
  }, [refresh]);

  // ----------- Calculation -----------

  // ----------- Handlers -----------
  const handleRun = () => {
    try {
      const { result, terms } = taylorApprox(expr, x0, x, n);
      setResult(result);
      setTerms(terms);
      setStatus("สถานะ: คำนวณสำเร็จ");
    } catch (err) {
      console.error(err);
      setStatus("สถานะ: เกิดข้อผิดพลาดในการคำนวณ");
      setResult("-");
      setTerms([]);
    }
  };

  const handleReset = () => {
    setExpr("e^x");
    setX0(0);
    setX(1);
    setN(3);
    setResult("-");
    setStatus("สถานะ: รีเซ็ตแล้ว");
    setTerms([]);
  };

  const handleSaveProblem = async () => {
    try {
      const payload = { expr, x0, x, n, method: "taylor" };
      await saveProblem(payload);
      alert("บันทึกแล้ว!");
    } catch (e) {
      alert("บันทึกไม่สำเร็จ: " + (e?.message || String(e)));
    }
  };

  const handleLoadProblem = (p) => {
    setExpr(p.expr);
    setX0(p.x0);
    setX(p.x);
    setN(p.n);
  };

  const handleDeleteProblem = (p) => {
    if (confirm("ลบโจทย์นี้ไหม?")) deleteProblem(p.id);
  };

  // ----------- UI -----------
  return (
    <div className="max-w-6xl mx-auto p-6">
      <PageHeader
        title="Taylor Series Approximation"
        subtitle="การประมาณค่า f(x) ด้วยอนุพันธ์หลายลำดับ (Taylor Series)"
      />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay1">
          <label className="block text-sm text-gray-400 mb-1">ฟังก์ชัน f(x)</label>
          <input
            type="text"
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            placeholder="เช่น e^x, sin(x), x^3 + 2x"
            className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 mb-3"
          />

          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">x₀</label>
              <input
                type="number"
                value={x0}
                onChange={(e) => setX0(parseFloat(e.target.value))}
                className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">x</label>
              <input
                type="number"
                value={x}
                onChange={(e) => setX(parseFloat(e.target.value))}
                className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">จำนวนเทอม (n)</label>
              <input
                type="number"
                value={n}
                onChange={(e) => setN(parseInt(e.target.value) || 1)}
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
            ใช้สูตร Taylor Series:
            <br />
            f(x) ≈ f(x₀) + f'(x₀)(x−x₀) + f''(x₀)(x−x₀)²/2! + …
          </div>

          {terms.length > 0 && (
            <div className="overflow-x-auto mb-3 text-sm text-gray-300">
              <table className="min-w-full border border-slate-700">
                <thead>
                  <tr className="bg-slate-700">
                    <th className="px-2 py-1 border border-slate-600">ลำดับ</th>
                    <th className="px-2 py-1 border border-slate-600">f⁽ⁱ⁾(x₀)</th>
                    <th className="px-2 py-1 border border-slate-600">เทอมที่ i</th>
                  </tr>
                </thead>
                <tbody>
                  {terms.map((t) => (
                    <tr key={t.i}>
                      <td className="px-2 py-1 border border-slate-700 text-center">{t.i}</td>
                      <td className="px-2 py-1 border border-slate-700">{formatNum(t.fx0)}</td>
                      <td className="px-2 py-1 border border-slate-700">{formatNum(t.term)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {result !== "-" && (
            <div className="text-sm text-gray-300">
              <p>
                f({x}) ≈ <b>{formatNum(result)}</b>
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-400 mt-6 fade-in-delay3">© By KaiMaiRuh</div>
    </div>
  );
}
