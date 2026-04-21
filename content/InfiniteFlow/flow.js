(function () {
  const canvas = document.getElementById("flowCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let w, h, cx, cy;
  let objects = [];

  const OBJ_COUNT = 40;
  const CAMERA_Z = 800;
  const MAX_Z = 3500;

  class Polyhedron {
    constructor(index) {
      this.index = index;
      this.init(true);
    }

    init(firstTime = false) {
      // 散らばり具合を「画面内に収まりやすい」範囲に再調整
      const isCore = this.index % 3 === 0;

      if (isCore) {
        this.x = (Math.random() - 0.5) * w * 1.5;
        this.y = (Math.random() - 0.5) * h * 1.5;
        this.size = (Math.random() * 0.08 + 0.04) * Math.min(w, h);
      } else {
        // 周辺のものも、あまり遠くに行きすぎないように
        this.x = (Math.random() - 0.5) * w;
        this.y = (Math.random() - 0.5) * h;
        this.size = (Math.random() * 0.03 + 0.01) * Math.min(w, h);
      }

      this.z = firstTime ? (this.index / OBJ_COUNT) * MAX_Z : MAX_Z;
      this.rotX = Math.random() * Math.PI;
      this.rotY = Math.random() * Math.PI;
      this.vRotX = (Math.random() - 0.5) * 0.01;
      this.vRotY = (Math.random() - 0.5) * 0.01;

      this.vertices = [
        [0, 1, 0],
        [0, -1, 0],
        [1, 0, 0],
        [-1, 0, 0],
        [0, 0, 1],
        [0, 0, -1],
      ];
      this.edges = [
        [0, 2],
        [0, 3],
        [0, 4],
        [0, 5],
        [1, 2],
        [1, 3],
        [1, 4],
        [1, 5],
        [2, 4],
        [4, 3],
        [3, 5],
        [5, 2],
      ];
    }

    update() {
      const speedBase = this.index % 3 === 0 ? 1.2 : 0.6;
      this.z -= speedBase;
      this.rotX += this.vRotX;
      this.rotY += this.vRotY;

      if (this.z < -400) this.init(false);
      this.currentScale =
        CAMERA_Z / (CAMERA_Z + Math.max(-CAMERA_Z + 1, this.z));
    }

    draw() {
      let alpha = 0;
      // 遠くから徐々に現れ、手前で消えるフェード
      if (this.z > 0) {
        alpha = Math.min(0.12, (MAX_Z - this.z) / 1500) * 0.6;
      } else {
        alpha = Math.max(0, (0.08 * (400 + this.z)) / 400);
      }

      if (alpha <= 0.005) return; // あまりに薄い場合は計算スキップ

      ctx.beginPath();
      // --- ポイント：加算合成を意識した少し明るい青灰色 ---
      ctx.strokeStyle = `rgba(180, 210, 255, ${alpha})`;
      ctx.lineWidth = 0.6;

      this.edges.forEach((edge) => {
        const p1 = this.project(this.vertices[edge[0]]);
        const p2 = this.project(this.vertices[edge[1]]);
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
      });
      ctx.stroke();
    }

    project(v) {
      let x = v[0],
        y = v[1],
        z = v[2];
      let sX = Math.sin(this.rotX),
        cX = Math.cos(this.rotX);
      let ny = y * cX - z * sX;
      let nz = y * sX + z * cX;
      y = ny;
      z = nz;
      let sY = Math.sin(this.rotY),
        cY = Math.cos(this.rotY);
      let nx = x * cY + z * sY;
      x = nx;
      return {
        x: x * this.size * this.currentScale + cx,
        y: y * this.size * this.currentScale + cy,
      };
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

    // 加算合成を有効にして、背景が暗くても色が死なないようにする
    ctx.globalCompositeOperation = "lighter";

    objects.forEach((obj) => {
      obj.update();
      obj.draw();
    });

    requestAnimationFrame(render);
  }

  window.addEventListener("resize", resize);
  resize();

  objects = [];
  for (let i = 0; i < OBJ_COUNT; i++) {
    objects.push(new Polyhedron(i));
  }

  render();
})();
