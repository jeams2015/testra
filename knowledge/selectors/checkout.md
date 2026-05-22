# Selectores — SCREEN-04 · Checkout (`/checkout`) y Confirmación (`/confirmation`)

> Mantenido por el **Keeper**. Leído por el **Planner** antes de planificar cualquier test de checkout o full-flow.
> Todos los selectores son `data-testid` con `stability: stable`.

**Guards:** requiere sesión activa — sin login redirige a `/login` (RULE-AUTH-01).

---

## Selectores — Checkout (`/checkout`)

| id semántico | data-testid | Tipo | Stability | Descripción |
|---|---|---|---|---|
| `checkout.form` | `checkout-form` | container | stable | Formulario completo de pago |
| `checkout.emptyCheckout` | `checkout-empty` | container | stable | Estado vacío (sin ítems en carrito) |
| `checkout.summaryBlock` | `checkout-summary` | container | stable | Resumen de orden |
| `checkout.subtotal` | `checkout-subtotal` | text | stable | Subtotal en resumen de checkout |
| `checkout.discount` | `checkout-discount` | text | stable | Descuento en resumen de checkout |
| `checkout.shipping` | `checkout-shipping` | text | stable | Envío en resumen de checkout |
| `checkout.tax` | `checkout-tax` | text | stable | IGV en resumen de checkout |
| `checkout.total` | `checkout-total` | text | stable | Total final en checkout |
| `checkout.placeOrder` | `place-order` | button | stable | Botón "Realizar Pedido" |

### Campos del formulario (dentro de `checkout-form`)

> ⚠️ Usar siempre `getByTestId`, no `getByLabel`. Los labels del DOM no coinciden con los textos esperados.

| id semántico | data-testid | Tipo | Stability |
|---|---|---|---|
| `checkout.fullName` | `checkout-name` | input | stable |
| `checkout.email` | `checkout-email` | input | stable |
| `checkout.address` | `checkout-address` | input | stable |
| `checkout.city` | `checkout-city` | input | stable |
| `checkout.cardNumber` | `checkout-card` | input | stable |
| `checkout.cardExpiry` | `checkout-expiry` | input | stable |
| `checkout.cardCvv` | `checkout-cvv` | input (type=password) | stable |

---

## Selectores — Confirmación (`/confirmation`)

| id semántico | data-testid | Tipo | Stability | Descripción |
|---|---|---|---|---|
| `confirmation.root` | `confirmation` | container | stable | Página de confirmación completa |
| `confirmation.orderId` | `order-id` | text | stable | ID de orden generado |
| `confirmation.orderEmail` | `order-email` | text | stable | Email del comprador |
| `confirmation.orderTotal` | `order-total` | text | stable | Total cobrado |
| `confirmation.backToCatalog` | `back-to-catalog` | link | stable | Volver al catálogo |

---

## Cómo usar en Page Objects

```typescript
// Rellenar el formulario de checkout
await page.getByTestId('checkout-name').fill('Juan Pérez');
await page.getByTestId('checkout-email').fill('demo@nimbo.store');
await page.getByTestId('checkout-address').fill('Av. Principal 123');
await page.getByTestId('checkout-city').fill('Lima');
await page.getByTestId('checkout-card').fill('4111111111111111');
await page.getByTestId('checkout-expiry').fill('12/27');
await page.getByTestId('checkout-cvv').fill('123');
await page.getByTestId('place-order').click();

// Verificar confirmación
await page.waitForURL(/\/confirmation/);
await expect(page.getByTestId('order-id')).toBeVisible();
await expect(page.getByTestId('order-email')).toHaveText('demo@nimbo.store');
```

---

## Reglas de negocio activas

- **RULE-VAL-01** — Nombre ≥ 3 chars, dirección ≥ 5 chars, tarjeta 16 dígitos, CVV 3 dígitos, vencimiento `MM/AA`.
- **RULE-AUTH-01** — Sin login activo → redirige a `/login`.

---

**Última verificación:** 2026-05-21 · Keeper · ejecución real Playwright
