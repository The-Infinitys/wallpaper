let pixel_width, pixel_height, aspect_ratio;
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
    const content = document.querySelector("div.content");
    content.style = `width:auto;height:90vh;aspect-ratio:${aspect_ratio.toString()};opacity:1;`;
  }
});
document.body.append(maximize_button);
