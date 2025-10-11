import { useEffect, useState } from "react";
import * as MultipleLinearService from "../services/MultipleLinearService";
import useProblems from "../hooks/useProblems";
import PageHeader from "../components/PageHeader";
import SavedProblems from "../components/SavedProblems";
import { formatNum } from "../utils/math";

/** ---------------- Linear Algebra Helpers ---------------- **/
function gaussianSolve(A, b) {
  // Solve A w = b with Gaussian elimination + partial pivoting
  const n = A.length;
  // clone
  const M = A.map((row) => row.slice());
  const v = b.slice();

  for (let k = 0; k < n; k++) {
    // pivot
    let iMax = k;
    let maxVal = Math.abs(M[k][k]);
    for (let i = k + 1; i < n; i++) {
      const val = Math.abs(M[i][k]);
      if (val > maxVal) {
        maxVal = val;
        iMax = i;
      }
    }
    if (maxVal < 1e-15) throw new Error("Matrix is singular or ill-conditioned.");

    // swap rows
    if (iMax !== k) {
      [M[k], M[iMax]] = [M[iMax], M[k]];
      [v[k], v[iMax]] = [v[iMax], v[k]];
    }

    // eliminate
    for (let i = k + 1; i < n; i++) {
      const f = M[i][k] / M[k][k];
      M[i][k] = 0;
      for (let j = k + 1; j < n; j++) M[i][j] -= f * M[k][j];
      v[i] -= f * v[k];
    }
  }

  // back-substitution
  const x = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = v[i];
    for (let j = i + 1; j < n; j++) s -= M[i][j] * x[j];
    x[i] = s / M[i][i];
  }
  return x;
}

function transpose(M) {
  const r = M.length, c = M[0].length;
  const T = Array.from({ length: c }, () => Array(r).fill(0));
  for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) T[j][i] = M[i][j];
  return T;
}

function matMul(A, B) {
  const r = A.length, k = A[0].length, c = B[0].length;
  const R = Array.from({ length: r }, () => Array(c).fill(0));
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      let s = 0;
      for (let t = 0; t < k; t++) s += A[i][t] * B[t][j];
      R[i][j] = s;
    }
  }
  return R;
}

/** ---------------- Regression Core ---------------- **/
function fitMultipleLinear(dataRows) {
  // dataRows: [{ x: [x1,..,xm], y }]
  const n = dataRows.length;
  if (n < 2) return { error: "ต้องมีข้อมูลอย่างน้อย 2 แถว" };
  const m = dataRows[0].x.length;

  // Build X (n x (m+1)) with intercept, y (n x 1)
  const X = dataRows.map((r) => [1, ...r.x]);
  const y = dataRows.map((r) => [r.y]);

  const Xt = transpose(X);
  const XtX = matMul(Xt, X);        // (m+1) x (m+1)
  const Xty = matMul(Xt, y).map((row) => row[0]); // (m+1) vector

  // Solve (XtX) w = Xty
  const w = gaussianSolve(XtX, Xty); // w = [a, b1, b2, ... bm]

  // compute fitted values and metrics
  const yHat = X.map((row) => row.reduce((s, val, i) => s + val * w[i], 0));
  const yArr = y.map((r) => r[0]);
  const yMean = yArr.reduce((s, v) => s + v, 0) / n;

  const ssTot = yArr.reduce((s, v) => s + (v - yMean) ** 2, 0);
  const ssRes = yArr.reduce((s, v, i) => s + (v - yHat[i]) ** 2, 0);
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 1;

  return { coef: w, r2, yHat };
}

function predict(w, xVec) {
  // w: [a, b1..bm], xVec: [x1..xm]
  return w[0] + xVec.reduce((s, v, i) => s + w[i + 1] * v, 0);
}

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
