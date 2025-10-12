import { useState, useEffect } from "react";
import * as NonlinearRegService from "../services/NonlinearRegService";
import useProblems from "../hooks/useProblems";
import PageHeader from "../components/PageHeader";
import SavedProblems from "../components/SavedProblems";
import { formatNum } from "../utils/math";
import solveNonlinearRegression from "../algorithms/nonlinearReg";

export default function NonlinearReg() {
  const [xValues, setXValues] = useState([1, 2, 3, 4, 5]);
  const [yValues, setYValues] = useState([2.7, 7.4, 20.1, 54.6, 148.4]);
  const [model, setModel] = useState("exponential"); // exponential หรือ power
  const [params, setParams] = useState(null);
  const [status, setStatus] = useState("สถานะ: ยังไม่ได้คำนวณ");

  const { problems, removingIds, refresh, saveProblem, deleteProblem } =
    useProblems(NonlinearRegService);

  useEffect(() => {
    refresh().catch(console.error);
  }, [refresh]);

  // Algorithm moved to src/algorithms/nonlinearReg.js

  // ---------------- Handlers ----------------

  const handleRun = () => {
    try {
      const res = solveNonlinearRegression(xValues, yValues, model);
      setParams(res);
      setStatus("สถานะ: คำนวณเสร็จสิ้น");
    } catch (err) {
      console.error(err);
      setParams(null);
      setStatus("สถานะ: เกิดข้อผิดพลาดในการคำนวณ");
    }
  };

  const handleReset = () => {
    setXValues([1, 2, 3, 4, 5]);
    setYValues([2.7, 7.4, 20.1, 54.6, 148.4]);
    setModel("exponential");
    setParams(null);
    setStatus("สถานะ: รีเซ็ตแล้ว");
  };

  const handleSaveProblem = async () => {
    try {
      const payload = {
        x: JSON.stringify(xValues),
        y: JSON.stringify(yValues),
        model,
        expr: `Nonlinear Regression (${model})`,
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
      setModel(p.model || "exponential");
    } catch (err) {
      alert("ไม่สามารถโหลดโจทย์ได้");
    }
  };

  const handleDeleteProblem = (p) => {
    if (confirm("ลบโจทย์นี้ไหม?")) deleteProblem(p.id);
  };

  // ---------------- UI ----------------
  return (
    <div className="max-w-6xl mx-auto p-6">
      <PageHeader
        title="Nonlinear Regression"
        subtitle="การประมาณค่าแบบไม่เชิงเส้น (Exponential / Power Model)"
      />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay1">
          <label className="block text-sm text-gray-400 mb-1">เลือกโมเดล</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full mb-3 px-2 py-1 rounded bg-slate-900 border border-slate-700"
          >
            <option value="exponential">Exponential (y = a·e^(b·x))</option>
            <option value="power">Power (y = a·x^b)</option>
          </select>

          <label className="block text-sm text-gray-400 mb-1">ค่า x</label>
          <textarea
            value={xValues.join(", ")}
            onChange={(e) =>
              setXValues(
                e.target.value.split(",").map((v) => parseFloat(v.trim()) || 0)
              )
            }
            className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 mb-3 text-sm"
          />

          <label className="block text-sm text-gray-400 mb-1">ค่า y</label>
          <textarea
            value={yValues.join(", ")}
            onChange={(e) =>
              setYValues(
                e.target.value.split(",").map((v) => parseFloat(v.trim()) || 0)
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
          <h3 className="text-gray-300 mb-2">ผลลัพธ์</h3>
          <div className="text-sm text-gray-400">
            โมเดลนี้จะประมาณค่าพารามิเตอร์ a และ b
            โดยใช้การแปลงลอการิทึมเพื่อลดรูปเป็นเชิงเส้น
          </div>

          {params && (
            <div className="mt-4 text-sm text-gray-300">
              <div className="mb-2">สมการที่ได้:</div>
              {model === "exponential" ? (
                <div>
                  y = {formatNum(params.a)} · e^({formatNum(params.b)}x)
                </div>
              ) : (
                <div>
                  y = {formatNum(params.a)} · x^{formatNum(params.b)}
                </div>
              )}
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
