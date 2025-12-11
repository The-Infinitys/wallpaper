function main() {
  // --- 既存のCanvas/Context設定 ---
  const canvas = document.getElementById("linear");
  const ctx = canvas.getContext("2d");
  let W = window.innerWidth;
  let H = window.innerHeight;

  // Canvasサイズをウィンドウリサイズに追従させる
  window.addEventListener("resize", () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  });
  // 初期サイズ設定
  canvas.width = W;
  canvas.height = H;

  // --- FlowingLine クラスの定義 (前回の回答のコードを流用) ---

  /**
   * 0.0から1.0の範囲の数値ペア ([x, y]タプル) を 1〜3個含む配列を生成する関数。
   */
  function generateRandomTuples() {
    const result = [];
    let cy = 0;
    let c = 0;
    let cx = 0;
    while (cy < 1) {
      cy += Math.random();
      const x = cx;
      const y = cy;
      result.push([x, y]);
      if (cx % 2 == 1) {
        cx += Math.random() * 0.2;
      }
      c++;
    }
    if (cx % 2 == 0) {
      const x = cx;
      const y = 1;
      result.push([x, y]);
    }
    return result;
  }

  // 2. 線（ストリーム）のクラス定義
  class FlowingLine {
    constructor() {
      this.x = Math.random();
      // 初期Y座標を画面外（上端）に設定
      this.height = Math.random() * 0.1 + 0.5; // 高さ
      this.y = -this.height; // 画面外に初期配置

      this.speed = Math.random() * 0.005 + 0.005;
      this.points = generateRandomTuples();
      this.width = Math.random() * 0.2 + 0.1;

      // ランダムな色を設定
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      this.color = `rgb(${r}, ${g}, ${b})`;
      this.transparentColor = `rgba(${r}, ${g}, ${b}, 0)`;
    }

    update() {
      this.y += this.speed;
    }

    // ストリームが完全に画面外に出たかどうかを判定
    isFinished() {
      return this.y > 1.0;
    }

    render(ctx) {
      const minY_rel = this.y;
      const maxY_rel = this.y + this.height;
      const midY_rel = minY_rel + 0.1;

      let posList = this.points.map(([x_rel, y_rel]) => {
        const y_abs = this.y + y_rel;
        const x_abs = this.x + (x_rel - 0.5) * this.width;
        return [x_abs, y_abs];
      });

      posList.unshift([this.x, minY_rel]);
      posList.push([this.x, maxY_rel]);

      posList.sort((_, b) => b[1]);

      posList = posList.map(([x, y]) => {
        let newY = y;
        if (newY > maxY_rel) {
          newY = maxY_rel;
        }
        if (newY < minY_rel) {
          newY = minY_rel;
        }
        return [x, newY - this.y];
      });

      const uniquePointsMap = new Map();
      posList.forEach(([x, y]) => {
        uniquePointsMap.set(y, [x, y]);
      });
      posList = Array.from(uniquePointsMap.values()).sort(
        (a, b) => a[1] - b[1]
      );

      // --- グラデーションの作成と適用 ---
      const minY_px = minY_rel * H;
      const maxY_px = maxY_rel * H;

      const gradient = ctx.createLinearGradient(0, minY_px, 0, maxY_px);

      gradient.addColorStop(0, this.transparentColor);

      const midPointStop = (midY_rel - minY_rel) / this.height;
      const stopPosition = Math.min(midPointStop, 1.0);

      gradient.addColorStop(stopPosition, this.color);

      if (stopPosition < 1.0) {
        gradient.addColorStop(1.0, this.color);
      }

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;

      // --- 描画処理 ---
      ctx.beginPath();

      posList.forEach(([x_rel, y_rel], index) => {
        const x_abs_px = x_rel * W;
        const y_abs_px = y_rel * H;

        if (index === 0) {
          ctx.moveTo(x_abs_px, y_abs_px);
        } else {
          ctx.lineTo(x_abs_px, y_abs_px);
        }
      });

      ctx.stroke();
    }
  }

  // --- アニメーション制御部分 ---

  /** @type {FlowingLine[]} */
  let lines = []; // ストリームを格納する配列
  let lastSpawnTime = 0;
  // ストリームを生成する最小・最大間隔（ミリ秒）
  const MIN_SPAWN_INTERVAL = 100;
  const MAX_SPAWN_INTERVAL = 800;
  let nextSpawnInterval =
    Math.random() * (MAX_SPAWN_INTERVAL - MIN_SPAWN_INTERVAL) +
    MIN_SPAWN_INTERVAL;

  /**
   * 新しいストリームをランダムなタイミングで生成する
   * @param {number} currentTime - requestAnimationFrameが提供するタイムスタンプ
   */
  function spawnLine(currentTime) {
    if (currentTime - lastSpawnTime > nextSpawnInterval) {
      lines.push(new FlowingLine());
      lastSpawnTime = currentTime;
      // 次のスポーン間隔をランダムに決定
      nextSpawnInterval =
        Math.random() * (MAX_SPAWN_INTERVAL - MIN_SPAWN_INTERVAL) +
        MIN_SPAWN_INTERVAL;
    }
  }

  /**
   * メインのアニメーションループ
   * @param {number} currentTime - requestAnimationFrameが提供するタイムスタンプ
   */
  function animate(currentTime) {
    // 1. キャンバスをクリア
    ctx.clearRect(0, 0, W, H);

    // 2. ストリームの生成
    spawnLine(currentTime);

    // 3. ストリームの更新と描画
    // 逆順に処理することで、削除時にインデックスが狂うのを防ぐ (spliceを使用する場合)
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i];
      line.update();
      line.render(ctx);
      lines = lines.filter((line) => !line.isFinished());
    }

    // ループを継続
    requestAnimationFrame(animate);
  }

  // アニメーションを開始
  requestAnimationFrame(animate);
}
window.addEventListener("load", (_) => {
  main();
});
