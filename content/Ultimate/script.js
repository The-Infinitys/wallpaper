const canvas = document.getElementById("overlay");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;

function resize() {
  let element = document.getElementById("overlay");
  const { width: eWidth, height: eHeight } = element.getBoundingClientRect();

  const dpr = window.devicePixelRatio || 1;
  width = eWidth;
  height = eHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;

  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  ctx.scale(dpr, dpr);
  draw();
}
resize();
window.addEventListener("resize", resize);

// 正多角形を描画するヘルパー関数
function drawPolygon(ctx, x, y, radius, sides, index) {
  ctx.beginPath();
  const rotateAngle = (index * Math.PI) / (sides / 2);

  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2 + rotateAngle;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, width, height);

  const centerX = width / 2;
  const centerY = height / 2;

  // ── 【最適化】対角線サイズと最大半径の定義 ──
  const diagonal = Math.sqrt(width * width + height * height);
  const maxRadius = diagonal / 2;

  // ── 【解消クッション】正方形になってもスカスカにさせない動的ベース ──
  // 対角線（diagonal）だけだと正方形で縮むため、長辺（Math.max）の要素をブレンドして補正します
  const baseSize = (diagonal + Math.max(width, height)) / 2;

  // ── パラメータの動的算出 ──
  const totalLines = 24;

  // ロゴを避ける中央の最小半径（画面サイズに対して一定の視覚サイズをキープ）
  const minRadius = Math.min(width, height) * 0.35;
  const outerLimit = maxRadius * 1.3;
  // ────────────────────────────────────────

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  // ==========================================
  // 1. 交差線：円周（角度）に完全連動する虹色
  // ==========================================
  ctx.lineWidth = 1.0;
  const linesPerQuadrant = totalLines / 4;

  for (let i = 0; i < linesPerQuadrant; i++) {
    const baseAngle = (i / linesPerQuadrant) * (Math.PI / 2);

    // カーブと交差の係数を補正後のbaseSizeから算出
    const bendFactor = Math.sin(i * 3.2) * (baseSize * 0.11);
    const crossFactor = Math.cos(i * 4.1) * (baseSize * 0.06);

    const startX =
      centerX +
      Math.cos(baseAngle) * outerLimit +
      Math.sin(baseAngle) * bendFactor;
    const startY =
      centerY -
      (Math.sin(baseAngle) * outerLimit + Math.cos(baseAngle) * bendFactor);
    const endX = centerX + Math.cos(baseAngle) * minRadius;
    const endY = centerY - Math.sin(baseAngle) * minRadius;

    const midX =
      (startX + endX) / 2 +
      Math.cos(baseAngle + Math.PI / 2) * bendFactor +
      crossFactor;
    const midY =
      (startY + endY) / 2 -
      (Math.sin(baseAngle + Math.PI / 2) * bendFactor + crossFactor);

    const symmetries = [
      { sx: 1, sy: 1 },
      { sx: -1, sy: 1 },
      { sx: 1, sy: -1 },
      { sx: -1, sy: -1 },
    ];

    symmetries.forEach((sym) => {
      const sX = centerX + (startX - centerX) * sym.sx;
      const sY = centerY + (startY - centerY) * sym.sy;
      const mX = centerX + (midX - centerX) * sym.sx;
      const mY = centerY + (midY - centerY) * sym.sy;
      const eX = centerX + (endX - centerX) * sym.sx;
      const eY = centerY + (endY - centerY) * sym.sy;

      const currentAngle = Math.atan2(mY - centerY, mX - centerX);
      let hue = (currentAngle * 180) / Math.PI;
      if (hue < 0) hue += 360;

      const lineGrad = ctx.createLinearGradient(sX, sY, eX, eY);
      lineGrad.addColorStop(0, `hsla(${hue}, 100%, 60%, 1.0)`);
      lineGrad.addColorStop(0.35, `hsla(${hue}, 95%, 55%, 1.0)`);
      lineGrad.addColorStop(0.65, `hsla(${hue}, 90%, 50%, 0.0)`);
      lineGrad.addColorStop(1, `rgba(0, 0, 0, 0)`);

      ctx.beginPath();
      ctx.moveTo(sX, sY);
      ctx.lineTo(mX, mY);
      ctx.lineTo(eX, eY);

      ctx.strokeStyle = lineGrad;
      ctx.stroke();
    });
  }

  // ==========================================
  // 2. 多角形と同心円：円錐グラデーション（Conic）
  // ==========================================
  // 【改善】正方形時でも線が間伸びしないよう、短辺（Math.min）基準の固定ステップで密度を安定化
  const step = Math.min(width, height) * 0.12;
  const startRadius = minRadius * 1.2; // 中央の空白より少し外側から開始

  const conicGrad = ctx.createConicGradient(0, centerX, centerY);
  conicGrad.addColorStop(0, "hsla(0, 100%, 55%, 1.0)");
  conicGrad.addColorStop(0.15, "hsla(45, 100%, 50%, 1.0)");
  conicGrad.addColorStop(0.35, "hsla(120, 100%, 45%, 1.0)");
  conicGrad.addColorStop(0.55, "hsla(190, 100%, 50%, 1.0)");
  conicGrad.addColorStop(0.7, "hsla(240, 100%, 55%, 1.0)");
  conicGrad.addColorStop(0.85, "hsla(290, 100%, 55%, 1.0)");
  conicGrad.addColorStop(1, "hsla(360, 100%, 55%, 1.0)");

  for (let r = startRadius; r <= outerLimit + step; r += step) {
    const index = (r - startRadius) / step;
    const sides = 8 + (index % 3) * 4;

    const radiusRatio = Math.min(1.0, r / maxRadius);
    const dynamicOpacity = Math.pow(radiusRatio, 4.0);

    ctx.save();
    ctx.strokeStyle = conicGrad;
    ctx.globalAlpha = dynamicOpacity;

    ctx.lineWidth = 1.0;
    drawPolygon(ctx, centerX, centerY, r, sides, index);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
    ctx.lineWidth = 0.5;
    ctx.stroke();

    ctx.restore();
  }

  ctx.restore();
}
