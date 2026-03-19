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
  ctx.filter = "url(#glitch-filter) contrast(1.2)";
  const bundles = ["topLeft", "bottomRight", "leftBottom", "topRight"];
  bundles.forEach((type) => {
    // 各エリアに1〜2個の塊を生成
    const count = type === "topLeft" || type === "bottomRight" ? 3 : 2;
    for (let i = 0; i < count; i++) {
      drawSpecificBundle(type, i);
    }
  });
}

function drawSpecificBundle(type, clusterIdx) {
  const vw = canvas.width;
  const vh = canvas.height;
  const vmin = Math.min(vw, vh);
  const lineCount = type === "topLeft" || type === "bottomRight" ? 4 : 5;
  const spacing = 12;
  const iwidth = 0.5 * vmin;
  const iheight = iwidth / 2;

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
      startY = vh * 0.7 + clusterIdx * vh * 0.2;
      break;
    case "topRight":
      startX = vw;
      startY = vh * 0.3 - clusterIdx * vh * 0.2;
      break;
  }

  // 2. 「左は上ほど長く、右は下ほど長く」の重み付け
  const yRatio = startY / vh;
  const weight = type.toLowerCase().includes("left") ? 1 - yRatio : yRatio;
  baseLen = vw * 0.35 * weight;

  for (let j = 0; j < lineCount; j++) {
    const step = j * spacing;
    let x1 = startX;
    let y1 = type.includes("Right") ? startY - step : startY + step;
    let x2, y2, x3, y3;
    let x4, y4;

    // 斜め距離：重なりを防ぐため、横の長さ(x2)に比例させる
    const diag = vh * 0.12;
    let lim;
    switch (type) {
      case "topLeft":
        x2 = baseLen - step; // 外側ほど長くして重なり防止
        y2 = y1;
        x3 = x2 + diag;
        y3 = y2 + diag;
        lim = (vh - iheight) / 2 - spacing;
        if (y3 < lim) {
          let d = vmin * 0.12;
          x4 = x3 + (d + step) * 2;
          y4 = y3;
        }
        break;
      case "bottomRight":
        x2 = vw - baseLen + step;
        y2 = y1;
        x3 = x2 - diag;
        y3 = y2 - diag;
        lim = (vh + iheight) / 2 + spacing;
        if (y3 > lim) {
          let d = vmin * 0.12;
          x4 = x3 - (d + step) * 2;
          y4 = y3;
        }
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
    if (x4 && y4) {
      ctx.lineTo(x4, y4);
    }

    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x3, y3, 1.3, 0, Math.PI * 2);
    ctx.fill();
  }
}

window.addEventListener("resize", init);
window.onload = init;
