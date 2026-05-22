import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { findProduct } from "../data/products";
import {
  calculateTotals,
  isValidEmail,
  isValidCardNumber,
  isValidCvv,
} from "../lib/rules";

interface FormErrors {
  [key: string]: string;
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, discount, clearCart } = useCart();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const lines = items.map((i) => {
    const product = findProduct(i.productId)!;
    return { unitPrice: product.price, quantity: i.quantity };
  });
  const totals = calculateTotals(lines, discount ?? undefined);

  if (items.length === 0) {
    return (
      <div className="center" data-testid="checkout-empty">
        <h1>No hay nada para pagar</h1>
        <button className="mt" onClick={() => navigate("/")}>
          Ver catálogo
        </button>
      </div>
    );
  }

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (fullName.trim().length < 3)
      e.fullName = "Ingresa tu nombre completo.";
    if (!isValidEmail(email)) e.email = "Correo inválido.";
    if (address.trim().length < 5) e.address = "Ingresa una dirección válida.";
    if (city.trim() === "") e.city = "Ingresa la ciudad.";
    if (!isValidCardNumber(cardNumber))
      e.cardNumber = "La tarjeta debe tener 16 dígitos.";
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry.trim()))
      e.cardExpiry = "Formato MM/AA.";
    if (!isValidCvv(cvv)) e.cvv = "El CVV debe tener 3 dígitos.";
    return e;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const orderId = "NIM-" + Date.now().toString().slice(-8);
    clearCart();
    navigate("/confirmation", {
      state: {
        orderId,
        email: email.trim(),
        total: totals.total,
      },
    });
  }

  function field(
    id: string,
    label: string,
    value: string,
    setter: (v: string) => void,
    testid: string,
    type = "text",
  ) {
    return (
      <div className="field">
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(ev) => setter(ev.target.value)}
          data-testid={testid}
        />
        {errors[id] && (
          <div className="error" data-testid={`${testid}-error`}>
            {errors[id]}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <h1>Pago</h1>

      <form onSubmit={handleSubmit} data-testid="checkout-form">
        <div className="row mt" style={{ alignItems: "flex-start" }}>
          <div style={{ flex: 2 }}>
            <div className="panel">
              <h2>Datos de envío</h2>
              {field("fullName", "Nombre completo", fullName, setFullName, "checkout-name")}
              {field("email", "Correo electrónico", email, setEmail, "checkout-email")}
              {field("address", "Dirección", address, setAddress, "checkout-address")}
              {field("city", "Ciudad", city, setCity, "checkout-city")}
            </div>

            <div className="panel mt">
              <h2>Datos de pago</h2>
              {field(
                "cardNumber",
                "Número de tarjeta (16 dígitos)",
                cardNumber,
                setCardNumber,
                "checkout-card",
              )}
              <div className="row">
                {field(
                  "cardExpiry",
                  "Vencimiento (MM/AA)",
                  cardExpiry,
                  setCardExpiry,
                  "checkout-expiry",
                )}
                {field("cvv", "CVV", cvv, setCvv, "checkout-cvv", "password")}
              </div>
            </div>
          </div>

          <div className="panel" style={{ flex: 1 }} data-testid="checkout-summary">
            <h2>Tu orden</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span data-testid="checkout-subtotal">
                ${totals.subtotal.toFixed(2)}
              </span>
            </div>
            <div className="summary-row">
              <span>Descuento</span>
              <span data-testid="checkout-discount">
                −${totals.discount.toFixed(2)}
              </span>
            </div>
            <div className="summary-row">
              <span>Envío</span>
              <span data-testid="checkout-shipping">
                {totals.shipping === 0
                  ? "Gratis"
                  : `$${totals.shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="summary-row">
              <span>IGV (18%)</span>
              <span data-testid="checkout-tax">${totals.tax.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span data-testid="checkout-total">
                ${totals.total.toFixed(2)}
              </span>
            </div>
            <button
              type="submit"
              className="mt"
              style={{ width: "100%" }}
              data-testid="place-order"
            >
              Confirmar compra
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
