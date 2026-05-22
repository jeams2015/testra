import { useState } from "react";
import { PRODUCTS } from "../data/products";
import { ProductCard } from "../components/ProductCard";

type Filter = "Todos" | "Tecnología" | "Hogar" | "Oficina";

const FILTERS: Filter[] = ["Todos", "Tecnología", "Hogar", "Oficina"];

export function CatalogPage() {
  const [filter, setFilter] = useState<Filter>("Todos");

  const visible =
    filter === "Todos"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === filter);

  return (
    <div>
      <h1>Catálogo</h1>
      <p className="muted">Todo lo que necesitas para tu espacio de trabajo.</p>

      <div className="row mt" style={{ flexWrap: "wrap", gap: 8 }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            className={filter === f ? "" : "secondary"}
            style={{ flex: "0 0 auto" }}
            onClick={() => setFilter(f)}
            data-testid={`filter-${f.toLowerCase()}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="product-grid mt" data-testid="product-grid">
        {visible.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="center muted" data-testid="empty-catalog">
          No hay productos en esta categoría.
        </p>
      )}
    </div>
  );
}
