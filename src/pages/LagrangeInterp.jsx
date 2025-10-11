import { useState, useEffect } from "react";
import * as LagrangeService from "../services/LagrangeService";
import useProblems from "../hooks/useProblems";
import PageHeader from "../components/PageHeader";
import SavedProblems from "../components/SavedProblems";
import { formatNum } from "../utils/math";

export default function LagrangeInterp() {
  const [xValues, setXValues] = useState(["", "", ""]);
  const [yValues, setYValues] = useState(["", "", ""]);
  const [xTarget, setXTarget] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("สถานะ: ยังไม่ได้คำนวณ");
  const [steps, setSteps] = useState([]);

  const { problems, removingIds, refresh, saveProblem, deleteProblem } = useProblems(LagrangeService);

  useEffect(() => {
    refresh().catch(console.error);
  }, [refresh]);

  // ----------- สูตร Lagrange Interpolation -----------
  const lagrange = (xs, ys, x) => {
    const n = xs.length;
    let fx = 0;
    let detail = [];

    for (let i = 0; i < n; i++) {
      let Li = 1;
      let LiStr = `L${i}(x) = `;
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          Li *= (x - xs[j]) / (xs[i] - xs[j]);
          LiStr += `((x - ${xs[j]})/(${xs[i]} - ${xs[j]})) `;
        }
      }
      const term = ys[i] * Li;
      fx += term;
      detail.push({ i, Li, term, LiStr });
    }
    return { fx, detail };
  };

  // ----------- Handlers -----------
  const handleRun = () => {
    try {
      const xs = xValues.map((v) => parseFloat(v));
      const ys = yValues.map((v) => parseFloat(v));
      const x = parseFloat(xTarget);

      if (xs.some(isNaN) || ys.some(isNaN) || isNaN(x)) {
        setStatus("สถานะ: โปรดกรอกข้อมูลให้ครบและเป็นตัวเลข");
        return;
      }
      if (xs.length !== ys.length) {
        setStatus("สถานะ: จำนวนค่า x และ y ต้องเท่ากัน");
        return;
      }

      const { fx, detail } = lagrange(xs, ys, x);
      setResult(fx);
      setSteps(detail);
      setStatus("สถานะ: คำนวณเสร็จสิ้น");
    } catch (e) {
      console.error(e);
      setStatus("สถานะ: เกิดข้อผิดพลาดในการคำนวณ");
    }
  };

  const handleReset = () => {
    setXValues(["", "", ""]);
    setYValues(["", "", ""]);
    setXTarget("");
    setResult(null);
    setSteps([]);
    setStatus("สถานะ: รีเซ็ตแล้ว");
  };

  const handleSaveProblem = async () => {
    try {
      const payload = {
        xValues: JSON.stringify(xValues),
        yValues: JSON.stringify(yValues),
        xTarget,
        expr: `Lagrange(${xValues.join(",")})`,
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
      const parsedX = typeof p.xValues === "string" ? JSON.parse(p.xValues) : p.xValues || [];
      const parsedY = typeof p.yValues === "string" ? JSON.parse(p.yValues) : p.yValues || [];
      setXValues(parsedX);
      setYValues(parsedY);
      setXTarget(p.xTarget || "");
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
      <PageHeader title="Lagrange Interpolation" subtitle="หาค่า f(x) โดยใช้ลากร็องจ์อินเตอร์โพเลชัน" />

      <div className="grid md:grid-cols-2 gap-6">
        {/* ฝั่งซ้าย: อินพุต */}
        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay1">
          <label className="block text-sm text-gray-400 mb-1">จำนวนจุดข้อมูล</label>
          <input
            type="number"
            value={xValues.length}
            onChange={(e) => {
              const n = Math.max(2, parseInt(e.target.value) || 2);
              setXValues(Array(n).fill(""));
              setYValues(Array(n).fill(""));
            }}
            className="w-24 px-3 py-2 rounded bg-slate-900 border border-slate-700 mb-3"
          />

          <div className="overflow-x-auto mb-3">
            <label className="block text-sm text-gray-400 mb-1">ค่าของ x และ f(x)</label>
            <table className="text-sm border-collapse">
              <thead>
                <tr className="text-gray-400">
                  <th className="p-1">xᵢ</th>
                  <th className="p-1">f(xᵢ)</th>
                </tr>
              </thead>
              <tbody>
                {xValues.map((_, i) => (
                  <tr key={i}>
                    <td className="p-1">
                      <input
                        type="number"
                        value={xValues[i]}
                        onChange={(e) => {
                          const newX = [...xValues];
                          newX[i] = e.target.value;
                          setXValues(newX);
                        }}
                        className="w-20 px-2 py-1 rounded bg-slate-900 border border-slate-700"
                      />
                    </td>
                    <td className="p-1">
                      <input
                        type="number"
                        value={yValues[i]}
                        onChange={(e) => {
                          const newY = [...yValues];
                          newY[i] = e.target.value;
                          setYValues(newY);
                        }}
                        className="w-20 px-2 py-1 rounded bg-slate-900 border border-slate-700"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <label className="block text-sm text-gray-400 mb-1">
            ต้องการหาค่า f(x) ที่ x =
          </label>
          <input
            type="number"
            value={xTarget}
            onChange={(e) => setXTarget(e.target.value)}
            className="w-32 px-2 py-1 rounded bg-slate-900 border border-slate-700 mb-3"
          />

          <div className="flex gap-3 mb-3">
            <button onClick={handleRun} className="flex-1 btn-primary glow-btn py-2 rounded font-semibold">คำนวณ</button>
            <button onClick={handleReset} className="flex-1 btn-danger border border-slate-600 py-2 rounded">รีเซ็ต</button>
          </div>

          <button onClick={handleSaveProblem} className="w-full btn-primary glow-btn py-2 rounded mb-3">บันทึกโจทย์</button>

          <div className="text-sm mb-2 text-gray-400">{status}</div>

          <SavedProblems problems={problems} onLoad={handleLoadProblem} onDelete={handleDeleteProblem} removingIds={removingIds} />
        </div>

        {/* ฝั่งขวา: แสดงผล */}
        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay2">
          <h3 className="text-gray-300 mb-2">ผลลัพธ์</h3>
          {result !== null ? (
            <div className="text-sm text-gray-300">
              <div>f({xTarget}) ≈ <b>{formatNum(result)}</b></div>
              <div className="mt-3 text-gray-400">
                <div className="mb-1 font-semibold text-gray-300">ขั้นตอนการคำนวณ:</div>
                {steps.map((s) => (
                  <div key={s.i} className="mb-1">
                    L{s.i}(x): {s.Li.toFixed(6)} → y{s.i}·L{s.i}(x) = {s.term.toFixed(6)}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-400">ยังไม่มีการคำนวณ</div>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-400 mt-6 fade-in-delay3">© By KaiMaiRuh</div>
    </div>
  );
}
