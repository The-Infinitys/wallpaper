let pixel_width, pixel_height, aspect_ratio;
let params = new URLSearchParams(document.location.search);
const set_ratio = (ratio) => {
  const content = document.querySelector("div.content");
  if (innerWidth / innerHeight > ratio) {
    content.style = `width:auto;height:100%;aspect-ratio:${ratio.toString()};opacity:1;`;
  } else {
    content.style = `width:100%;height:auto;aspect-ratio:${ratio.toString()};opacity:1;`;
  }
};
if (params.has("embed")) {
  if (params.has("ratio")) {
    set_ratio(parseFloat(params.get("ratio")));
  } else {
    const content = document.querySelector("div.content");
    content.style = `width:100%;height:100%;opacity:1;`;
  }
} else {
  const maximize_button = document.createElement("button");
  maximize_button.id = "maximize_button";
  maximize_button.innerHTML = `<h1>START LOADING</h1>`;
  maximize_button.addEventListener("click", () => {
    document.body
      .requestFullscreen()
      .then((maximize_button.style.display = "none"))
      .then(() => {
        pixel_width = innerWidth * devicePixelRatio;
        pixel_height = innerHeight * devicePixelRatio;
        aspect_ratio = pixel_width / pixel_height;
        alert(
          `Complete! Unmaximize Screen!\nScreen Size: ${pixel_width.toString()}, ${pixel_height.toString()}`
        );
      });
  });
  document.body.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement == null) {
      setTimeout(() => {
        set_ratio(aspect_ratio);
      }, 1000);
    }
  });
  document.body.append(maximize_button);
}
