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
function svg(pathes, color, length, time, id) {
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
class Line {
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
    e.innerHTML = svg(pathes, color, length, time, id);
    document.getElementById("linearBox").appendChild(e);
    setTimeout(() => {
      document.getElementById(`svgElemBox${id}`).remove();
    }, time * 2);
  }
}
let id = 0;

function animate() {
  new Line(id);
  id++;
  console.log(id);
}

function main() {
  setInterval(animate, 100);
}
window.addEventListener("load", (_) => {
  main();
});
