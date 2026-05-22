import { useState } from "react";
import type { Product } from "../data/products";
import { useCart } from "../context/CartContext";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [feedback, setFeedback] = useState<string | null>(null);
  const outOfStock = product.stock === 0;

  function handleAdd() {
    const error = addItem(product.id, 1);
    if (error) {
      setFeedback(error);
    } else {
      setFeedback("Agregado al carrito ✓");
    }
    setTimeout(() => setFeedback(null), 2500);
  }

  return (
    <div className="product-card" data-testid={`product-${product.id}`}>
      <div className="emoji" aria-hidden="true">
        {product.emoji}
      </div>
      <div className="cat" data-testid="product-category">
        {product.category}
      </div>
      <div className="name" data-testid="product-name">
        {product.name}
      </div>
      <div className="muted" style={{ fontSize: 13 }}>
        {product.description}
      </div>
      <div className="price" data-testid="product-price">
        ${product.price.toFixed(2)}
      </div>
      <div
        className={outOfStock ? "stock out" : "stock"}
        data-testid="product-stock"
      >
        {outOfStock ? "Agotado" : `${product.stock} disponibles`}
      </div>
      <button
        onClick={handleAdd}
        disabled={outOfStock}
        data-testid="add-to-cart-button"
      >
        {outOfStock ? "Sin stock" : "Agregar al carrito"}
      </button>
      {feedback && (
        <div
          className={`notice ${feedback.includes("✓") ? "success" : "error"}`}
          data-testid="product-feedback"
        >
          {feedback}
        </div>
      )}
    </div>
  );
}
