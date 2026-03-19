let pixel_width = null;
let pixel_height = null;
let aspect_ratio = null;
let params = new URLSearchParams(document.location.search);
const content = document.querySelector("div.content");

// 1. set_ratio 関数を外部で定義（再利用するため）
const set_ratio = (ratio) => {
  
  // 渡されたratioを、コンテンツの目標アスペクト比としてaspect_ratioに設定
  aspect_ratio = ratio; 

  let content_width;
  let content_height;

  // コンテンツを画面にフィットさせるロジック
  if (innerWidth / innerHeight > ratio) {
    // 画面が横長すぎるとき：高さを100%にし、幅はratioに基づいて決定
    content_width = innerHeight * ratio;
    content_height = innerHeight;
    content.style = `width:auto;height:100%;aspect-ratio:${ratio.toString()};opacity:1;`;
  } else {
    // 画面が縦長すぎるとき：幅を100%にし、高さはratioに基づいて決定
    content_width = innerWidth;
    content_height = innerWidth / ratio;
    content.style = `width:100%;height:auto;aspect-ratio:${ratio.toString()};opacity:1;`;
  }

  // content_widthとcontent_heightはCSSピクセル値であるため、
  // devicePixelRatioを乗算して物理ピクセル値に変換し、グローバル変数に設定
  pixel_width = content_width * devicePixelRatio;
  pixel_height = content_height * devicePixelRatio;
  
};

// 2. デバウンス関数を定義 (変更なし)
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

if (params.has("embed")) {
  if (params.has("ratio")) {
    const ratio = parseFloat(params.get("ratio"));
    
    // 初回実行: set_ratio内でグローバル変数が更新される
    set_ratio(ratio);

    // リサイズイベントにデバウンスを適用して処理を追加
    const debouncedSetRatio = debounce(() => set_ratio(ratio), 100); 
    window.addEventListener("resize", debouncedSetRatio);

  } else {
    // ratioがない場合 (embed = 全画面表示を意図)
    content.style = `width:100%;height:100%;opacity:1;`;
    
    // 全画面表示なので、ビューポート全体の値で更新
    pixel_width = innerWidth * devicePixelRatio;
    pixel_height = innerHeight * devicePixelRatio;
    aspect_ratio = innerWidth / innerHeight;
  }
} else {
  // フルスクリーン関連の処理 (変更なし)
  const maximize_button = document.createElement("button");
  maximize_button.id = "maximize_button";
  maximize_button.innerHTML = `<h1>START LOADING</h1>`;
  maximize_button.addEventListener("click", () => {
    document.body
      .requestFullscreen()
      .then((maximize_button.style.display = "none"))
      .then(() => {
        // フルスクリーンになった時点で変数は更新される
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
        // フルスクリーン解除時: set_ratio内でグローバル変数が更新される
        // この場合のaspect_ratioは、フルスクリーン解除前のサイズが保持している
        set_ratio(aspect_ratio); 
      }, 1000);
    }
  });
  document.body.append(maximize_button);
}