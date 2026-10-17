import test from "node:test";
import assert from "node:assert/strict";
import { totals, validateCart, stockFor } from "../src/model.js";
test("coupon, rounding and shipping threshold", () => {
  const cart = [
    { productId: "keyboard", variant: "Marfil", quantity: 1 },
    { productId: "mouse", variant: "Lavanda", quantity: 1 },
  ];
  assert.deepEqual(totals(cart, "nexo10"), {
    subtotal: 1780,
    discount: 178,
    shipping: 0,
    total: 1602,
  });
  assert.throws(() => totals([cart[0]], "NEXO10"));
  assert.throws(() => totals(cart, "BAD"));
  assert.equal(totals([]).total, 0);
});
test("inventory is shared across color variants", () => {
  assert.throws(() =>
    validateCart(
      [
        { productId: "keyboard", variant: "Marfil", quantity: 5 },
        { productId: "keyboard", variant: "Grafito", quantity: 4 },
      ],
      [],
    ),
  );
  assert.throws(() =>
    validateCart([{ productId: "mouse", variant: "unknown", quantity: 1 }], []),
  );
  assert.throws(() =>
    validateCart(
      [{ productId: "mouse", variant: "Lavanda", quantity: 1.5 }],
      [],
    ),
  );
});
test("cancellation restores stock", () => {
  const order = {
    status: "Preparando",
    items: [{ productId: "keyboard", quantity: 3 }],
  };
  assert.equal(stockFor("keyboard", [order]), 5);
  order.status = "Cancelado";
  assert.equal(stockFor("keyboard", [order]), 8);
});
