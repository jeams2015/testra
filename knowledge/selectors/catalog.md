# Selectores — SCREEN-01 · Catálogo (`/catalog`)

> Mantenido por el **Keeper**. Leído por el **Planner** antes de planificar cualquier test de catálogo.
> Todos los selectores son `data-testid` con `stability: stable` salvo indicación.

**Guards:** ninguno — pantalla pública.

---

## Selectores

| id semántico | data-testid | Tipo | Stability | Descripción |
|---|---|---|---|---|
| `catalog.productGrid` | `product-grid` | container | stable | Grid de tarjetas de producto |
| `catalog.productName` | `product-name` | text | stable | Nombre del producto (dentro de cada card) |
| `catalog.productPrice` | `product-price` | text | stable | Precio unitario |
| `catalog.productCategory` | `product-category` | text | stable | Categoría (Tecnología / Oficina / Hogar) |
| `catalog.productStock` | `product-stock` | text | stable | Stock disponible o "Agotado" |
| `catalog.addToCartButton` | `add-to-cart-button` | button | stable | Agregar al carrito (deshabilitado si stock=0) |
| `catalog.qtyIncrease` | `qty-increase` | button | stable | Botón `+` de cantidad antes de agregar |
| `catalog.qtyDecrease` | `qty-decrease` | button | stable | Botón `-` de cantidad antes de agregar |
| `catalog.productFeedback` | `product-feedback` | text | stable | Mensaje de error de cantidad/stock inline |
| `catalog.emptyCatalog` | `empty-catalog` | container | stable | Mensaje cuando no hay productos |

---

## Cómo usar en Page Objects

```typescript
// Locator de tarjeta por id de producto (filtrar en el grid)
page.getByTestId('add-to-cart-button').first()          // primera tarjeta
page.locator(`[data-product-id="${productId}"]`)         // si el DOM expone el atributo

// Flujo estándar para agregar producto P-008 al carrito
await page.getByTestId('add-to-cart-button').nth(index).click();
```

---

## Reglas de negocio activas

- **RULE-QTY-01** — Máximo 10 unidades por producto. Exceder muestra error en `product-feedback`.
- **RULE-STOCK-01** — Stock 0 → botón `add-to-cart-button` deshabilitado, texto "Sin stock".

---

## Notas

- El botón `qty-increase` en el catálogo tiene problemas de estabilidad para algunos productos
  (detectado en TC-PRICE-01: P-006 qty-increase no responde). Usar `qty: 1` por defecto y
  agregar directamente sin incrementar cuando sea posible.

---

**Última verificación:** 2026-05-21 · Keeper · ejecución real Playwright
