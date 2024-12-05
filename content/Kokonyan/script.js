const bg_elem = document.querySelector("div.content");
const create_bubble = () => {
  const bubble_element = document.createElement("img");
  bubble_element.src = "./img/bubble.svg";
  bubble_element.className = "bubble";
  bubble_element.alt = "";
  bubble_element.style.bottom = "0%";
  bubble_element.style.left = "0%";
  bg_elem.appendChild(bubble_element);
  let count=0;
  setInterval(() => {
    count++;
    bubble_element.style.bottom = (count/10).toString() + "%";
    bubble_element.style.left = (count).toString() + "%";
  }, 10);
};
for (let i = 0; i < 10; ++i) {
  setTimeout(() => {
    create_bubble();
  }, 1000 * i);
}
