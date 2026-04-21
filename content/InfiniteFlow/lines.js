(function () {
  const canvas = document.getElementById("linesCanvas");
  const ctx = canvas.getContext("2d");

  function draw() {
    const pixelRatio = window.devicePixelRatio || 1;
    const rawW = window.innerWidth;
    const rawH = window.innerHeight;
    canvas.width = rawW * pixelRatio;
    canvas.height = rawH * pixelRatio;

    const w = canvas.width;
    const h = canvas.height;

    function renderSet(wRef, hRef, drawThinLine = true) {
      const margin = hRef * 0.05;
      const yBottom = hRef;
      const yTop = hRef - margin * 3;
      const yMid = hRef - margin * 2;
      const xBend = yBottom - yTop;

      const boldWidth = 24 * pixelRatio; // 少し太く
      const thinWidth = 4 * pixelRatio;
      const neonCoreWidth = 2 * pixelRatio; // ネオンの芯（白）

      // --- 修正箇所：ネオンカラーのグラデーション ---
      const grad = ctx.createLinearGradient(0, 0, wRef, 0);
      grad.addColorStop(0, "#FF0055"); // 鮮やかなネオンピンク
      grad.addColorStop(0.25, "#FFDD00"); // ネオンイエロー
      grad.addColorStop(0.5, "#00FFDD"); // ネオンシアン
      grad.addColorStop(0.75, "#0055FF"); // ネオンブルー
      grad.addColorStop(1, "#FF00FF"); // ネオンマゼンタ

      // パス定義（boldPath, thinPath）は変更なし
      const boldPath = new Path2D();
      const halfBold = boldWidth / 2;
      boldPath.moveTo(0, yBottom + halfBold);
      boldPath.lineTo(0, yBottom - halfBold);
      boldPath.lineTo(xBend, yTop - halfBold);
      const transitionLength = thinWidth;
      boldPath.lineTo(xBend + thinWidth, yTop - halfBold);
      boldPath.lineTo(xBend + thinWidth + transitionLength, yTop - halfBold);
      boldPath.lineTo(wRef, yTop - halfBold);
      boldPath.lineTo(wRef, yTop - halfBold + thinWidth);
      boldPath.lineTo(
        xBend + boldWidth + transitionLength,
        yTop - halfBold + thinWidth,
      );
      boldPath.lineTo(xBend + boldWidth, yTop - halfBold + thinWidth);
      boldPath.lineTo(xBend, yTop - halfBold + thinWidth);
      boldPath.lineTo(xBend + boldWidth, yTop - halfBold);
      boldPath.closePath();

      const thinPath = new Path2D();
      thinPath.moveTo(0, yMid);
      thinPath.lineTo(wRef, yMid);

      ctx.save();
      // 光を重ねる合成モード
      ctx.globalCompositeOperation = "screen";

      // --- 1. 広範囲の淡いグロー ---
      ctx.shadowBlur = 50 * pixelRatio;
      ctx.shadowColor = grad; // 影の色をグラデーションに
      ctx.fillStyle = grad;
      ctx.strokeStyle = grad;
      ctx.lineWidth = thinWidth;
      ctx.fill(boldPath);
      if (drawThinLine) ctx.stroke(thinPath);

      // --- 2. 中範囲の強いグロー ---
      ctx.shadowBlur = 20 * pixelRatio;
      ctx.shadowColor = "white"; // 白い光を混ぜる
      ctx.globalAlpha = 0.5; // 少し透明に
      ctx.fill(boldPath);
      if (drawThinLine) ctx.stroke(thinPath);

      // --- 3. ネオンの芯（真っ白な細い線）を描画 ---
      ctx.save();
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 5 * pixelRatio; // 芯のすぐ周りの光
      ctx.shadowColor = "white";
      ctx.fillStyle = "white"; // 芯は白
      ctx.strokeStyle = "white";
      ctx.lineWidth = neonCoreWidth; // 芯の細さ
      ctx.fill(boldPath);
      if (drawThinLine) ctx.stroke(thinPath);
      ctx.restore();

      ctx.restore();
    }

    // レイアウト判定は変更なし
    const aspectThreshold = 0.05;
    const diff = Math.abs(w - h) / Math.max(w, h);

    if (diff < aspectThreshold) {
      for (let i = 0; i < 4; i++) {
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.rotate((Math.PI / 2) * i);
        ctx.translate(-w / 2, -h / 2);
        renderSet(w, h, false);
        ctx.restore();
      }
    } else if (h > w) {
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(Math.PI / 2);
      ctx.translate(-h / 2, -w / 2);
      renderSet(h, w, true);

      ctx.translate(h / 2, w / 2);
      ctx.rotate(Math.PI);
      ctx.translate(-h / 2, -w / 2);
      renderSet(h, w, true);
      ctx.restore();
    } else {
      renderSet(w, h, true);
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(Math.PI);
      ctx.translate(-w / 2, -h / 2);
      renderSet(w, h, true);
      ctx.restore();
    }
  }

  window.addEventListener("resize", draw);
  draw();
})();
