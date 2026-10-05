const button = document.querySelector("button");
const nav = document.querySelector("nav");

button.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  button.setAttribute("aria-expanded", open);
});

// Tutup menu otomatis saat salah satu link diklik
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    button.setAttribute("aria-expanded", "false");
  });
});
