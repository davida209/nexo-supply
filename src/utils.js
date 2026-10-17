export const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export const money = (n) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n);
export function load(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value === null ? fallback : value;
  } catch {
    return fallback;
  }
}
export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    toast(
      "El navegador no permite guardar datos. Se conservarán durante esta sesión.",
    );
    return false;
  }
}
export function toast(message) {
  let el = document.querySelector("#toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.setAttribute("role", "status");
    document.body.append(el);
  }
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(el.timer);
  el.timer = setTimeout(() => el.classList.remove("show"), 4000);
}
export function modal(title, content) {
  let el = document.querySelector("#modal");
  if (!el) {
    el = document.createElement("dialog");
    el.id = "modal";
    document.body.append(el);
    el.addEventListener("click", (e) => {
      if (e.target === el) {
        const r = el.getBoundingClientRect();
        if (
          e.clientX < r.left ||
          e.clientX > r.right ||
          e.clientY < r.top ||
          e.clientY > r.bottom
        )
          el.close();
      }
    });
  }
  el.innerHTML = `<div class="modal-head"><h2 id="modal-title">${esc(title)}</h2><button class="icon-btn" id="close-modal" aria-label="Cerrar">✕</button></div>${content}`;
  el.setAttribute("aria-labelledby", "modal-title");
  el.querySelector("#close-modal").onclick = () => el.close();
  if (!el.open) el.showModal();
  el.querySelector("#close-modal").focus();
  return el;
}
export function shell({ brand, mark, nav, action = "", dark = false }) {
  return `<a class="skip" href="#main">Saltar al contenido</a><div class="demo-bar"><span>PORTAFOLIO / LESTER DAVID</span><span>DEMO INTERACTIVA · DATOS LOCALES</span></div><header class="header ${dark ? "dark" : ""}"><a class="brand" href="#"><span class="brand-mark">${mark}</span>${brand}</a><button class="menu-btn" aria-label="Abrir navegación" aria-expanded="false" aria-controls="navigation">☰</button><nav id="navigation">${nav}${action}</nav></header>`;
}
export function footer(brand, key) {
  return `<footer><div><strong>${brand}</strong><p>Una demo de Lester David Uicab Gongora.</p></div><p>Datos de ejemplo · Sin transacciones reales<br><a href="https://portfoliolester.vercel.app/" target="_blank" rel="noopener noreferrer">Ver portafolio ↗</a><br><button class="reset-demo" data-reset="${esc(key)}">Reiniciar demo</button></p></footer>`;
}
export function bindMenu() {
  const reset = document.querySelector("[data-reset]");
  if (reset)
    reset.onclick = () => {
      const el = modal(
        "Reiniciar demo",
        '<p>Se quitarán los datos de prueba guardados por esta demo en este navegador. Los otros proyectos no se verán afectados.</p><div class="card-row"><button class="btn secondary" id="keep-demo">Conservar mis datos</button><button class="btn" id="reset-confirm">Restablecer datos de prueba</button></div>',
      );
      el.querySelector("#keep-demo").onclick = () => el.close();
      el.querySelector("#reset-confirm").onclick = () => {
        try {
          localStorage.removeItem(reset.dataset.reset);
          location.reload();
        } catch {
          toast("El navegador no permite restablecer el almacenamiento.");
        }
      };
    };
  const b = document.querySelector(".menu-btn");
  if (!b) return;
  b.onclick = () => {
    const state = b.getAttribute("aria-expanded") !== "true";
    b.setAttribute("aria-expanded", state);
    document.querySelector("nav").classList.toggle("open", state);
  };
  document.querySelectorAll("nav a").forEach((a) =>
    a.addEventListener("click", () => {
      b.setAttribute("aria-expanded", "false");
      document.querySelector("nav").classList.remove("open");
    }),
  );
}
export function empty(title, description) {
  return `<div class="empty"><span>◇</span><h3>${esc(title)}</h3><p>${esc(description)}</p></div>`;
}
export function normalize(s) {
  return String(s)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
