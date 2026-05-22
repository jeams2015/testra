# Knowledge Base — Nimbo Store · Pantallas & Selectores

> Selectores verificados de las 5 pantallas de Nimbo Store. Los mantiene el **Keeper**.
> El **Planner** los lee antes de planificar; el **Automator** los usa para generar Page Objects.
>
> **Regla:** todos los selectores son `data-testid` (stability: stable) salvo indicación.
> Schema: knowledge v1.0.0

---

## SCREEN-01 · Catálogo (`/catalog`)

**Guards:** ninguno — pantalla pública.

| id semántico | data-testid | Tipo | Descripción |
|---|---|---|---|
| `catalog.productGrid` | `product-grid` | container | Grid de tarjetas de producto |
| `catalog.productName` | `product-name` | text | Nombre del producto (dentro de cada card) |
| `catalog.productPrice` | `product-price` | text | Precio unitario |
| `catalog.productCategory` | `product-category` | text | Categoría (Tecnología / Oficina / Hogar) |
| `catalog.productStock` | `product-stock` | text | Stock disponible o "Agotado" |
| `catalog.addToCartButton` | `add-to-cart-button` | button | Agregar al carrito (deshabilitado si stock=0) |
| `catalog.qtyIncrease` | `qty-increase` | button | Botón `+` de cantidad antes de agregar |
| `catalog.qtyDecrease` | `qty-decrease` | button | Botón `-` de cantidad antes de agregar |
| `catalog.productFeedback` | `product-feedback` | text | Mensaje de error de cantidad/stock inline |
| `catalog.emptyCatalog` | `empty-catalog` | container | Mensaje cuando no hay productos |

**Notas:**
- Un producto con `stock=0` tiene el botón `add-to-cart-button` deshabilitado y muestra "Sin stock" (RULE-STOCK-01).
- La cantidad máxima por producto es 10 (RULE-QTY-01); incrementar más allá muestra error en `product-feedback`.

---

## SCREEN-02 · Login (`/login`)

**Guards:** redirige a `/catalog` si ya hay sesión activa.

| id semántico | data-testid | Tipo | Descripción |
|---|---|---|---|
| `login.form` | `login-form` | container | Formulario de login |
| `login.emailInput` | `login-email` | input | Campo de correo electrónico |
| `login.emailError` | `login-email-error` | text | Error de validación del email |
| `login.passwordInput` | `login-password` | input | Campo de contraseña |
| `login.submitButton` | `login-submit` | button | Botón "Ingresar" |
| `login.errorMessage` | `login-error` | text | Error global (credenciales inválidas) |

**Credencial de demo válida:** `demo@nimbo.store` / `nimbo123` (RULE-AUTH-01).

**Casos de error:**
- Email inválido → error en `login-email-error`.
- Contraseña < 6 chars → error inline.
- Credenciales incorrectas → `login-error`: "Correo o contraseña incorrectos."

---

## SCREEN-03 · Carrito (`/cart`)

**Guards:** ninguno — público, pero muestra estado vacío si no hay ítems.

| id semántico | data-testid | Tipo | Descripción |
|---|---|---|---|
| `cart.summary` | `cart-summary` | container | Contenedor del resumen del carrito |
| `cart.emptyCart` | `empty-cart` | container | Mensaje "Tu carrito está vacío" |
| `cart.lineUnitPrice` | `line-unit-price` | text | Precio unitario de una línea |
| `cart.lineQuantity` | `line-quantity` | text | Cantidad de una línea |
| `cart.lineSubtotal` | `line-subtotal` | text | Subtotal de una línea |
| `cart.lineRemove` | `line-remove` | button | Eliminar línea del carrito |
| `cart.lineError` | `cart-line-error` | text | Error inline de stock/qty en una línea |
| `cart.discountInput` | `discount-input` | input | Campo de código de descuento |
| `cart.applyDiscount` | `apply-discount` | button | Botón "Aplicar" descuento |
| `cart.discountMessage` | `discount-message` | text | Feedback del código (éxito o error) |
| `cart.summarySubtotal` | `summary-subtotal` | text | Subtotal total del carrito |
| `cart.summaryDiscount` | `summary-discount` | text | Monto de descuento aplicado |
| `cart.summaryShipping` | `summary-shipping` | text | Costo de envío |
| `cart.summaryTax` | `summary-tax` | text | IGV calculado |
| `cart.summaryTotal` | `summary-total` | text | Total final |
| `cart.proceedCheckout` | `proceed-checkout` | button | Ir al checkout |
| `cart.goCatalog` | `go-catalog` | link | Volver al catálogo (desde carrito vacío) |

**Reglas activas:** RULE-TAX-01, RULE-SHIP-01, RULE-TOTAL-01, RULE-DISC-01.

---

## SCREEN-04 · Checkout (`/checkout`)

**Guards:** requiere sesión activa — sin login redirige a `/login` (RULE-AUTH-01).

| id semántico | data-testid | Tipo | Descripción |
|---|---|---|---|
| `checkout.form` | `checkout-form` | container | Formulario completo de pago |
| `checkout.emptyCheckout` | `checkout-empty` | container | Estado vacío (sin ítems en carrito) |
| `checkout.summaryBlock` | `checkout-summary` | container | Resumen de orden |
| `checkout.subtotal` | `checkout-subtotal` | text | Subtotal en resumen de checkout |
| `checkout.discount` | `checkout-discount` | text | Descuento en resumen de checkout |
| `checkout.shipping` | `checkout-shipping` | text | Envío en resumen de checkout |
| `checkout.tax` | `checkout-tax` | text | IGV en resumen de checkout |
| `checkout.total` | `checkout-total` | text | Total final en checkout |
| `checkout.placeOrder` | `place-order` | button | Botón "Realizar Pedido" |

**Campos del formulario** (dentro de `checkout-form`, localizados por `getByTestId`):

| id semántico | data-testid | Tipo |
|---|---|---|
| `checkout.fullName` | `checkout-name` | input |
| `checkout.email` | `checkout-email` | input |
| `checkout.address` | `checkout-address` | input |
| `checkout.city` | `checkout-city` | input |
| `checkout.cardNumber` | `checkout-card` | input |
| `checkout.cardExpiry` | `checkout-expiry` | input |
| `checkout.cardCvv` | `checkout-cvv` | input (type=password) |

**Validaciones (RULE-VAL-01):** nombre ≥ 3 chars, dirección ≥ 5 chars, tarjeta 16 dígitos, CVV 3 dígitos, vencimiento `MM/AA`.

---

## SCREEN-05 · Confirmación (`/confirmation`)

**Guards:** solo accesible después de `place-order` exitoso.

| id semántico | data-testid | Tipo | Descripción |
|---|---|---|---|
| `confirmation.root` | `confirmation` | container | Página de confirmación completa |
| `confirmation.orderId` | `order-id` | text | ID de orden generado |
| `confirmation.orderEmail` | `order-email` | text | Email del comprador |
| `confirmation.orderTotal` | `order-total` | text | Total cobrado |
| `confirmation.backToCatalog` | `back-to-catalog` | link | Volver al catálogo |

---

## Header / Navegación (global)

| id semántico | data-testid | Tipo | Descripción |
|---|---|---|---|
| `header.root` | `app-header` | container | Cabecera de la app |
| `header.brandLogo` | `brand-logo` | link | Logo — navega a `/catalog` |
| `header.navCatalog` | `nav-catalog` | link | Enlace "Catálogo" |
| `header.navCart` | `nav-cart` | link | Ícono carrito |
| `header.cartCount` | `cart-count` | text | Contador de ítems en carrito |
| `header.navLogin` | `nav-login` | link | Enlace "Ingresar" (sin sesión) |
| `header.userEmail` | `user-email` | text | Email del usuario con sesión |
| `header.logoutButton` | `logout-button` | button | Botón "Salir" |

---

---

## Patrón técnico — Navegación SPA

> **APP-PATTERN-01** · descubierto durante ejecución · reportado por Healer

**Título:** No usar `page.goto()` para moverse entre rutas después de una acción de usuario.

**Descripción:** Nimbo Store es una SPA (React + React Router). El estado del carrito vive en React Context (en memoria). Si se navega con `page.goto('/cart')` después de agregar productos, Playwright ejecuta un **full page reload** que resetea todo el estado React y el carrito aparece vacío.

**Afecta:** Automator, Planner (al generar Page Objects con métodos `goto()`).

**Workaround:** Para navegar al carrito después de agregar productos, usar el link del header:
```typescript
await page.locator('[data-testid="nav-cart"]').click();
await page.waitForURL(/\/cart/);
```
`page.goto()` solo es seguro como **punto de entrada inicial** del test (primer `goto` del flujo).

---

**Última actualización:** 2026-05-21 · maintainedBy: Keeper · método: ejecución real (Playwright)
