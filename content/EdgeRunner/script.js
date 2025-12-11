"use strict";

// ハニカム描画機能のみを作成
function drawHoneycombOnCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error("Canvas element not found.");
    return;
  }

  const draw = () => {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Failed to get canvas context.");
      return;
    }

    // 現在のテーマから背景色を抽出 (--back-color を使用)
    const rootElem = document.documentElement;
    const computedStyle = getComputedStyle(rootElem);
    const backColor = computedStyle.getPropertyValue("--back-color").trim();

    // Canvasサイズをウィンドウに合わせる (devicePixelRatio考慮)
    canvas.width = window.devicePixelRatio * window.innerWidth;
    canvas.height = window.devicePixelRatio * window.innerHeight;

    // 背景を --back-color で塗りつぶす
    ctx.fillStyle = backColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ハニカムパターン定義
    const r = 25; // 六角形の半径
    const root3 = Math.sqrt(3);
    const honeycomb_width = r * root3;
    const honeycomb_height = (r * 3) / 2;
    const shift = [0, -honeycomb_width / 2];

    // ハニカム描画関数
    const drawHoneycomb = (x, y) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y - r);
      ctx.lineTo(x + (root3 / 2) * r, y - r / 2);
      ctx.lineTo(x + (root3 / 2) * r, y + r / 2);
      ctx.lineTo(x, y + r);
      ctx.lineTo(x - (root3 / 2) * r, y + r / 2);
      ctx.lineTo(x - (root3 / 2) * r, y - r / 2);
      ctx.closePath();
      ctx.stroke();
      ctx.globalCompositeOperation = "source-over";
    };

    // パターンをキャンバス全体に描画
    for (
      let canvas_y = 0;
      (canvas_y - 1) * honeycomb_height < canvas.height;
      canvas_y++
    ) {
      for (
        let canvas_x = 0;
        (canvas_x - 1) * honeycomb_width + shift[canvas_y % shift.length] <
        canvas.width;
        canvas_x++
      ) {
        drawHoneycomb(
          canvas_x * honeycomb_width + shift[canvas_y % shift.length],
          canvas_y * honeycomb_height
        );
      }
    }
  };

  // 初回描画
  draw();

  // リサイズ時に再描画
  window.addEventListener("resize", draw);
}

drawHoneycombOnCanvas("honeycomb");
