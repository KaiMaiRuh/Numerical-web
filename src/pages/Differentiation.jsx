import { useState, useMemo, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { makeFunc, formatNum } from "../utils/math";
import { differentiate } from "../algorithms/differentiation";
import useProblems from "../hooks/useProblems";
import SavedProblems from "../components/SavedProblems";
import * as DifferentiationService from "../services/DifferentiationService";

const ORDER_OPTIONS = [
  { value: "", label: "-" },
  { value: "1", label: "First" },
  { value: "2", label: "Second" },
];

const ERROR_OPTIONS = [
  { value: "", label: "-" },
  { value: "O(h)", label: "O(h)" },
  { value: "O(h^2)", label: "O(h^2)" },
  { value: "O(h^4)", label: "O(h^4)" },
];

const DIRECTION_OPTIONS = [
  { value: "", label: "-" },
  { value: "forward", label: "Forward" },
  { value: "backward", label: "Backward" },
  { value: "centered", label: "Centered" },
];

export default function Differentiation() {
  const [order, setOrder] = useState("");
  const [accuracy, setAccuracy] = useState("");
  const [direction, setDirection] = useState("");
  const [expr, setExpr] = useState("");
  const [x, setX] = useState("");
  const [h, setH] = useState("");

  const [result, setResult] = useState(null);
  const [trueVal, setTrueVal] = useState(null);
  const [errorPct, setErrorPct] = useState(null);
  const [status, setStatus] = useState("สถานะ: ยังไม่ได้คำนวณ");

  const func = useMemo(() => makeFunc(expr), [expr]);

  // Saved problems integration
  const { problems, removingIds, refresh, saveProblem, deleteProblem } = useProblems(DifferentiationService);
  useEffect(() => { refresh().catch(console.error); }, [refresh]);

  const calc = () => {
    if (!func) {
      setStatus("สถานะ: สมการไม่ถูกต้อง");
      return;
    }

    const xi = parseFloat(x);
    const hi = parseFloat(h);
    if (!Number.isFinite(xi) || !Number.isFinite(hi) || hi <= 0) {
      setStatus("สถานะ: x/h ไม่ถูกต้อง");
      return;
    }
    if (!order || !accuracy || !direction) {
      setStatus("สถานะ: เลือก Order / Error / Direction ให้ครบ");
      return;
    }

    try {
      const numerical = differentiate(func, xi, hi, order, direction, accuracy);
      setResult(numerical);

      // true derivative via small central difference if possible, or symbolic expectations for common functions
      // We'll approximate using high-accuracy centered formula with very small h to emulate truth when possible
      const tiny = Math.min(1e-6, hi * 1e-3);
      let truth = null;
      if (order === "1") {
        // centered 5-point O(h^4)
        truth = (
          -func(xi + 2 * tiny) + 8 * func(xi + tiny) - 8 * func(xi - tiny) + func(xi - 2 * tiny)
        ) / (12 * tiny);
      } else {
        // second derivative 5-point O(h^4)
        truth = (
          -func(xi + 2 * tiny) + 16 * func(xi + tiny) - 30 * func(xi) + 16 * func(xi - tiny) - func(xi - 2 * tiny)
        ) / (12 * tiny * tiny);
      }
      setTrueVal(truth);

      const err = Math.abs((numerical - truth) / truth) * 100;
      setErrorPct(err);
      setStatus("สถานะ: เสร็จสิ้น");
    } catch (e) {
      console.error(e);
      setStatus("สถานะ: คำนวณไม่สำเร็จ (ตรวจสอบการเลือก/อินพุต)");
    }
  };

  const reset = () => {
    setOrder("");
    setAccuracy("");
    setDirection("");
    setExpr("");
    setX("");
    setH("");
    setResult(null);
    setTrueVal(null);
    setErrorPct(null);
    setStatus("สถานะ: รีเซ็ตแล้ว");
  };

  const handleSave = async () => {
    if (!expr || !order || !accuracy || !direction || x === "" || h === "") {
      alert("กรอกให้ครบก่อนบันทึก");
      return;
    }
    try {
      await saveProblem({ expr, order, accuracy, direction, x, h, method: "differentiation" });
      alert("บันทึกแล้ว!");
    } catch (e) {
      console.error("บันทึกโจทย์ผิดพลาด", e);
      alert("บันทึกไม่สำเร็จ");
    }
  };

  const handleLoad = (p) => {
    setExpr(p.expr ?? "");
    setOrder(p.order ?? "");
    setAccuracy(p.accuracy ?? "");
    setDirection(p.direction ?? "");
    setX(p.x ?? "");
    setH(p.h ?? "");
  };

  const handleDelete = (p) => {
    if (!confirm(`ลบโจทย์นี้ไหม?\n${p.expr}`)) return;
    deleteProblem(p.id).catch((e) => {
      console.error("ลบโจทย์ผิดพลาด", e);
      alert("ลบไม่สำเร็จ");
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader title="Differentiation" subtitle="คำนวณอนุพันธ์เชิงตัวเลขแบบ Finite Difference" />

      <div className="bg-slate-800 rounded-lg p-4 shadow">
        {/* Row of selects */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Order</label>
            <select value={order} onChange={(e) => setOrder(e.target.value)} className="w-full p-2 rounded bg-slate-900 border border-slate-700">
              {ORDER_OPTIONS.map((op) => (
                <option key={op.value} value={op.value}>{op.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Error</label>
            <select value={accuracy} onChange={(e) => setAccuracy(e.target.value)} className="w-full p-2 rounded bg-slate-900 border border-slate-700">
              {ERROR_OPTIONS.map((op) => (
                <option key={op.value} value={op.value}>{op.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Direction</label>
            <select value={direction} onChange={(e) => setDirection(e.target.value)} className="w-full p-2 rounded bg-slate-900 border border-slate-700">
              {DIRECTION_OPTIONS.map((op) => (
                <option key={op.value} value={op.value}>{op.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Expression and inputs */}
        <label className="block text-sm text-gray-300 mb-1">f(x)</label>
        <input
          type="text"
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          placeholder="e^x, sin(x), x^2 + 3x"
          className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 mb-3"
        />

        <div className="grid grid-cols-3 gap-3 items-end mb-3">
          <div>
            <label className="block text-sm text-gray-300 mb-1">x</label>
            <input type="number" value={x} onChange={(e) => setX(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">h</label>
            <input type="number" value={h} onChange={(e) => setH(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700" />
          </div>
          <div className="flex gap-2">
            <button onClick={calc} className="flex-1 btn-primary glow-btn py-2 rounded font-semibold">Calculate!</button>
            <button onClick={reset} className="flex-1 btn-danger border border-slate-600 py-2 rounded">Reset</button>
          </div>
        </div>

        <button onClick={handleSave} className="w-full btn-primary glow-btn py-2 rounded mb-3">บันทึกโจทย์</button>

        <SavedProblems
          problems={problems}
          onLoad={handleLoad}
          onDelete={handleDelete}
          removingIds={removingIds}
        />

        {/* Status + Results */}
        <div className="text-sm text-gray-200 mt-2 mb-2">{status}</div>
        {result !== null && (
          <div className="bg-slate-900 border border-slate-700 rounded p-3 space-y-1 text-gray-200">
            <div>Result: {formatNum(result)}</div>
            {trueVal !== null && <div>Exact (approx): {formatNum(trueVal)}</div>}
            {errorPct !== null && <div>Error: {formatNum(errorPct)}%</div>}
          </div>
        )}
      </div>

      <div className="text-sm text-gray-400 mt-6">© By KaiMaiRuh</div>
    </div>
  );
}
