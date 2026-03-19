const canvas = document.getElementById("pcbCanvas");
const ctx = canvas.getContext("2d");

const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const color = isDark ? "#FFFFFF" : "#000000";
const bgColor = isDark ? "#000000" : "#FFFFFF";

function init() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.1;

  const bundles = ["topLeft", "bottomRight", "leftBottom", "topRight"];
  bundles.forEach((type) => {
    // 各エリアに1〜2個の塊を生成
    const count = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < count; i++) {
      drawSpecificBundle(type, i);
    }
  });
}

function drawSpecificBundle(type, clusterIdx) {
  const vw = canvas.width;
  const vh = canvas.height;
  const lineCount = Math.floor(Math.random() * 3) + 4;
  const spacing = 12;

  let startX, startY, baseLen;

  // 1. 開始位置の決定
  switch (type) {
    case "topLeft":
      startX = 0;
      startY = vh * 0.05 + clusterIdx * vh * 0.2;
      break;
    case "bottomRight":
      startX = vw;
      startY = vh * 0.95 - clusterIdx * vh * 0.2;
      break;
    case "leftBottom":
      startX = 0;
      startY = vh * 0.6 + clusterIdx * vh * 0.15;
      break;
    case "topRight":
      startX = vw;
      startY = vh * 0.4 - clusterIdx * vh * 0.15;
      break;
  }

  // 2. 「左は上ほど長く、右は下ほど長く」の重み付け
  // yRatio: 0(上端) 〜 1(下端)
  const yRatio = startY / vh;
  const weight = type.toLowerCase().includes("left") ? 1 - yRatio : yRatio;
  // 基本の長さ (画面幅の 10% 〜 30% で変動)
  baseLen = vw * 0.05 + vw * 0.3 * weight;

  for (let j = 0; j < lineCount; j++) {
    const step = j * spacing;
    let x1 = startX;
    // 束が重ならないよう、開始の高さも少しずつずらす
    let y1 = type.includes("Right") ? startY - step : startY + step;
    let x2, y2, x3, y3;

    // 斜め距離：重なりを防ぐため、横の長さ(x2)に比例させる
    const diag = vh * 0.12;

    switch (type) {
      case "topLeft":
        x2 = baseLen - step; // 外側ほど長くして重なり防止
        y2 = y1;
        x3 = x2 + diag;
        y3 = y2 + diag;
        break;
      case "bottomRight":
        x2 = vw - baseLen + step;
        y2 = y1;
        x3 = x2 - diag;
        y3 = y2 - diag;
        break;
      case "leftBottom":
        x2 = baseLen * 0.5 - step;
        y2 = y1;
        y3 = vh;
        x3 = x2 + (y3 - y2);
        break;
      case "topRight":
        x2 = vw - baseLen * 0.5 + step;
        y2 = y1;
        y3 = 0;
        x3 = x2 - (y2 - y3);
        break;
    }

    // 3. 描画
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x3, y3, 1.3, 0, Math.PI * 2);
    ctx.fill();
  }
}

window.addEventListener("resize", init);
window.onload = init;
