import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { findProduct } from "../data/products";
import { calculateTotals, validateDiscountCode } from "../lib/rules";

export function CartPage() {
  const navigate = useNavigate();
  const { items, setQuantity, removeItem, discount, setDiscount } = useCart();
  const [codeInput, setCodeInput] = useState("");
  const [codeMessage, setCodeMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const [lineError, setLineError] = useState<string | null>(null);

  const lines = items.map((i) => {
    const product = findProduct(i.productId)!;
    return { ...i, product };
  });

  const totals = calculateTotals(
    lines.map((l) => ({ unitPrice: l.product.price, quantity: l.quantity })),
    discount ?? undefined,
  );

  function applyCode() {
    const result = validateDiscountCode(codeInput, totals.subtotal);
    if (!result.valid) {
      setDiscount(null);
      setCodeMessage({ type: "error", text: result.reason! });
      return;
    }
    setDiscount(result.applied!);
    setCodeMessage({
      type: "success",
      text: `Código ${result.applied!.code} aplicado.`,
    });
  }

  function changeQty(productId: string, qty: number) {
    const err = setQuantity(productId, qty);
    setLineError(err);
    if (err) setTimeout(() => setLineError(null), 3000);
  }

  if (items.length === 0) {
    return (
      <div className="center" data-testid="empty-cart">
        <h1>Tu carrito está vacío</h1>
        <p className="muted mt">Agrega productos desde el catálogo.</p>
        <Link to="/">
          <button className="mt" data-testid="go-catalog">
            Ver catálogo
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Tu carrito</h1>

      <div className="row mt" style={{ alignItems: "flex-start" }}>
        <div style={{ flex: 2 }}>
          {lines.map((l) => (
            <div
              className="cart-line"
              key={l.productId}
              data-testid={`cart-line-${l.productId}`}
            >
              <div className="emoji">{l.product.emoji}</div>
              <div className="grow">
                <div style={{ fontWeight: 700 }}>{l.product.name}</div>
                <div className="muted" data-testid="line-unit-price">
                  ${l.product.price.toFixed(2)} c/u
                </div>
              </div>
              <div className="qty-control">
                <button
                  className="secondary"
                  onClick={() => changeQty(l.productId, l.quantity - 1)}
                  data-testid="qty-decrease"
                >
                  −
                </button>
                <input
                  type="number"
                  value={l.quantity}
                  readOnly
                  data-testid="line-quantity"
                />
                <button
                  className="secondary"
                  onClick={() => changeQty(l.productId, l.quantity + 1)}
                  data-testid="qty-increase"
                >
                  +
                </button>
              </div>
              <div
                style={{ width: 90, textAlign: "right", fontWeight: 700 }}
                data-testid="line-subtotal"
              >
                ${(l.product.price * l.quantity).toFixed(2)}
              </div>
              <button
                className="danger"
                onClick={() => removeItem(l.productId)}
                data-testid="line-remove"
              >
                Quitar
              </button>
            </div>
          ))}
          {lineError && (
            <div className="notice error" data-testid="cart-line-error">
              {lineError}
            </div>
          )}
        </div>

        <div className="panel" style={{ flex: 1 }} data-testid="cart-summary">
          <h2>Resumen</h2>

          <div className="field">
            <label htmlFor="discount">Código de descuento</label>
            <div className="row" style={{ gap: 8 }}>
              <input
                id="discount"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                data-testid="discount-input"
              />
              <button
                style={{ flex: "0 0 auto" }}
                onClick={applyCode}
                data-testid="apply-discount"
              >
                Aplicar
              </button>
            </div>
            {codeMessage && (
              <div
                className={`notice ${codeMessage.type}`}
                data-testid="discount-message"
              >
                {codeMessage.text}
              </div>
            )}
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span data-testid="summary-subtotal">
              ${totals.subtotal.toFixed(2)}
            </span>
          </div>
          <div className="summary-row">
            <span>Descuento</span>
            <span data-testid="summary-discount">
              −${totals.discount.toFixed(2)}
            </span>
          </div>
          <div className="summary-row">
            <span>Envío</span>
            <span data-testid="summary-shipping">
              {totals.shipping === 0 ? "Gratis" : `$${totals.shipping.toFixed(2)}`}
            </span>
          </div>
          <div className="summary-row">
            <span>IGV (18%)</span>
            <span data-testid="summary-tax">${totals.tax.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span data-testid="summary-total">${totals.total.toFixed(2)}</span>
          </div>

          <button
            className="mt"
            style={{ width: "100%" }}
            onClick={() => navigate("/checkout")}
            data-testid="proceed-checkout"
          >
            Continuar al pago
          </button>
        </div>
      </div>
    </div>
  );
}
