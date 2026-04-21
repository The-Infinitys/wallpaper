(function () {
  const canvas = document.getElementById("linesCanvas");
  const ctx = canvas.getContext("2d");

  function draw() {
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * pixelRatio;
    canvas.height = window.innerHeight * pixelRatio;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, "#f00");
    grad.addColorStop(0.2, "#ff0");
    grad.addColorStop(0.4, "#0f0");
    grad.addColorStop(0.6, "#0ff");
    grad.addColorStop(0.8, "#00f");
    grad.addColorStop(1, "#f0f");

    const margin = h * 0.05;
    const yBottom = h;
    const yTop = h - margin * 3;
    const yMid = h - margin * 2;
    const xBend = yBottom - yTop;

    const boldWidth = 20 * pixelRatio;
    const thinWidth = 4 * pixelRatio;
    const halfBold = boldWidth / 2;

    function renderSet() {
      // --- パスの作成 ---
      const boldPath = new Path2D();
      boldPath.moveTo(0, yBottom + halfBold);
      boldPath.lineTo(0, yBottom - halfBold);
      boldPath.lineTo(xBend, yTop - halfBold);
      const transitionLength = thinWidth;
      boldPath.lineTo(xBend + thinWidth, yTop - halfBold);
      boldPath.lineTo(xBend + thinWidth + transitionLength, yTop - halfBold);
      boldPath.lineTo(w, yTop - halfBold);
      boldPath.lineTo(w, yTop - halfBold + thinWidth);
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
      thinPath.lineTo(w, yMid);

      // --- 描画設定（発光） ---
      ctx.save();
      ctx.globalCompositeOperation = "screen";

      // 本体の色
      ctx.fillStyle = grad;
      ctx.strokeStyle = grad;
      ctx.lineWidth = thinWidth;

      // 1. 発光の暈 (Shadow)
      ctx.shadowBlur = 15 * pixelRatio;
      ctx.shadowColor = "white"; // 白い光を混ぜると発光感が強まります

      // 2. 本体の描画
      ctx.fill(boldPath);
      ctx.stroke(thinPath);

      // 3. 重ねて光を強調 (さらに太い線で淡く)
      ctx.shadowBlur = 30 * pixelRatio;
      ctx.globalAlpha = 0.3;
      ctx.stroke(thinPath);
      ctx.fill(boldPath);

      ctx.restore();
    }

    renderSet();

    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(Math.PI);
    ctx.translate(-w / 2, -h / 2);
    renderSet();
    ctx.restore();
  }

  window.addEventListener("resize", draw);
  draw();
})();
