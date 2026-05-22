import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

interface HeaderProps {
  user: string | null;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const { itemCount } = useCart();

  return (
    <header className="header" data-testid="app-header">
      <Link to="/" className="brand" data-testid="brand-logo">
        Nimbo Store
      </Link>
      <nav>
        <Link to="/" data-testid="nav-catalog">
          Catálogo
        </Link>
        <Link to="/cart" data-testid="nav-cart">
          Carrito
          {itemCount > 0 && (
            <span className="cart-badge" data-testid="cart-count">
              {itemCount}
            </span>
          )}
        </Link>
        {user ? (
          <>
            <span className="muted" data-testid="user-email">
              {user}
            </span>
            <button
              className="secondary"
              onClick={onLogout}
              data-testid="logout-button"
            >
              Salir
            </button>
          </>
        ) : (
          <Link to="/login" data-testid="nav-login">
            Ingresar
          </Link>
        )}
      </nav>
    </header>
  );
}
