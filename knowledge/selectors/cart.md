# Selectores — SCREEN-03 · Carrito (`/cart`)

> Mantenido por el **Keeper**. Leído por el **Planner** antes de planificar cualquier test de carrito o pricing.
> Todos los selectores son `data-testid` con `stability: stable`.

**Guards:** ninguno — público, pero muestra estado vacío si no hay ítems.

---

## Selectores

| id semántico | data-testid | Tipo | Stability | Descripción |
|---|---|---|---|---|
| `cart.summary` | `cart-summary` | container | stable | Contenedor del resumen del carrito |
| `cart.emptyCart` | `empty-cart` | container | stable | Mensaje "Tu carrito está vacío" |
| `cart.lineUnitPrice` | `line-unit-price` | text | stable | Precio unitario de una línea |
| `cart.lineQuantity` | `line-quantity` | text | stable | Cantidad de una línea |
| `cart.lineSubtotal` | `line-subtotal` | text | stable | Subtotal de una línea |
| `cart.lineRemove` | `line-remove` | button | stable | Eliminar línea del carrito |
| `cart.lineError` | `cart-line-error` | text | stable | Error inline de stock/qty en una línea |
| `cart.discountInput` | `discount-input` | input | stable | Campo de código de descuento |
| `cart.applyDiscount` | `apply-discount` | button | stable | Botón "Aplicar" descuento |
| `cart.discountMessage` | `discount-message` | text | stable | Feedback del código (éxito o error) |
| `cart.summarySubtotal` | `summary-subtotal` | text | stable | Subtotal total del carrito |
| `cart.summaryDiscount` | `summary-discount` | text | stable | Monto de descuento aplicado |
| `cart.summaryShipping` | `summary-shipping` | text | stable | Costo de envío (puede ser "Gratis") |
| `cart.summaryTax` | `summary-tax` | text | stable | IGV calculado |
| `cart.summaryTotal` | `summary-total` | text | stable | Total final |
| `cart.proceedCheckout` | `proceed-checkout` | button | stable | Ir al checkout |
| `cart.goCatalog` | `go-catalog` | link | stable | Volver al catálogo (desde carrito vacío) |

---

## Cómo usar en Page Objects

```typescript
// Leer un valor numérico del resumen (manejar "Gratis" → 0)
async readAmount(locator: Locator): Promise<number> {
  const text = (await locator.textContent() ?? '0').trim();
  if (text.toLowerCase() === 'gratis') return 0;
  return parseFloat(text.replace(/[^0-9.]/g, ''));
}

// Aplicar código de descuento
await page.getByTestId('discount-input').fill('BIENVENIDO10');
await page.getByTestId('apply-discount').click();
await expect(page.getByTestId('discount-message')).toHaveText('Código BIENVENIDO10 aplicado.');
```

---

## Reglas de negocio activas

- **RULE-TAX-01** — IGV 18% sobre (subtotal − descuento).
- **RULE-SHIP-01** — Envío $8.00; gratis si subtotal ≥ $150 o código `ENVIOGRATIS`.
- **RULE-TOTAL-01** — Total = base imponible + envío + IGV.
- **RULE-DISC-01** — Códigos: `BIENVENIDO10` (10%), `VERANO25` (25%, mín $100), `ENVIOGRATIS`.

---

## Mensajes de descuento exactos (verificados en ejecución)

| Código | Condición | Mensaje en `discount-message` |
|---|---|---|
| `BIENVENIDO10` | cualquier subtotal | `"Código BIENVENIDO10 aplicado."` |
| `VERANO25` | subtotal ≥ $100 | `"Código VERANO25 aplicado."` |
| `VERANO25` | subtotal < $100 | `"Este código requiere un subtotal mínimo de $100.00."` |
| `ENVIOGRATIS` | cualquier subtotal | `"Código ENVIOGRATIS aplicado."` |
| cualquier otro | — | `"El código no existe."` |

---

## Nota crítica — Navegación SPA

Ver **APP-PATTERN-01** en `knowledge/selectors/patterns.md`.

No usar `page.goto('/cart')` después de agregar productos al carrito — resetea el estado React.
Usar siempre `page.locator('[data-testid="nav-cart"]').click()`.

---

**Última verificación:** 2026-05-21 · Keeper · ejecución real Playwright
