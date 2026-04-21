(function () {
  const canvas = document.getElementById("gradientCanvas");
  const ctx = canvas.getContext("2d");

  const ORB_COUNT = 12; // オーブの数（つなぎ目が滑らかになるよう調整）
  const BASE_BG_COLOR = "#010102";
  const SPEED_FACTOR = 0.15; // 背景なので少しゆったり動かす
  let time = 0;

  function hsvToRgb(h, s, v) {
    const f = (n) => {
      const k = (n + h * 6) % 6;
      return v - v * s * Math.max(0, Math.min(1, Math.min(k, 4 - k)));
    };
    return {
      r: Math.floor(f(5) * 255),
      g: Math.floor(f(3) * 255),
      b: Math.floor(f(1) * 255),
    };
  }

  function draw() {
    const pixelRatio = window.devicePixelRatio || 1;
    if (canvas.width !== window.innerWidth * pixelRatio) {
      canvas.width = window.innerWidth * pixelRatio;
      canvas.height = window.innerHeight * pixelRatio;
    }

    const w = canvas.width;
    const h = canvas.height;
    const center = { x: w / 2, y: h / 2 };

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = BASE_BG_COLOR;
    ctx.fillRect(0, 0, w, h);

    ctx.globalCompositeOperation = "lighter";
    ctx.filter = "blur(60px)"; // つぶつぶ感を消しつつ、色を混ぜる

    for (let i = 0; i < ORB_COUNT; i++) {
      // --- ♾ 軌道計算 (space.js と同期) ---
      // 0〜2πの間で均等に配置
      const segment = (i / ORB_COUNT) * Math.PI * 2;
      const t = segment + time;

      const INFINITY_SCALE = w * 0.35; // 画面サイズに合わせる
      const denom = 1 + Math.pow(Math.sin(t), 2);
      const x = center.x + (INFINITY_SCALE * Math.cos(t)) / denom;
      const y = center.y + (INFINITY_SCALE * Math.sin(t) * Math.cos(t)) / denom;

      // 色相の設定
      const hue = (i / ORB_COUNT + time * 0.05) % 1.0;

      // --- 調整箇所: 濃度を濃くする (V: 0.15 -> 0.3) ---
      const rgb = hsvToRgb(hue, 1.0, 0.3);

      // 半径を大きくして、隣り合うオーブと重なりやすくする
      const glowRadius = w * 0.5;

      const grad = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
      const c = `${rgb.r}, ${rgb.g}, ${rgb.b}`;

      // --- 調整箇所: アルファ値を上げて濃度を濃く ---
      grad.addColorStop(0, `rgba(${c}, 0.5)`); // 中心 (0.3 -> 0.5)
      grad.addColorStop(0.3, `rgba(${c}, 0.15)`); // 中間 (0.1 -> 0.15)
      grad.addColorStop(1, `rgba(${c}, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.filter = "none";
    time += 0.016 * SPEED_FACTOR;
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
    canvas.height = window.innerHeight * (window.devicePixelRatio || 1);
  });

  draw();
})();
