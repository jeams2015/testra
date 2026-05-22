import { Link, useLocation, Navigate } from "react-router-dom";

interface OrderState {
  orderId: string;
  email: string;
  total: number;
}

export function ConfirmationPage() {
  const location = useLocation();
  const order = location.state as OrderState | null;

  // Si se entra directo sin orden, volver al catálogo.
  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="center" data-testid="confirmation">
      <div style={{ fontSize: 56 }}>✅</div>
      <h1>¡Compra confirmada!</h1>
      <p className="muted mt">
        Gracias por tu compra. Te enviamos el detalle a tu correo.
      </p>

      <div
        className="panel mt"
        style={{ maxWidth: 360, margin: "20px auto", textAlign: "left" }}
      >
        <div className="summary-row">
          <span>N° de orden</span>
          <strong data-testid="order-id">{order.orderId}</strong>
        </div>
        <div className="summary-row">
          <span>Correo</span>
          <span data-testid="order-email">{order.email}</span>
        </div>
        <div className="summary-row total">
          <span>Total pagado</span>
          <span data-testid="order-total">${order.total.toFixed(2)}</span>
        </div>
      </div>

      <Link to="/">
        <button className="mt" data-testid="back-to-catalog">
          Seguir comprando
        </button>
      </Link>
    </div>
  );
}
