/**
 * ユーザーがOSレベルでダークモードを好むかどうかをチェックします。
 * @returns {boolean} ダークモードが優先されていれば true、そうでなければ false。
 */
const isDarkModePreferred = () => {
  // window.matchMedia が存在するかどうかをチェックします (古いブラウザのサポートのため)
  if (window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  // matchMedia がサポートされていない場合のフォールバック（デフォルトをライトモードとすることが多い）
  return false;
};
const urlParams = new URLSearchParams(location.search);
// static flag (true に設定すると静的画像を使用)
const staticMode = urlParams.has("static");

/**
 * 静的モードに応じて画像パスを返します。
 * @param {string} baseName 画像のファイル名 (例: "rainbow.svg")
 * @returns {string} 画像へのパス
 */
const getImagePath = (baseName) => {
  if (staticMode) {
    return `./img/static/${baseName}`;
  } else {
    return `./img/animative/${baseName}`;
  }
};

function staticSvgDom(pathes, color, y, length, id) {
  return `
<svg
  class="bg"
  id="svgElem${id}"
  preserveAspectRatio="none"
  viewBox="0 0 100 100"
  version="1.1"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
>
  <defs>
    <linearGradient
      id="line${id}"
      x1="0"
      y1="${y}"
      x2="0"
      y2="${y + length}"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0" stop-color="${color}" stop-opacity="0" />
      <stop offset="0.2" stop-color="${color}" stop-opacity="1" />
      <stop offset="0.9" stop-color="${color}" stop-opacity="1" />
      <stop offset="1" stop-color="${color}" stop-opacity="0" />
    </linearGradient>
  </defs>
  <path
    d="${pathes}"
    style="fill: none; stroke: url(#line${id}); stroke-width: 0.2"
  />
</svg>
`;
}

function animateSvgDom(pathes, color, length, time, id) {
  return `
<svg
  class="bg"
  id="svgElem${id}"
  preserveAspectRatio="none"
  viewBox="0 0 100 100"
  version="1.1"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
>
  <defs>
    <linearGradient
      id="line${id}"
      x1="0"
      y1="${-length}"
      x2="0"
      y2="0"
      gradientUnits="userSpaceOnUse"
    >
      <animate
        attributeName="y1"
        from="${-length}"
        to="100"
        dur="${time / 1000}s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="y2"
        from="0"
        to="${100 + length}"
        dur="${time / 1000}s"
        repeatCount="indefinite"
      />
      <stop offset="0" stop-color="${color}" stop-opacity="0" />
      <stop offset="0.2" stop-color="${color}" stop-opacity="1" />
      <stop offset="0.9" stop-color="${color}" stop-opacity="1" />
      <stop offset="1" stop-color="${color}" stop-opacity="0" />
    </linearGradient>
  </defs>
  <path
    d="${pathes}"
    style="fill: none; stroke: url(#line${id}); stroke-width: 0.2"
  />
</svg>
`;
}
class AnimateLine {
  constructor(id) {
    let size = 100;
    let powerMin = 5;
    let powerMax = 10;
    let length = 25 + Math.random() * 50;
    let time = 4000 + Math.random() * 1000;
    let x = size * Math.random();
    let cy = 0;
    let brightness;
    if (isDarkModePreferred()) {
      brightness = Math.random() * 0.5 + 0.5;
    } else {
      brightness = Math.random() * 0.5;
    }
    let color = `hsl(${Math.random()}turn 100% ${brightness * 100}%)`;
    let pathes = `M${x},0 `;
    for (let i = 0; cy < 100; i++) {
      let y = powerMax + Math.random() * 50;
      cy += y;
      if (i % 2 == 0) {
        pathes += `v${y} `;
      } else {
        let way = Math.random() * (powerMax - powerMin) + powerMin;
        if (Math.random() < 0.5) {
          pathes += `l${way},${y} `;
        } else {
          pathes += `l${-way},${y} `;
        }
      }
    }
    let e = document.createElement("div");
    e.className = "bg";
    e.id = `svgElemBox${id}`;
    e.innerHTML = animateSvgDom(pathes, color, length, time, id);
    document.getElementById("linearBox").appendChild(e);
    setTimeout(() => {
      document.getElementById(`svgElemBox${id}`).remove();
    }, time * 2);
  }
}
class StaticLine {
  constructor(id, pathes, y, length, color) {
    let e = document.createElement("div");
    e.className = "bg";
    e.id = `svgElemBox${id}`;
    for (let i = 0; i < 5; ++i) {
      let ie = document.createElement("div");
      ie.className = "bg";
      ie.innerHTML = staticSvgDom(pathes, color, y, length, `${id}-${i}`);
      ie.style.filter = `blur(${2 ** i}px)`;
      e.append(ie);
    }
    document.getElementById("linearBox").appendChild(e);
  }
}
let id = 0;

function animate() {
  new AnimateLine(id);
  id++;
  console.log(id);
}
function static() {
  const noLineMode = urlParams.has("noline");
  if (noLineMode) return;
  const lineData = [
    // 1. 赤い線 (シンプル)
    {
      pathes: "M10,0 v20 l5,20 v60",
      y: 0,
      length: 60,
      color: "#FF5733",
    },
    // 2. 青い線 (少し斜め)
    {
      pathes: "M30,0 l-5,30 v30 l5,20 v100",
      y: 20,
      length: 70,
      color: "#33A1FF",
    },
    // 3. 緑の線 (S字カーブ風)
    {
      pathes: "M50,0 v10 l-10,30 v20 l10,30 v100",
      y: 50,
      length: 65,
      color: "#33FF57",
    },
    // 4. 黄色の線 (短い)
    {
      pathes: "M75,0 v15 l-3,20 v10",
      y: 50,
      length: 50,
      color: "#FFEB33",
    },
    // 5. 紫の線 (長め、画面右側)
    {
      pathes: "M90,0 l-2,10 v30 l2,20 v100",
      y: 0,
      length: 100,
      color: "#B333FF",
    },
    // 6. 水色の線 (中間)
    {
      pathes: "M75,0 v50 l-2,30 v100",
      y: 25,
      length: 40,
      color: "#33FFE0",
    },
    // 7. オレンジの線 (短く中央寄り)
    {
      pathes: "M60,0 v60 l5,10 v100",
      y: 50,
      length: 40,
      color: "#FF9E33",
    },
  ];

  lineData.forEach((line, index) => {
    // 画面の左右にバランス良く配置し、異なる色、長さ、開始位置を設定
    new StaticLine(index, line.pathes, line.y, line.length, line.color);
  });
}
function main() {
  if (staticMode) {
    static();
  } else {
    setInterval(animate, 1000);
  }
}
window.addEventListener("load", (_) => {
  main();
});
