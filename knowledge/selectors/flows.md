# Flujos de usuario — Nimbo Store

> Flujos de usuario documentados para el **Planner**. Se usa al planificar tests de tipo `full-flow`.
> Mantenido por el **Keeper**.

---

## FLOW-01 — Compra completa (happy path)

**Cobertura:** catálogo → carrito → checkout → confirmación

```
1. Usuario navega a /catalog
2. Selecciona un producto y lo agrega al carrito (add-to-cart-button)
3. Hace click en nav-cart (SPA navigation — APP-PATTERN-01)
4. [Opcional] aplica un código de descuento
5. Hace click en "Proceder al checkout" (proceed-checkout)
   ├── Con sesión activa → va directo a /checkout
   └── Sin sesión → redirige a /login → login exitoso → /checkout (APP-PATTERN-02)
6. Rellena el formulario de checkout (checkout-name, checkout-email, checkout-address,
   checkout-city, checkout-card, checkout-expiry, checkout-cvv)
7. Hace click en "Realizar Pedido" (place-order)
8. La app navega a /confirmation
9. Se muestran order-id, order-email, order-total
```

**Test cases que cubren este flujo:**
- `tests/features/04-full-flow/checkout.spec.ts` — TC-FLOW-01, TC-FLOW-02

---

## FLOW-02 — Carrito vacío

```
1. Usuario navega a /cart directamente (sin agregar productos)
2. Se muestra el estado vacío (empty-cart)
3. Hay un link "Ir al catálogo" (go-catalog)
4. El botón "Proceder al checkout" NO está presente
```

---

## FLOW-03 — Aplicar código de descuento

```
1. Usuario tiene productos en el carrito
2. Navega al carrito (nav-cart click — APP-PATTERN-01)
3. Ingresa el código en discount-input
4. Hace click en apply-discount
5. El mensaje en discount-message confirma o rechaza el código
6. El resumen (summary-subtotal, summary-discount, summary-shipping, summary-tax, summary-total)
   se actualiza automáticamente
```

---

## FLOW-04 — Acceso denegado a checkout sin sesión

```
1. Usuario intenta acceder a /checkout sin sesión
2. La app redirige a /login
3. Después de login exitoso → redirige a /checkout (no a /catalog)
```

**Test case:** `TC-AUTH-06` en `tests/features/01-auth/login.spec.ts`

---

**Última actualización:** 2026-05-21 · Keeper
