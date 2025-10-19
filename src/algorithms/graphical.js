// Graphical Method (สำหรับคำนวณจุด f(x) เพื่อใช้พล็อตกราฟ)

import { formatNum } from "../utils/math";

export function graphical(func, xStart = -5, xEnd = 5, step = 0.5) {
  try {
    if (typeof func !== "function") throw new Error("ต้องส่งฟังก์ชัน f(x) เข้ามา");
    if (!isFinite(xStart) || !isFinite(xEnd) || xStart >= xEnd)
      throw new Error("ช่วง x ไม่ถูกต้อง");
    if (!isFinite(step) || step <= 0)
      throw new Error("step ต้องเป็นค่าบวก");

    const points = [];
    for (let x = xStart; x <= xEnd; x += step) {
      const y = func(x);
      if (isFinite(y)) points.push({ x, y });
    }

    // หาจุดที่กราฟตัดแกน X โดยประมาณ (เปลี่ยนเครื่องหมาย)
    const roots = [];
    for (let i = 0; i < points.length - 1; i++) {
      const y1 = points[i].y;
      const y2 = points[i + 1].y;
      if (y1 * y2 < 0) {
        const rootApprox = (points[i].x + points[i + 1].x) / 2;
        roots.push(formatNum(rootApprox));
      }
    }

    return { points, roots };
  } catch (e) {
    return { error: String(e), points: [], roots: [] };
  }
}

export default graphical;
