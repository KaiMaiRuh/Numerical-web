import { useEffect, useState } from "react";
import * as MultipleLinearService from "../services/MultipleLinearService";
import useProblems from "../hooks/useProblems";
import PageHeader from "../components/PageHeader";
import SavedProblems from "../components/SavedProblems";
import { formatNum } from "../utils/math";
import fitMultipleLinear, { predict } from "../algorithms/multipleLinear";
import GraphSimpleRegression from "../components/graphs/GraphSimpleRegression";

/** ---------------- Helpers moved to src/algorithms/multipleLinear.js ---------------- **/

/** ---------------- Component ---------------- **/
export default function MultipleLinear() {
  const [features, setFeatures] = useState(2); // จำนวนตัวแปรอิสระ m (allowed default)
  // Start with empty editable inputs (no preset numeric values)
  const [rows, setRows] = useState(
    Array(3)
      .fill()
      .map(() => ({ x: Array(2).fill(""), y: "" }))
  );
  const [xPredict, setXPredict] = useState(Array(2).fill(""));
  const [model, setModel] = useState(null); // {coef, r2}
  const [yPred, setYPred] = useState(null);
  const [status, setStatus] = useState("สถานะ: ยังไม่ได้คำนวณ");

  const { problems, removingIds, refresh, saveProblem, deleteProblem } =
    useProblems(MultipleLinearService);

  useEffect(() => {
    refresh().catch(console.error);
  }, [refresh]);

  // ---------- Handlers ----------
  const syncFeatureCount = (m) => {
    // adjust rows and xPredict length
    setRows((prev) =>
      prev.map((r) => {
        const nx = r.x.slice(0, m);
        while (nx.length < m) nx.push(0);
        return { ...r, x: nx };
      })
    );
    setXPredict((prev) => {
      const nx = prev.slice(0, m);
      while (nx.length < m) nx.push(0);
      return nx;
    });
  };

  const handleChangeFeatures = (mInput) => {
    const m = Math.max(1, Math.min(8, parseInt(mInput) || 1)); // cap 8 for UI sanity
    setFeatures(m);
    syncFeatureCount(m);
  };

  const addRow = () => {
    setRows([...rows, { x: Array(features).fill(""), y: "" }]);
  };

  const removeRow = (idx) => {
    if (rows.length <= 2) return alert("ต้องมีอย่างน้อย 2 แถว");
    setRows(rows.filter((_, i) => i !== idx));
  };

  const handleFit = () => {
    try {
      // validate rows: ensure all x and y values are numeric
      for (const r of rows) {
        if (!Array.isArray(r.x) || r.x.length < features) throw new Error("กรุณากรอกข้อมูลให้ครบ");
        for (const v of r.x) if (v === "" || Number.isNaN(parseFloat(v))) throw new Error("กรุณากรอกข้อมูลให้ครบ");
        if (r.y === "" || Number.isNaN(parseFloat(r.y))) throw new Error("กรุณากรอกค่า y ทุกแถว");
      }
      const numericRows = rows.map((r) => ({ x: r.x.map((v) => parseFloat(v)), y: parseFloat(r.y) }));
      const res = fitMultipleLinear(numericRows);
      if (res.error) {
        setModel(null);
        setYPred(null);
        setStatus("สถานะ: " + res.error);
        return;
      }
      setModel(res);
      setStatus("สถานะ: คำนวณโมเดลสำเร็จ (R² = " + formatNum(res.r2) + ")");
      if (xPredict.every((v) => Number.isFinite(parseFloat(v)))) {
        setYPred(predict(res.coef, xPredict.map((v) => parseFloat(v))));
      }
    } catch (e) {
      console.error(e);
      setStatus("สถานะ: เกิดข้อผิดพลาดในการคำนวณ");
    }
  };

  // Predict now happens right after fitting and on xPredict change if model exists

  const handleReset = () => {
    setFeatures(2);
    setRows(Array(3).fill().map(() => ({ x: Array(2).fill(""), y: "" })));
    setXPredict(Array(2).fill(""));
    setModel(null);
    setYPred(null);
    setStatus("สถานะ: รีเซ็ตแล้ว");
  };

  const handleSaveProblem = async () => {
    try {
      const payload = {
        features,
        rows: JSON.stringify(rows),
        xPredict: JSON.stringify(xPredict),
        expr: `Multiple Linear (${features} features, ${rows.length} rows)`,
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
      const m = p.features || 1;
      const r = typeof p.rows === "string" ? JSON.parse(p.rows) : p.rows || [];
      const xp =
        typeof p.xPredict === "string" ? JSON.parse(p.xPredict) : p.xPredict || [];
      setFeatures(m);
      setRows(r);
      setXPredict(xp && Array.isArray(xp) ? xp : Array(m).fill(0));
      setModel(null);
      setYPred(null);
      setStatus("สถานะ: โหลดโจทย์แล้ว (โปรดกดคำนวณ)");
      syncFeatureCount(m);
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
      <PageHeader
        title="Multiple Linear Regression"
        subtitle="การถดถอยเชิงเส้นพหุคูณ: y = a + b₁x₁ + ... + b_m x_m"
      />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: Inputs */}
        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay1">
          <div className="mb-3">
            <label className="block text-sm text-gray-400 mb-1">
              จำนวนตัวแปรอิสระ (m)
            </label>
            <input
              type="number"
              value={features}
              onChange={(e) => handleChangeFeatures(e.target.value)}
              className="w-24 px-3 py-2 rounded bg-slate-900 border border-slate-700"
            />
          </div>

          <label className="block text-sm text-gray-400 mb-1">ตารางข้อมูล</label>
          <div className="overflow-x-auto">
            <table className="text-sm border-collapse mb-3">
              <thead>
                <tr>
                  {Array.from({ length: features }, (_, j) => (
                    <th key={j} className="px-2 py-1 text-left text-gray-400">
                      x{j + 1}
                    </th>
                  ))}
                  <th className="px-2 py-1 text-left text-gray-400">y</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    {r.x.map((val, j) => (
                      <td className="p-1" key={j}>
                        <input
                          type="number"
                          value={val}
                          onChange={(e) => {
                            const v = e.target.value === "" ? "" : parseFloat(e.target.value);
                            const nr = rows.map((row) => ({ ...row, x: [...row.x] }));
                            nr[i].x[j] = v;
                            setRows(nr);
                          }}
                          className="w-20 px-2 py-1 rounded bg-slate-900 border border-slate-700"
                        />
                      </td>
                    ))}
                    <td className="p-1">
                      <input
                        type="number"
                        value={r.y}
                        onChange={(e) => {
                          const v = e.target.value === "" ? "" : parseFloat(e.target.value);
                          const nr = rows.map((row) => ({ ...row, x: [...row.x] }));
                          nr[i].y = v;
                          setRows(nr);
                        }}
                        className="w-20 px-2 py-1 rounded bg-slate-900 border border-slate-700"
                      />
                    </td>
                    <td className="p-1">
                      <button
                        onClick={() => removeRow(i)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button onClick={addRow} className="w-full btn-primary glow-btn py-2 rounded mb-3">
            เพิ่มแถวข้อมูล
          </button>

          <div className="mb-3">
            <label className="block text-sm text-gray-400 mb-1">
              ค่าที่ต้องการทำนาย (xₚ1..xₚm)
            </label>
            <div className="flex flex-wrap gap-2">
              {xPredict.map((v, j) => (
                <input
                  key={j}
                  type="number"
                  value={v}
                  onChange={(e) => {
                    const nx = xPredict.slice();
                    nx[j] = e.target.value === "" ? "" : parseFloat(e.target.value);
                    setXPredict(nx);
                  }}
                  className="w-24 px-2 py-1 rounded bg-slate-900 border border-slate-700"
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 mb-3">
            <button onClick={handleFit} className="flex-1 btn-primary glow-btn py-2 rounded font-semibold">
              คำนวณโมเดล
            </button>
            <button onClick={handleReset} className="flex-1 btn-danger border border-slate-600 py-2 rounded">
              รีเซ็ต
            </button>
          </div>

          <button onClick={handleSaveProblem} className="w-full btn-primary glow-btn py-2 rounded mb-3">
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

        {/* Right: Results */}
        <div className="bg-slate-800 rounded-lg p-4 shadow fade-in-delay2">
          <h3 className="text-gray-300 mb-2">กราฟและผลลัพธ์</h3>
          {/* Single combined graph with multiple series (one per feature) */}
          <div className="w-full h-72 rounded overflow-hidden bg-slate-900 mb-3">
            <GraphSimpleRegression
              className="w-full h-full"
              series={Array.from({ length: features }, (_, j) => ({
                xs: rows.map((r) => r.x[j]),
                ys: rows.map((r) => r.y),
                a: model?.coef?.[0] ?? 0,
                b: model?.coef?.[j + 1] ?? 0,
                pointColor: ["#38bdf8","#f472b6","#34d399","#fbbf24","#a78bfa","#ef4444","#22c55e","#60a5fa"][j % 8],
                lineColor: ["#f59e0b","#ec4899","#10b981","#f59e0b","#8b5cf6","#ef4444","#22c55e","#3b82f6"][j % 8],
                // label intentionally omitted per request
              }))}
              showLegend={false}
            />
          </div>

          <h4 className="text-gray-300 mb-2">คำอธิบายผลลัพธ์</h4>
          {model?.coef ? (
            <div className="text-sm text-gray-300 space-y-1">
              <div>
                a = {formatNum(model.coef[0])} <span className="text-gray-400">(จุดตัดแกน y หรือค่าคงที่)</span>
              </div>
              {model.coef.slice(1).map((b, i) => (
                <div key={i}>b{i + 1} = {formatNum(b)} <span className="text-gray-400">(ความชันของตัวแปร x{i + 1} เมื่อคงตัวแปรอื่นคงที่)</span></div>
              ))}
              <div>R² = <span className="font-semibold">{formatNum(model.r2)}</span> <span className="text-gray-400">(บอกสัดส่วนที่โมเดลอธิบายความแปรปรวนของ y ได้ ยิ่งใกล้ 1 ยิ่งดี)</span></div>
              {yPred !== null && (
                <div className="mt-2">yₚ = <span className="font-semibold">{formatNum(yPred)}</span> <span className="text-gray-400">(ค่าพยากรณ์เมื่อแทน xₚ ลงในสมการ)</span></div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-400">ยังไม่มีโมเดล</div>
          )}

          <div className="mt-4 text-sm text-gray-400">
            Multiple Linear Regression แก้ด้วย Normal Equation: (XᵀX)w = Xᵀy
            แล้วคำนวณสัมประสิทธิ์ w = [a, b₁, …, b_m].
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-400 mt-6 fade-in-delay3">© By KaiMaiRuh</div>
    </div>
  );
}
