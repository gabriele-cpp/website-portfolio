const button = document.querySelector("button");
const nav = document.querySelector("nav");
const menuStyle = document.createElement("style");
menuStyle.textContent =
  "@media(max-width:800px){header nav.open{display:grid;position:fixed;top:74px;left:0;width:100%;padding:20px 6vw;background:#000;border-bottom:4px solid #e22718;gap:0}header nav.open a{padding:14px 0;border-bottom:1px solid #3c3c3c;font-size:18px;color:#fff}}";
document.head.appendChild(menuStyle);
button.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  button.setAttribute("aria-expanded", open);
});
