import { useState, useEffect } from "react";
import * as PolynomialRegService from "../services/PolynomialRegService";
import useProblems from "../hooks/useProblems";
import PageHeader from "../components/PageHeader";
import SavedProblems from "../components/SavedProblems";
import { formatNum } from "../utils/math";
import solvePolynomialRegression from "../algorithms/polynomialReg";

export default function PolynomialReg() {
  const [xValues, setXValues] = useState([1, 2, 3, 4]);
  const [yValues, setYValues] = useState([2.2, 2.8, 3.6, 4.5]);
  const [degree, setDegree] = useState(2); // ลำดับของพหุนาม
  const [coeffs, setCoeffs] = useState([]);
  const [status, setStatus] = useState("สถานะ: ยังไม่ได้คำนวณ");

  const { problems, removingIds, refresh, saveProblem, deleteProblem } =
    useProblems(PolynomialRegService);

  useEffect(() => {
    refresh().catch(console.error);
  }, [refresh]);

  // Algorithm moved to src/algorithms/polynomialReg.js

  // ----------- Handlers -----------

  const handleRun = () => {
    try {
      const coeff = solvePolynomialRegression(xValues, yValues, degree);
      setCoeffs(coeff);
      setStatus("สถานะ: คำนวณเสร็จสิ้น");
    } catch (e) {
      console.error(e);
      setStatus("สถานะ: เกิดข้อผิดพลาดในการคำนวณ");
      setCoeffs([]);
    }
  };

  const handleReset = () => {
    setXValues([1, 2, 3, 4]);
    setYValues([2.2, 2.8, 3.6, 4.5]);
    setDegree(2);
    setCoeffs([]);
    setStatus("สถานะ: รีเซ็ตแล้ว");
  };

  const handleSaveProblem = async () => {
    try {
      const payload = {
        x: JSON.stringify(xValues),
        y: JSON.stringify(yValues),
        degree,
        expr: `Polynomial Regression (deg=${degree})`,
      };
      await saveProblem(payload);
      alert("บันทึกแล้ว!");
    } catch (e) {
      alert("บันทึกไม่สำเร็จ: " + (e?.message || String(e)));
    }
  };

  const handleLoadProblem = (p) => {
    try {
      setXValues(JSON.parse(p.x));
      setYValues(JSON.parse(p.y));
      setDegree(p.degree);
    } catch (e) {
      alert("ไม่สามารถโหลดโจทย์: ข้อมูลไม่ถูกต้อง");
    }
  };

  const handleDeleteProblem = (p) => {
    if (confirm("ลบโจทย์นี้ไหม?")) deleteProblem(p.id);
  };

  // ----------- UI -----------
  return (
    <div className="max-w-6xl mx-auto p-6">
      <PageHeader
        title="Polynomial Regression"
        subtitle="ประมาณค่าเชิงเส้นแบบพหุนาม (Polynomial Least Squares)"
      />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay1">
          <label className="block text-sm text-gray-400 mb-1">ลำดับพหุนาม</label>
          <input
            type="number"
            value={degree}
            onChange={(e) =>
              setDegree(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-24 px-3 py-2 rounded bg-slate-900 border border-slate-700 mb-3"
          />

          <label className="block text-sm text-gray-400 mb-1">ค่า x</label>
          <textarea
            value={xValues.join(", ")}
            onChange={(e) =>
              setXValues(
                e.target.value
                  .split(",")
                  .map((v) => parseFloat(v.trim()) || 0)
              )
            }
            className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 mb-3 text-sm"
          />

          <label className="block text-sm text-gray-400 mb-1">ค่า y</label>
          <textarea
            value={yValues.join(", ")}
            onChange={(e) =>
              setYValues(
                e.target.value
                  .split(",")
                  .map((v) => parseFloat(v.trim()) || 0)
              )
            }
            className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 mb-3 text-sm"
          />

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
          <h3 className="text-gray-300 mb-2">ข้อมูล</h3>
          <div className="text-sm text-gray-400">
            Polynomial Regression ใช้ประมาณค่าแนวโค้งเชิงเส้นลำดับ
            <b> m </b> ที่สอดคล้องกับข้อมูล (x, y)
            โดยหาค่าสัมประสิทธิ์จากสมการ Normal Equation
          </div>

          {coeffs.length > 0 && (
            <div className="mt-4 text-sm text-gray-300">
              <div className="mb-2">สมการพหุนาม:</div>
              <div>
                y ={" "}
                {coeffs
                  .map(
                    (a, i) =>
                      `${formatNum(a)}${i === 0 ? "" : `x^${i}`}`
                  )
                  .join(" + ")}
              </div>
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
