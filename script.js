// mori coffee - script.js
// 必要なインタラクションだけを実装しています。
// 1. スマホ用メニューの開閉  2. スクロール時のヘッダー  3. 画像が無い場合の対策  4. フォームの入力チェック（送信はしません）

document.addEventListener("DOMContentLoaded", () => {
  /* 1. スマホ用メニュー ---------------------------------- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".global-nav");

  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".visually-hidden").textContent = open ? "メニューを閉じる" : "メニューを開く";
    nav.classList.toggle("is-open", open);
  };

  toggle.addEventListener("click", () => {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });
  // リンクを押したら閉じる
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  // Escキーで閉じる
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  /* 2. スクロールしたらヘッダーに境界線 ------------------- */
  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* 3. 画像が読み込めない場合は非表示（背景色の枠が残る） --- */
  document.querySelectorAll(".photo img").forEach((img) => {
    const hide = () => { img.hidden = true; };
    if (img.complete && img.naturalWidth === 0) hide();
    img.addEventListener("error", hide);
  });

  /* 4. お問い合わせフォーム（デモ。メールは送信されない） --- */
  const form = document.getElementById("contact-form");
  const result = document.getElementById("form-result");
  const fields = ["name", "email", "message"];

  const validate = (id) => {
    const input = document.getElementById(id);
    const error = document.getElementById(`${id}-error`);
    const valid = input.checkValidity();
    input.setAttribute("aria-invalid", String(!valid));
    if (!valid) input.setAttribute("aria-describedby", `${id}-error`);
    else input.removeAttribute("aria-describedby");
    error.hidden = valid;
    return valid;
  };

  fields.forEach((id) => {
    document.getElementById(id).addEventListener("blur", () => validate(id));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // 実際の送信は行わない
    const results = fields.map(validate); // すべて検査する
    if (results.includes(false)) {
      form.querySelector('[aria-invalid="true"]').focus();
      result.hidden = true;
      return;
    }
    const data = new FormData(form);
    result.textContent =
      "入力内容の確認（デモのため送信されません）\n" +
      `お名前: ${data.get("name")}\n` +
      `メール: ${data.get("email")}\n` +
      `内容: ${data.get("message")}`;
    result.hidden = false;
  });
});
