import "./style.css";
import {
  shell,
  footer,
  bindMenu,
  money,
  esc,
  load,
  save,
  toast,
  modal,
  empty,
  normalize,
} from "./utils.js";
import { products, stockFor, validateCart, totals } from "./model.js";
const stored = load("les-nexo-v1", {});
let cart = Array.isArray(stored?.cart)
  ? stored.cart.filter(
      (i) =>
        products.some(
          (p) => p.id === i.productId && p.variants.includes(i.variant),
        ) &&
        Number.isInteger(i.quantity) &&
        i.quantity > 0,
    )
  : [];
let orders = Array.isArray(stored?.orders)
  ? stored.orders.filter((o) => o && Array.isArray(o.items))
  : [];
let wishlist = Array.isArray(stored?.wishlist) ? stored.wishlist : [];
let coupon = "",
  category = "Todos",
  wishOnly = false;
function persist() {
  save("les-nexo-v1", { cart, orders, wishlist });
}
function art(p) {
  return `<div class="product-art ${p.art}" role="img" aria-label="Ilustración de ${esc(p.name)}">${["keyboard", "headphones"].includes(p.art) ? `<img src="/images/${p.art}.jpg" alt="Fotografía de referencia de ${esc(p.name)}" loading="lazy">` : `<div class="object"></div>`}</div>`;
}
document.querySelector("#app").innerHTML =
  `${shell({ brand: "NEXO / SUPPLY", mark: "N", nav: '<a href="#coleccion">Colección</a><button id="wishlist">Favoritos ♡</button><button id="orders">Mis pedidos</button>', action: '<button class="btn" id="cart">Carrito <span class="count" id="cart-count">0</span></button>' })}<main id="main"><section class="hero store-hero"><div class="store-heading"><h1>Herramientas para<br>tu espacio de trabajo.</h1><p>COLECCIÓN 01 / ESCRITORIO<br>SEIS OBJETOS. USO DIARIO.</p></div><div class="store-feature"><div class="store-feature-image"><img src="/images/studio.jpg" alt="Espacio de trabajo con teclado y computadora" fetchpriority="high"><span>NEXO SUPPLY / ESTUDIO 01</span></div><div class="store-feature-info"><p class="eyebrow">SELECCIÓN DEL ESTUDIO / 01</p><h2>Teclado<br>Forma 65</h2><p>Un formato compacto que deja espacio a lo que necesitas. Dos colores disponibles.</p><strong class="price">$1,290 MXN</strong><button class="btn" data-product="keyboard">Explorar producto ↗</button></div></div><div class="store-caption"><span>DISEÑO FUNCIONAL / OBJETOS DE ESCRITORIO</span><button id="shop-demo">CÓMO PROBAR LA TIENDA ↗</button><a href="#coleccion">VER TODA LA COLECCIÓN ↓</a></div></section><div class="benefit-strip"><span>Envío demo gratis desde $1,500 después de descuento</span><span>Precios de ejemplo en MXN</span><span>Sin cobros reales</span></div><section class="section" id="coleccion"><div class="section-title"><div><p class="eyebrow">LA COLECCIÓN</p><h2 id="collection-title">Colección de escritorio.</h2></div><p>Productos ficticios. Un recorrido de compra completamente interactivo.</p></div><div class="toolbar"><div class="search"><input type="search" id="search" aria-label="Buscar productos" placeholder="Encuentra tu próximo objeto…"></div><select id="sort" aria-label="Ordenar productos"><option value="default">Selección del estudio</option><option value="low">Menor precio</option><option value="high">Mayor precio</option></select></div><div class="chips">${["Todos", "Escritura", "Audio", "Espacio", "Conexión"].map((x, i) => `<button class="chip ${i === 0 ? "active" : ""}" aria-pressed="${i === 0}" data-category="${x}">${x}</button>`).join("")}<button class="chip" id="clear-wishlist" hidden>Ver toda la colección</button></div><p class="hint" style="margin:20px 0" id="result-count" aria-live="polite"></p><div id="product-grid" class="card-grid"></div></section><section class="section alt"><div class="split"><div><p class="eyebrow">COMPRA DE DEMOSTRACIÓN</p><h2>De la selección<br>a tu escritorio.</h2><p style="margin-top:25px;color:var(--muted)">Selecciona variantes, agrega productos al carrito, aplica un cupón y crea un pedido de prueba. Después simula su entrega o cancélalo para devolver las unidades al inventario.</p></div><div class="panel"><h3>Tu primer pedido demo</h3><div class="list-row"><span>01 /</span><strong>Agrega dos productos</strong></div><div class="list-row"><span>02 /</span><strong>Prueba el cupón NEXO10</strong></div><div class="list-row"><span>03 /</span><strong>Confirma con datos ficticios</strong></div><p class="hint" style="margin-top:20px">10% de descuento sobre productos desde $1,500. Envío de muestra: $149 o gratis desde $1,500 después del descuento.</p></div></div></section></main>${footer("Nexo Supply", "les-nexo-v1")}`;
bindMenu();
function updateCount() {
  document.querySelector("#cart-count").textContent = cart.reduce(
    (sum, i) => sum + i.quantity,
    0,
  );
}
function renderProducts() {
  const q = normalize(document.querySelector("#search").value);
  let list = products.filter(
    (p) =>
      (category === "Todos" || p.category === category) &&
      normalize(p.name + " " + p.category).includes(q) &&
      (!wishOnly || wishlist.includes(p.id)),
  );
  const sort = document.querySelector("#sort").value;
  if (sort !== "default")
    list = [...list].sort((a, b) =>
      sort === "low" ? a.price - b.price : b.price - a.price,
    );
  document.querySelector("#collection-title").textContent = wishOnly
    ? "Tu selección personal."
    : "Colección de escritorio.";
  document.querySelector("#clear-wishlist").hidden = !wishOnly;
  document.querySelector("#result-count").textContent =
    `${list.length} productos ${wishOnly ? "guardados" : "encontrados"}`;
  document.querySelector("#product-grid").innerHTML = list.length
    ? list
        .map(
          (p) =>
            `<article class="card"><button class="product-open" data-product="${p.id}" aria-label="Ver ${p.name}">${art(p)}</button><div class="card-content"><span class="badge">${p.category}</span><div class="card-row" style="margin-top:8px"><h3>${p.name}</h3><button class="icon-btn" data-wish="${p.id}" aria-label="${wishlist.includes(p.id) ? "Quitar" : "Guardar"} ${p.name} en favoritos" aria-pressed="${wishlist.includes(p.id)}">${wishlist.includes(p.id) ? "♥" : "♡"}</button></div><p>${p.tag}</p><div class="card-row"><strong class="price">${money(p.price)}</strong><button class="btn small" data-product="${p.id}" ${stockFor(p.id, orders) === 0 ? "disabled" : ""}>${stockFor(p.id, orders) === 0 ? "Agotado" : "Elegir →"}</button></div></div></article>`,
        )
        .join("")
    : empty(
        "No hay productos en esta selección",
        "Prueba otra categoría o guarda productos en favoritos.",
      );
  document
    .querySelectorAll("[data-product]")
    .forEach((b) => (b.onclick = () => productDetail(b.dataset.product)));
  document.querySelectorAll("[data-wish]").forEach(
    (b) =>
      (b.onclick = () => {
        wishlist = wishlist.includes(b.dataset.wish)
          ? wishlist.filter((id) => id !== b.dataset.wish)
          : [...wishlist, b.dataset.wish];
        persist();
        renderProducts();
        toast("Tu selección se ha actualizado.");
      }),
  );
  updateCount();
}
function productDetail(id) {
  const p = products.find((p) => p.id === id);
  const stock = stockFor(id, orders);
  const el = modal(
    p.name,
    `${art(p)}<p class="eyebrow" style="margin-top:25px">${p.category} / PRODUCTO FICTICIO</p><p>${p.description}</p><div class="list-row"><span>Precio de muestra</span><strong class="price">${money(p.price)}</strong></div><div class="list-row"><span>Stock demo disponible</span><strong>${stock} unidades</strong></div>${p.specs.map((s) => `<div class="list-row">${s}</div>`).join("")}<form id="product-form" style="margin-top:25px"><div class="form-grid"><div class="field"><label for="variant">Color</label><select id="variant" name="variant">${p.variants.map((v) => `<option>${v}</option>`).join("")}</select></div><div class="field"><label for="quantity">Cantidad</label><input name="quantity" id="quantity" type="number" min="1" max="${Math.max(1, stock)}" value="1" required></div></div><button class="btn wide" ${stock === 0 ? "disabled" : ""}>Agregar al carrito →</button></form>`,
  );
  el.querySelector("form").onsubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const variant = data.get("variant");
    const quantity = Number(data.get("quantity"));
    const candidate = cart.map((i) => ({ ...i }));
    const item = candidate.find(
      (i) => i.productId === id && i.variant === variant,
    );
    if (item) item.quantity += quantity;
    else candidate.push({ productId: id, variant, quantity });
    try {
      validateCart(candidate, orders);
      cart = candidate;
      persist();
      updateCount();
      el.close();
      toast(`${p.name} agregado al carrito.`);
    } catch (error) {
      toast(error.message);
    }
  };
}
function cartSummary() {
  const t = totals(cart, coupon);
  return `<div class="list-row"><span>Productos</span><strong>${money(t.subtotal)}</strong></div>${t.discount ? `<div class="list-row"><span>Descuento NEXO10</span><strong>−${money(t.discount)}</strong></div>` : ""}<div class="list-row"><span>Envío simulado</span><strong>${t.shipping ? money(t.shipping) : "Gratis"}</strong></div><div class="list-row"><span>Total de muestra</span><strong class="total">${money(t.total)}</strong></div>`;
}
function showCart() {
  if (!cart.length) {
    modal(
      "Tu carrito",
      empty(
        "Todavía está vacío",
        "Explora la colección y agrega un producto para comenzar.",
      ),
    );
    return;
  }
  try {
    totals(cart, coupon);
  } catch {
    coupon = "";
  }
  const el = modal(
    "Tu carrito",
    `${cart
      .map((i, index) => {
        const p = products.find((p) => p.id === i.productId);
        return `<div class="cart-line"><div><h3>${p.name}</h3><p>${esc(i.variant)} · ${money(p.price)}</p></div><div class="quantity"><button data-quantity="${index}" data-delta="-1" aria-label="Reducir cantidad de ${p.name}">−</button><span>${i.quantity}</span><button data-quantity="${index}" data-delta="1" aria-label="Aumentar cantidad de ${p.name}">+</button></div><button class="icon-btn" data-remove="${index}" aria-label="Quitar ${p.name}">×</button></div>`;
      })
      .join(
        "",
      )}<form id="coupon-form" class="coupon-form"><input name="code" aria-label="Código de descuento" placeholder="Cupón de prueba: NEXO10" value="${esc(coupon)}"><button class="btn secondary small" type="submit">Aplicar</button></form><p id="coupon-status" class="hint" role="status">${coupon ? "Cupón NEXO10 aplicado. Puedes vaciar el campo para retirarlo." : "NEXO10: 10% desde $1,500 en productos."}</p><div class="summary">${cartSummary()}</div><button class="btn wide" id="checkout">Continuar a pedido demo →</button><p class="hint" style="margin-top:15px">No se solicita tarjeta y no se realizará un cobro.</p>`,
  );
  el.querySelectorAll("[data-quantity]").forEach(
    (b) =>
      (b.onclick = () => {
        const idx = Number(b.dataset.quantity);
        const candidate = cart.map((i) => ({ ...i }));
        candidate[idx].quantity += Number(b.dataset.delta);
        if (candidate[idx].quantity === 0) candidate.splice(idx, 1);
        try {
          if (candidate.length) validateCart(candidate, orders);
          cart = candidate;
          persist();
          updateCount();
          showCart();
        } catch (error) {
          toast(error.message);
        }
      }),
  );
  el.querySelectorAll("[data-remove]").forEach(
    (b) =>
      (b.onclick = () => {
        cart.splice(Number(b.dataset.remove), 1);
        persist();
        updateCount();
        showCart();
      }),
  );
  el.querySelector("#coupon-form").onsubmit = (e) => {
    e.preventDefault();
    const code = e.currentTarget.code.value.trim().toUpperCase();
    try {
      totals(cart, code);
      coupon = code;
      showCart();
    } catch (error) {
      el.querySelector("#coupon-status").textContent = error.message;
    }
  };
  el.querySelector("#checkout").onclick = checkout;
}
function checkout() {
  try {
    validateCart(cart, orders);
  } catch (error) {
    toast(error.message);
    return;
  }
  const el = modal(
    "Pedido de prueba",
    `<span class="badge">CHECKOUT SIMULADO / SIN PAGO</span><p style="margin-top:16px">Utiliza los datos de ejemplo. No se enviará mercancía, correo ni información a un servidor.</p><form id="checkout-form" style="margin-top:25px"><div class="form-grid"><div class="field"><label for="customer">Nombre de prueba</label><input id="customer" name="customer" value="Cliente demo" maxlength="80" required></div><div class="field"><label for="customer-email">Correo de prueba</label><input id="customer-email" name="email" type="email" value="cliente@example.com" maxlength="120" required></div></div><div class="field"><label for="address">Dirección ficticia</label><input name="address" id="address" value="Avenida Demo 123" maxlength="180" required></div><div class="form-grid"><div class="field"><label for="city">Ciudad de prueba</label><input name="city" id="city" value="Cancún" maxlength="80" required></div><div class="field"><label for="postal">Código postal de prueba</label><input name="postal" id="postal" value="77500" pattern="[0-9]{5}" inputmode="numeric" maxlength="5" required></div></div><div class="summary">${cartSummary()}</div><label class="demo-check"><input type="checkbox" name="acknowledge" required> Entiendo que este pedido es una demostración sin compra real.</label><button class="btn wide" type="submit">Confirmar pedido demo →</button></form>`,
  );
  el.querySelector("form").onsubmit = (e) => {
    e.preventDefault();
    try {
      validateCart(cart, orders);
      const data = new FormData(e.currentTarget);
      const customer = String(data.get("customer")).trim();
      const address = String(data.get("address")).trim();
      const city = String(data.get("city")).trim();
      if (!customer || !address || !city)
        throw new Error("Completa los datos de prueba.");
      const order = {
        id: crypto.randomUUID(),
        date: new Date().toLocaleDateString("es-MX"),
        status: "Preparando",
        customer,
        items: cart.map((i) => ({ ...i })),
        totals: totals(cart, coupon),
      };
      orders.unshift(order);
      cart = [];
      coupon = "";
      persist();
      renderProducts();
      modal(
        "Pedido demo confirmado",
        `<span class="badge">SIN COBRO REAL</span><h3>Gracias, ${esc(customer)}.</h3><p>Tu referencia de prueba es <strong>NX-${order.id.slice(0, 8).toUpperCase()}</strong>.</p><div class="summary"><div class="list-row"><span>Total simulado</span><strong>${money(order.totals.total)}</strong></div><div class="list-row"><span>Estado</span><strong>Preparando</strong></div></div><p>Revisa Mis pedidos para simular el envío, completar la entrega o cancelar antes del envío. Los datos de dirección y correo no se guardan.</p>`,
      );
    } catch (error) {
      toast(error.message);
    }
  };
}
function showOrders() {
  const el = modal(
    "Mis pedidos demo",
    orders.length
      ? orders
          .map(
            (o) =>
              `<div class="panel" style="margin-bottom:18px"><span class="badge">${esc(o.status)}</span><h3>NX-${esc(o.id.slice(0, 8).toUpperCase())}</h3><p>${esc(o.date)} · ${esc(o.customer)}</p>${o.items
                .map((i) => {
                  const p = products.find((p) => p.id === i.productId);
                  return `<div class="list-row"><span>${esc(p?.name || "Producto")} · ${esc(i.variant)}</span><strong>×${i.quantity}</strong></div>`;
                })
                .join(
                  "",
                )}<div class="list-row"><span>Total de muestra</span><strong>${money(o.totals.total)}</strong></div><div class="card-row">${o.status === "Preparando" ? `<button class="btn secondary small" data-cancel="${esc(o.id)}">Cancelar pedido</button><button class="btn small" data-next="${esc(o.id)}">Simular envío →</button>` : o.status === "En camino" ? `<span class="hint">Envío ficticio</span><button class="btn small" data-next="${esc(o.id)}">Simular entrega ✓</button>` : '<span class="hint">Recorrido de prueba terminado</span>'}</div></div>`,
          )
          .join("")
      : empty(
          "No hay pedidos todavía",
          "Completa un checkout de prueba para ver el seguimiento.",
        ),
  );
  el.querySelectorAll("[data-cancel]").forEach(
    (b) =>
      (b.onclick = () => {
        const order = orders.find((o) => o.id === b.dataset.cancel);
        if (order.status !== "Preparando") return;
        order.status = "Cancelado";
        persist();
        renderProducts();
        showOrders();
        toast("Pedido cancelado. Stock de muestra restaurado.");
      }),
  );
  el.querySelectorAll("[data-next]").forEach(
    (b) =>
      (b.onclick = () => {
        const order = orders.find((o) => o.id === b.dataset.next);
        order.status =
          order.status === "Preparando" ? "En camino" : "Entregado";
        persist();
        showOrders();
      }),
  );
}
document.querySelector("#cart").onclick = showCart;
document.querySelector("#orders").onclick = showOrders;
document.querySelector("#wishlist").onclick = () => {
  wishOnly = true;
  renderProducts();
  document.querySelector("#coleccion").scrollIntoView();
};
document.querySelector("#clear-wishlist").onclick = () => {
  wishOnly = false;
  renderProducts();
};
document.querySelector("#shop-demo").onclick = () =>
  modal(
    "Una compra completa, de prueba",
    '<p>Esta tienda utiliza productos e inventario ficticios. Puedes guardar favoritos, elegir colores, modificar cantidades, aplicar NEXO10 y simular un pedido. El inventario disminuye al confirmar y se restaura al cancelar.</p><p class="notice">No hay pasarela de pago, envíos ni cuentas reales. Todo se conserva en este dispositivo.</p>',
  );
document.querySelector("#search").oninput = renderProducts;
document.querySelector("#sort").onchange = renderProducts;
document.querySelectorAll("[data-category]").forEach(
  (b) =>
    (b.onclick = () => {
      category = b.dataset.category;
      document.querySelectorAll("[data-category]").forEach((x) => {
        x.classList.toggle("active", x === b);
        x.setAttribute("aria-pressed", x === b);
      });
      renderProducts();
    }),
);
renderProducts();
