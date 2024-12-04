let params = new URLSearchParams(document.location.search);
if (params.has("embed")) {
  const content = document.querySelector("div.content");
  if (params.has("ratio")){
    if (innerWidth/innerHeight>parseFloat(params.get("ratio"))){
      content.style = `width:auto;height:100%;aspect-ratio:${params.get("ratio")};opacity:1;`;
    }else{
      content.style = `width:100%;height:auto;aspect-ratio:${params.get("ratio")};opacity:1;`;
    }
  }else{
    content.style = `width:100%;height:100%;opacity:1;`;
  }
} else {
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
      if (innerWidth/innerHeight>aspect_ratio)){
        content.style = `width:auto;height:100%;aspect-ratio:${aspect_ratio};opacity:1;`;
      }else{
        content.style = `width:100%;height:auto;aspect-ratio:${aspect_ratio};opacity:1;`;
      }
    }
  });
  document.body.append(maximize_button);
}
