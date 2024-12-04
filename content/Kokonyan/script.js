const bg_elem = document.querySelector("div.content");
const create_bubble = () => {
  const bubble_element = document.createElement("img");
  bubble_element.src = "./img/bubble.svg";
  bubble_element.className = "bubble";
  bubble_element.alt = "";
  bubble_element.style.top = "50%";
  bubble_element.style.left = "50%";
  bg_elem.appendChild(bubble);
  setTimeout(() => {
    bubble_element.remove();
  }, 1000);
};
setInterval(() => {
  create_bubble();
}, 1000);
