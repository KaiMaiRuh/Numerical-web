// Graphical Method (สำหรับคำนวณจุด f(x) เพื่อใช้พล็อตกราฟ)

import { formatNum } from "../utils/math";

export function graphical(func, xStart = -5, xEnd = 5, step = 0.5) {
  try {
    if (typeof func !== "function") throw new Error("ต้องส่งฟังก์ชัน f(x) เข้ามา");
    if (!isFinite(xStart) || !isFinite(xEnd) || xStart >= xEnd) throw new Error("ช่วง x ไม่ถูกต้อง");
    if (!isFinite(step) || step <= 0) throw new Error("step ต้องเป็นค่าบวก");

    const points = [], roots = [];
    let prev = null;
    for (let x = xStart; x <= xEnd; x += step) {
      const y = func(x);
      if (!isFinite(y)) continue;
      const p = { x, y }; points.push(p);
      if (prev && prev.y * y < 0) roots.push(formatNum((prev.x + x) / 2));
      prev = p;
    }
    return { points, roots };
  } catch (e) { return { error: String(e), points: [], roots: [] }; }
}

export default graphical;
