(function () {
  const canvas = document.getElementById("spaceCanvas");
  const ctx = canvas.getContext("2d");

  let w, h, cx, cy;
  let stars = [];
  let time = 0;

  // --- 設定：密度と連結性を最大化 ---
  const STAR_COUNT = 5000; // 密度をさらにアップ
  const SPEED = 0.005; // 流れの速さ
  const INFINITY_SCALE = 380; // ♾のサイズ
  const PERSPECTIVE = 500;

  const COLORS = [
    { r: 140, g: 190, b: 255 },
    { r: 210, g: 160, b: 255 },
    { r: 255, g: 255, b: 255 },
  ];

  class Star {
    constructor(index) {
      this.index = index;

      // 太さを極限まで絞る
      const dist = Math.pow(Math.random(), 4);
      const angle = Math.random() * Math.PI * 2;
      this.offsetX = Math.cos(angle) * dist * 30;
      this.offsetY = Math.sin(angle) * dist * 30;
      this.offsetZ = (Math.random() - 0.5) * 30;

      const col = COLORS[index % COLORS.length];
      this.color = `${col.r}, ${col.g}, ${col.b}`;
      this.size = Math.random() * 0.7 + 0.3;
    }

    update() {
      // --- 修正：途切れをなくすための正規化 ---
      // 全STAR_COUNTで 2π(一周) を完璧に分担し、そこに time を足す
      const segment = (this.index / STAR_COUNT) * Math.PI * 2;
      const t = segment + time;

      const denom = 1 + Math.pow(Math.sin(t), 2);
      const baseX = (INFINITY_SCALE * Math.cos(t)) / denom;
      const baseY = (INFINITY_SCALE * Math.sin(t) * Math.cos(t)) / denom;
      const baseZ = Math.sin(t * 2) * 150;

      this.x = baseX + this.offsetX;
      this.y = baseY + this.offsetY;
      this.z = baseZ + this.offsetZ + 300;
    }

    draw() {
      const scale = PERSPECTIVE / (PERSPECTIVE + this.z);
      const px = this.x * scale + cx;
      const py = this.y * scale + cy;

      if (px < 0 || px > w || py < 0 || py > h) return;

      const alpha = Math.max(0, 1 - this.z / 1300);
      ctx.fillStyle = `rgba(${this.color}, ${alpha * 0.7})`;

      const r = this.size * scale * 1.5;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function init() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push(new Star(i));
    }
  }

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    w = canvas.width = window.innerWidth * dpr;
    h = canvas.height = window.innerHeight * dpr;
    cx = w / 2;
    cy = h / 2;
  }

  function render() {
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";

    stars.forEach((star) => {
      star.update();
      star.draw();
    });

    time += SPEED; // 全体の位置を一斉にずらす
    requestAnimationFrame(render);
  }

  window.addEventListener("resize", resize);
  resize();
  init();
  render();
})();
