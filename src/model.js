export const products = [
  {
    id: "keyboard",
    name: "Teclado Forma 65",
    category: "Escritura",
    price: 1290,
    stock: 8,
    art: "keyboard",
    tag: "El centro de tu escritorio",
    description:
      "Formato compacto, distribución de muestra y una presencia limpia para tus sesiones de trabajo.",
    variants: ["Marfil", "Grafito"],
    specs: [
      "Formato compacto 65%",
      "Conexión USB-C de muestra",
      "Teclas de perfil bajo",
    ],
  },
  {
    id: "headphones",
    name: "Audífonos Aura",
    category: "Audio",
    price: 1890,
    stock: 6,
    art: "headphones",
    tag: "Encuentra tu enfoque",
    description:
      "Una propuesta de audífonos para acompañar el trabajo, el estudio y tus pausas favoritas.",
    variants: ["Azul noche", "Grafito"],
    specs: [
      "Diseño circumaural",
      "Control lateral de muestra",
      "Almohadillas suaves",
    ],
  },
  {
    id: "lamp",
    name: "Lámpara Lumen",
    category: "Espacio",
    price: 790,
    stock: 10,
    art: "lamp",
    tag: "La luz justa",
    description:
      "Un punto de luz que acompaña tu escritorio con una silueta tranquila y funcional.",
    variants: ["Oliva", "Arena"],
    specs: [
      "Iluminación LED de muestra",
      "Base compacta",
      "Brazo de sobremesa",
    ],
  },
  {
    id: "hub",
    name: "Hub Nodo 6",
    category: "Conexión",
    price: 690,
    stock: 12,
    art: "hub",
    tag: "Todo en su lugar",
    description:
      "Un concepto de concentrador para conectar los accesorios que necesitas cada día.",
    variants: ["Plata", "Grafito"],
    specs: ["6 conexiones de muestra", "Cuerpo compacto", "Conector USB-C"],
  },
  {
    id: "stand",
    name: "Soporte Plano",
    category: "Espacio",
    price: 590,
    stock: 9,
    art: "stand",
    tag: "Otra perspectiva",
    description:
      "Eleva tu pantalla y reorganiza el espacio de trabajo con un soporte de líneas sencillas.",
    variants: ["Plata", "Arena"],
    specs: [
      "Diseño plegable de muestra",
      "Superficie antideslizante",
      "Ángulo de escritorio",
    ],
  },
  {
    id: "mouse",
    name: "Mouse Trazo",
    category: "Escritura",
    price: 490,
    stock: 15,
    art: "mouse",
    tag: "Precisión cotidiana",
    description:
      "Una propuesta de mouse compacto con formas suaves para un escritorio más personal.",
    variants: ["Lavanda", "Grafito"],
    specs: [
      "Diseño inalámbrico de muestra",
      "Rueda central",
      "Formato compacto",
    ],
  },
];
export function stockFor(id, orders) {
  const p = products.find((p) => p.id === id);
  if (!p) return 0;
  return Math.max(
    0,
    p.stock -
      orders
        .filter((o) => o.status !== "Cancelado")
        .flatMap((o) => o.items)
        .filter((i) => i.productId === id)
        .reduce((sum, i) => sum + i.quantity, 0),
  );
}
export function validateCart(cart, orders) {
  if (!cart.length) throw new Error("Agrega al menos un producto.");
  const totals = {};
  for (const item of cart) {
    const p = products.find((p) => p.id === item.productId);
    if (
      !p ||
      !p.variants.includes(item.variant) ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1
    )
      throw new Error("Hay un producto o una cantidad no válida.");
    totals[p.id] = (totals[p.id] || 0) + item.quantity;
  }
  for (const [id, qty] of Object.entries(totals)) {
    if (qty > stockFor(id, orders))
      throw new Error(
        `No hay suficientes unidades de ${products.find((p) => p.id === id).name}.`,
      );
  }
  return true;
}
export function totals(cart, code = "") {
  const subtotal = cart.reduce((sum, item) => {
    const p = products.find((p) => p.id === item.productId);
    if (!p || !Number.isInteger(item.quantity) || item.quantity < 1)
      throw new Error("Carrito no válido.");
    return sum + p.price * item.quantity;
  }, 0);
  const normalized = code.trim().toUpperCase();
  if (normalized && normalized !== "NEXO10")
    throw new Error("El cupón no existe. Prueba NEXO10.");
  if (normalized === "NEXO10" && subtotal < 1500)
    throw new Error("NEXO10 requiere al menos $1,500 en productos.");
  const discount = normalized === "NEXO10" ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal === 0 ? 0 : subtotal - discount >= 1500 ? 0 : 149;
  return {
    subtotal,
    discount,
    shipping,
    total: subtotal - discount + shipping,
  };
}
