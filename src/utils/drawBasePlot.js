// src/utils/drawBasePlot.js
/**
 * drawBasePlot(canvas, func, points, opts)
 * ฟังก์ชันวาดกราฟพื้นฐานที่ใช้ได้ทุกหมวด เช่น Root, Interpolation, Regression, Integration ฯลฯ
 *
 * @param {HTMLCanvasElement} canvas - Canvas element ที่จะวาด
 * @param {Function|null} func - ฟังก์ชัน f(x) สำหรับวาดเส้นโค้ง
 * @param {Array<[number, number]>} points - จุดข้อมูลเพิ่มเติม เช่น (x_i, y_i)
 * @param {Object} opts - ค่าตั้งค่า เช่น {width, height, xmin, xmax, ymin, ymax, curveColor, pointColor}
 */
export default function drawBasePlot(canvas, func = null, points = [], opts = {}) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // ==== ค่า default ====
  const {
    width = 800,
    height = 320,
    bg = "#061022",
    axesColor = "rgba(255,255,255,0.08)",
    curveColor = "#3b82f6",
    pointColor = "#f97316",
    lastPointColor = "#fb923c",
    xmin = -5,
    xmax = 5,
    ymin = -5,
    ymax = 5,
    showGrid = true,
  } = opts;

  // ==== ตั้งค่าขนาด ====
  const W = (canvas.width = width);
  const H = (canvas.height = height);

  // ==== เคลียร์พื้นหลัง ====
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // ==== ฟังก์ชันแปลงค่าพิกัด ====
  const mapX = (x) => ((x - xmin) / (xmax - xmin)) * W;
  const mapY = (y) => H - ((y - ymin) / (ymax - ymin)) * H;

  // ==== วาดกริด ====
  if (showGrid) {
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    for (let i = 1; i < 10; i++) {
      const gx = (W / 10) * i;
      const gy = (H / 10) * i;
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, H);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(W, gy);
      ctx.stroke();
    }
  }

  // ==== วาดแกน ====
  ctx.strokeStyle = axesColor;
  ctx.lineWidth = 1.2;
  if (ymin < 0 && ymax > 0) {
    ctx.beginPath();
    ctx.moveTo(0, mapY(0));
    ctx.lineTo(W, mapY(0));
    ctx.stroke();
  }
  if (xmin < 0 && xmax > 0) {
    ctx.beginPath();
    ctx.moveTo(mapX(0), 0);
    ctx.lineTo(mapX(0), H);
    ctx.stroke();
  }

  // ==== วาดกราฟฟังก์ชัน ====
  if (typeof func === "function") {
    const N = 600;
    ctx.beginPath();
    ctx.strokeStyle = curveColor;
    ctx.lineWidth = 2;
    let started = false;

    for (let i = 0; i <= N; i++) {
      const x = xmin + ((xmax - xmin) * i) / N;
      let y;
      try {
        y = func(x);
      } catch {
        y = NaN;
      }
      if (!isFinite(y)) continue;
      const px = mapX(x);
      const py = mapY(y);
      if (!started) {
        ctx.moveTo(px, py);
        started = true;
      } else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  // ==== วาดจุดข้อมูล ====
  if (points && points.length) {
    points.forEach(([x, y], i) => {
      const px = mapX(x);
      const py = mapY(y);
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, 2 * Math.PI);
      ctx.fillStyle = i === points.length - 1 ? lastPointColor : pointColor;
      ctx.fill();
    });
  }
}
