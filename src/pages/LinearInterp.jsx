import { useState, useEffect } from "react";
import * as LinearService from "../services/LinearService";
import useProblems from "../hooks/useProblems";
import PageHeader from "../components/PageHeader";
import SavedProblems from "../components/SavedProblems";
import { formatNum } from "../utils/math";

export default function LinearInterp() {
  const [x1, setX1] = useState("");
  const [y1, setY1] = useState("");
  const [x2, setX2] = useState("");
  const [y2, setY2] = useState("");
  const [xTarget, setXTarget] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("สถานะ: ยังไม่ได้คำนวณ");

  const { problems, removingIds, refresh, saveProblem, deleteProblem } = useProblems(LinearService);

  useEffect(() => {
    refresh().catch(console.error);
  }, [refresh]);

  // ----------- สูตร Linear Interpolation -----------
  const linearInterpolation = (x1, y1, x2, y2, x) => {
    const fx = y1 + ((y2 - y1) / (x2 - x1)) * (x - x1);
    return fx;
  };

  // ----------- Handlers -----------
  const handleRun = () => {
    try {
      const _x1 = parseFloat(x1);
      const _y1 = parseFloat(y1);
      const _x2 = parseFloat(x2);
      const _y2 = parseFloat(y2);
      const _x = parseFloat(xTarget);

      if ([_x1, _y1, _x2, _y2, _x].some(isNaN)) {
        setStatus("สถานะ: โปรดกรอกข้อมูลให้ครบและเป็นตัวเลข");
        return;
      }
      if (_x1 === _x2) {
        setStatus("สถานะ: ค่า x1 และ x2 ต้องไม่เท่ากัน");
        return;
      }

      const fx = linearInterpolation(_x1, _y1, _x2, _y2, _x);
      setResult(fx);
      setStatus("สถานะ: คำนวณเสร็จสิ้น");
    } catch (e) {
      console.error(e);
      setStatus("สถานะ: เกิดข้อผิดพลาดในการคำนวณ");
    }
  };

  const handleReset = () => {
    setX1("");
    setY1("");
    setX2("");
    setY2("");
    setXTarget("");
    setResult(null);
    setStatus("สถานะ: รีเซ็ตแล้ว");
  };

  const handleSaveProblem = async () => {
    try {
      const payload = {
        x1,
        y1,
        x2,
        y2,
        xTarget,
        expr: `Linear(${x1},${x2})`,
      };
      await saveProblem(payload);
      alert("บันทึกแล้ว!");
    } catch (e) {
      console.error("save problem failed:", e);
      alert("บันทึกไม่สำเร็จ: " + (e?.message || String(e)));
    }
  };

  const handleLoadProblem = (p) => {
    setX1(p.x1 || "");
    setY1(p.y1 || "");
    setX2(p.x2 || "");
    setY2(p.y2 || "");
    setXTarget(p.xTarget || "");
  };

  const handleDeleteProblem = (p) => {
    if (!confirm("ลบโจทย์นี้ไหม?")) return;
    deleteProblem(p.id);
  };

  // ----------- UI -----------
  return (
    <div className="max-w-6xl mx-auto p-6">
      <PageHeader title="Linear Interpolation" subtitle="คำนวณค่า f(x) โดยใช้การประมาณเชิงเส้น" />

      <div className="grid md:grid-cols-2 gap-6">
        {/* ฝั่งซ้าย: อินพุต */}
        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay1">
          <h3 className="text-gray-300 mb-3">ใส่ข้อมูล</h3>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-sm text-gray-400">x₁</label>
              <input
                type="number"
                value={x1}
                onChange={(e) => setX1(e.target.value)}
                className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">f(x₁)</label>
              <input
                type="number"
                value={y1}
                onChange={(e) => setY1(e.target.value)}
                className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">x₂</label>
              <input
                type="number"
                value={x2}
                onChange={(e) => setX2(e.target.value)}
                className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">f(x₂)</label>
              <input
                type="number"
                value={y2}
                onChange={(e) => setY2(e.target.value)}
                className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm text-gray-400 mb-1">หาค่า f(x) เมื่อ x = </label>
            <input
              type="number"
              value={xTarget}
              onChange={(e) => setXTarget(e.target.value)}
              className="w-32 px-2 py-1 rounded bg-slate-900 border border-slate-700"
            />
          </div>

          <div className="flex gap-3 mb-3">
            <button onClick={handleRun} className="flex-1 btn-primary glow-btn py-2 rounded font-semibold">คำนวณ</button>
            <button onClick={handleReset} className="flex-1 btn-danger border border-slate-600 py-2 rounded">รีเซ็ต</button>
          </div>

          <button onClick={handleSaveProblem} className="w-full btn-primary glow-btn py-2 rounded mb-3">บันทึกโจทย์</button>

          <div className="text-sm mb-2 text-gray-400">{status}</div>

          <SavedProblems problems={problems} onLoad={handleLoadProblem} onDelete={handleDeleteProblem} removingIds={removingIds} />
        </div>

        {/* ฝั่งขวา: ผลลัพธ์ */}
        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay2">
          <h3 className="text-gray-300 mb-2">ผลลัพธ์</h3>
          {result !== null ? (
            <div className="text-sm text-gray-300">
              <div>
                f({xTarget}) ≈ <b>{formatNum(result)}</b>
              </div>
              <div className="mt-3 text-gray-400">
                <div className="font-semibold text-gray-300">สูตรที่ใช้:</div>
                <code>
                  f(x) = f(x₁) + [(f(x₂) - f(x₁)) / (x₂ - x₁)] · (x - x₁)
                </code>
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
