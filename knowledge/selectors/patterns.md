# Patrones técnicos — Nimbo Store

> Comportamientos no-obvios de la app que afectan cómo se escriben y planifican los tests.
> Descubiertos durante ejecución real. Mantenidos por el **Keeper**.
> El **Planner** y el **Automator** los leen antes de planificar / generar código.

---

## APP-PATTERN-01 — Navegación SPA (crítico)

**Descubierto:** ejecución real · **Reportado por:** Healer · **Afecta:** Planner, Automator

### Problema

Nimbo Store es una SPA (React + React Router). El estado del carrito vive en **React Context** (en memoria). Si se ejecuta `page.goto('/cart')` después de agregar productos, Playwright hace un **full page reload** que resetea todo el estado React → el carrito aparece vacío.

### Regla

`page.goto()` solo es seguro como **punto de entrada inicial** del test (el primer goto del flujo).

Para moverse entre rutas después de cualquier acción de usuario, usar siempre los links del header:

```typescript
// ✅ Carrito — SPA-safe
await page.locator('[data-testid="nav-cart"]').click();
await page.waitForURL(/\/cart/);

// ✅ Catálogo — SPA-safe
await page.locator('[data-testid="nav-catalog"]').click();
await page.waitForURL(/\/catalog/);

// ✅ Solo como punto de entrada inicial (primer goto del test)
await page.goto('/catalog');
```

### Patrón de setup estándar para tests de carrito / pricing

```typescript
// 1. Entrar al catálogo (punto de entrada — goto seguro)
await page.goto('/catalog');
// 2. Agregar producto al carrito
await catalogPage.addProduct(productId);
// 3. Navegar al carrito SIN reload
await page.locator('[data-testid="nav-cart"]').click();
await page.waitForURL(/\/cart/);
// ✅ El carrito tiene el producto
```

---

## APP-PATTERN-02 — Flujo de autenticación en full-flow

**Descubierto:** ejecución real · **Reportado por:** Healer

### Situación

En el flujo completo (catálogo → carrito → checkout), al hacer click en "Proceder al checkout" sin sesión, la app redirige a `/login`. Después de hacer login exitoso, redirige a `/checkout` (no a `/catalog`).

### Implicación para tests

- Después de login en flujo completo → `waitForURL(/\/checkout/)`, no `/catalog`.
- El fixture `TC-AUTH-01` tiene `expectedRedirect: "/checkout"` por esta razón.

```typescript
await cartPage.proceedToCheckout();        // sin sesión → redirige a /login
await loginPage.signIn(email, password);   // login exitoso
await page.waitForURL(/\/checkout/);       // ← /checkout, no /catalog
```

---

## APP-PATTERN-03 — Valor "Gratis" en envío

**Descubierto:** ejecución real · **Reportado por:** Healer

### Situación

Cuando el envío es gratuito (subtotal ≥ $150 o código `ENVIOGRATIS`), el elemento `summary-shipping` muestra el texto `"Gratis"` en lugar de un valor numérico como `"$0.00"`.

### Implicación para Page Objects

`parseFloat("Gratis")` retorna `NaN`. El método `readAmount()` del `CartPage` debe manejar este caso:

```typescript
async readAmount(locator: Locator): Promise<number> {
  const text = (await locator.textContent() ?? '0').trim();
  if (text.toLowerCase() === 'gratis') return 0;
  return parseFloat(text.replace(/[^0-9.]/g, ''));
}
```

---

**Última actualización:** 2026-05-21 · Keeper
