const bg_elem = document.querySelector("div.content");
const create_bubble = () => {
  const bubble_element = document.createElement("img");
  bubble_element.src = "./img/bubble.svg";
  bubble_element.className = "bubble";
  bubble_element.alt = "";
  bubble_element.style.bottom = "0%";
  bubble_element.style.left = "0%";
  bg_elem.appendChild(bubble_element);
  let count = 0;
  let stroke_speed = 1 + 2 * Math.random();
  let stroke_width = 1 + 2 * Math.random();
  let stroke_left = 2 * Math.random() - 1;
  let float_speed = 1 + 2 * Math.random();
  setInterval(() => {
    count++;
    const bubble_height = 110 - (float_speed * count) / 10;
    if (bubble_height <= -20) {
      count = 0;
      stroke_speed = 1 + 2 * Math.random();
      stroke_width = 1 + 2 * Math.random();
      stroke_left = 2 * Math.random() - 1;
      float_speed = 1 + 2 * Math.random();
    }
    bubble_element.style.top = bubble_height.toString() + "%";
    bubble_element.style.left =
      (
        80 +
        10 * stroke_left +
        2 * stroke_width * Math.sin((stroke_speed * count) / 50)
      ).toString() + "%";
  }, 10);
};
for (let i = 0; i < 10; ++i) {
  setTimeout(() => {
    create_bubble();
  }, 1000 * i);
}
