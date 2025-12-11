"use strict";

// ハニカム描画機能のみを作成
// **境界線制御用の変数 (0.0 から 1.0 の範囲)**
// これらの変数が、斜めの境界がX軸/Y軸のどこから始まるかを定義します。
// 例: top_x_start = 0.2, left_y_start = 0.8 の場合、
//     X軸の20%の位置とY軸の80%の位置を結ぶ直線が左上隅の境界線になります。
const top_x_start = 0.6; // 左上隅の境界線がX軸と交わる位置 (左から)
const top_x_end = 0.35; // 右上隅の境界線がX軸と交わる位置 (右から)

const bottom_x_start = 0.3; // 左下隅の境界線がX軸と交わる位置 (左から)
const bottom_x_end = 0.4; // 右下隅の境界線がX軸と交わる位置 (右から)

const left_y_start = 0.6; // 左上隅の境界線がY軸と交わる位置 (上から)
const left_y_end = 0.3; // 左下隅の境界線がY軸と交わる位置 (下から)

const right_y_start = 0.45; // 右上隅の境界線がY軸と交わる位置 (上から)
const right_y_end = 0.45; // 右下隅の境界線がY軸と交わる位置 (下から)

const expanded = 1;

// ハニカム描画機能のみを作成
function shouldRender(xp, yp) {
  let xper = expanded * (xp - 0.5) + 0.5;
  let yper = expanded * (yp - 0.5) + 0.5;
  // 線の傾きを計算し、描画領域（線の外側）かどうかを判定します。
  // 各隅で、二つの交点 (X軸とY軸) を通る直線の方程式 (y = mx + b) を使用します。

  // 1. 左上隅の判定 (X: (top_x_start, 0), Y: (0, left_y_start) を通る直線)
  // 直線の方程式: y / left_y_start + x / top_x_start = 1
  // 描画条件: yper / left_y_start + xper / top_x_start < 1 (境界線より外側)
  const isTopLeft =
    left_y_start > 0 &&
    top_x_start > 0 &&
    yper / left_y_start + xper / top_x_start < 1;

  // 2. 右上隅の判定 (X: (1 - top_x_end, 0), Y: (1, right_y_start) を通る直線)
  // X座標は右から計るため (1 - xper) を使用します。
  // 直線の方程式: y / right_y_start + (1 - x) / top_x_end = 1
  // 描画条件: yper / right_y_start + (1 - xper) / top_x_end < 1
  const isTopRight =
    right_y_start > 0 &&
    top_x_end > 0 &&
    yper / right_y_start + (1 - xper) / top_x_end < 1;

  // 3. 左下隅の判定 (X: (bottom_x_start, 1), Y: (0, 1 - left_y_end) を通る直線)
  // Y座標は下から計るため (1 - yper) を使用します。
  // 直線の方程式: (1 - y) / left_y_end + x / bottom_x_start = 1
  // 描画条件: (1 - yper) / left_y_end + xper / bottom_x_start < 1
  const isBottomLeft =
    left_y_end > 0 &&
    bottom_x_start > 0 &&
    (1 - yper) / left_y_end + xper / bottom_x_start < 1;

  // 4. 右下隅の判定 (X: (1 - bottom_x_end, 1), Y: (1, 1 - right_y_end) を通る直線)
  // X, Y座標ともに逆転させた値を使用します。
  // 直線の方程式: (1 - y) / right_y_end + (1 - x) / bottom_x_end = 1
  // 描画条件: (1 - yper) / right_y_end + (1 - xper) / bottom_x_end < 1
  const isBottomRight =
    right_y_end > 0 &&
    bottom_x_end > 0 &&
    (1 - yper) / right_y_end + (1 - xper) / bottom_x_end < 1;

  // いずれかの隅の条件を満たせば描画
  return isTopLeft || isTopRight || isBottomLeft || isBottomRight;
}
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
    canvas.width =
      pixel_width != null
        ? pixel_width
        : window.devicePixelRatio * window.innerWidth;
    canvas.height =
      pixel_height != null
        ? pixel_height
        : window.devicePixelRatio * window.innerHeight;

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
      ctx.lineWidth = window.devicePixelRatio;
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
        let x = canvas_x * honeycomb_width + shift[canvas_y % shift.length];
        let y = canvas_y * honeycomb_height;
        let xper = x / canvas.width;
        let yper = y / canvas.height;
        let rper = r / canvas.width;
        if (
          shouldRender(xper + rper, yper + rper) &&
          shouldRender(xper + rper, yper - rper) &&
          shouldRender(xper - rper, yper + rper) &&
          shouldRender(xper - rper, yper - rper)
        ) {
          drawHoneycomb(x, y);
        }
      }
    }
  };

  // 初回描画
  draw();
  // リサイズ時に再描画
  window.addEventListener("resize", draw);
}

drawHoneycombOnCanvas("honeycomb");
