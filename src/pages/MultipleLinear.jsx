import { useEffect, useState } from "react";
import * as MultipleLinearService from "../services/MultipleLinearService";
import useProblems from "../hooks/useProblems";
import PageHeader from "../components/PageHeader";
import SavedProblems from "../components/SavedProblems";
import { formatNum } from "../utils/math";
import fitMultipleLinear, { predict } from "../algorithms/multipleLinear";

/** ---------------- Helpers moved to src/algorithms/multipleLinear.js ---------------- **/

/** ---------------- Component ---------------- **/
export default function MultipleLinear() {
  const [features, setFeatures] = useState(2); // จำนวนตัวแปรอิสระ m
  const [rows, setRows] = useState([
    { x: [1, 2], y: 5 },
    { x: [2, 0], y: 4 },
    { x: [3, 1], y: 7 },
  ]);
  const [xPredict, setXPredict] = useState(Array(2).fill(0));
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
    setRows([...rows, { x: Array(features).fill(0), y: 0 }]);
  };

  const removeRow = (idx) => {
    if (rows.length <= 2) return alert("ต้องมีอย่างน้อย 2 แถว");
    setRows(rows.filter((_, i) => i !== idx));
  };

  const handleFit = () => {
    try {
      const res = fitMultipleLinear(rows);
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

  const handlePredict = () => {
    if (!model?.coef) return alert("โปรดคำนวณโมเดลก่อน");
    const xp = xPredict.map((v) => parseFloat(v) || 0);
    setYPred(predict(model.coef, xp));
  };

  const handleReset = () => {
    setFeatures(2);
    setRows([
      { x: [1, 2], y: 5 },
      { x: [2, 0], y: 4 },
      { x: [3, 1], y: 7 },
    ]);
    setXPredict([0, 0]);
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
                            const nr = rows.map((row) => ({ ...row, x: [...row.x] }));
                            nr[i].x[j] = parseFloat(e.target.value) || 0;
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
                          const nr = rows.map((row) => ({ ...row, x: [...row.x] }));
                          nr[i].y = parseFloat(e.target.value) || 0;
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
                    nx[j] = parseFloat(e.target.value) || 0;
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
            <button onClick={handlePredict} className="flex-1 btn-primary glow-btn py-2 rounded font-semibold">
              ทำนายค่า yₚ
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
          <h3 className="text-gray-300 mb-2">ผลลัพธ์</h3>
          {model?.coef ? (
            <div className="text-sm text-gray-300 space-y-1">
              <div>Intercept (a) = {formatNum(model.coef[0])}</div>
              {model.coef.slice(1).map((b, i) => (
                <div key={i}>
                  b{i + 1} = {formatNum(b)}
                </div>
              ))}
              <div>R² = <span className="font-semibold">{formatNum(model.r2)}</span></div>
              {yPred !== null && (
                <div className="mt-2">
                  yₚ = <span className="font-semibold">{formatNum(yPred)}</span>
                </div>
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
