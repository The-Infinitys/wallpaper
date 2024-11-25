const maximize_button = document.createElement("button");
maximize_button.id = "maximize_button";
maximize_button.innerHTML = `<h1>MAXIMIZER!</h1>`;
maximize_button.addEventListener("click", () => {
  if (maximize_button.innerHTML == "<h1>MAXIMIZER!</h1>") {
    document.body.requestFullscreen();
    maximize_button.style.display = "none";
    setTimeout(() => {
      maximize_button.innerHTML = "<h1>?UNMAXIMIZE?</h1>";
      maximize_button.style.display = "";
    }, 5 * 1000);
  } else {
    try {
      document.body.exitFullscreen();
    } catch (error) {
      console.info(error);
    }
    maximize_button.innerHTML = "<h1>MAXIMIZER!</h1>";
  }
});
document.body.append(maximize_button);
