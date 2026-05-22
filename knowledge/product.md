# Knowledge Base — Nimbo Store · Reglas de negocio

> Base de conocimiento de la app bajo prueba. La mantiene el **Keeper**. La leen el **Analyst** (para interpretar tickets) y el **Sentinel** (para verificar la aritmética de los contratos).

**App:** Nimbo Store (e-commerce demo) · **Framework:** Playwright · **Schema:** knowledge v1.0.0

---

## Overview

Nimbo Store es una tienda e-commerce. El usuario recorre el catálogo, agrega productos al carrito, aplica códigos de descuento, inicia sesión y completa el pago. Cinco pantallas: Catálogo, Login, Carrito, Checkout, Confirmación.

---

## Reglas de negocio

### RULE-TAX-01 — IGV
- **Categoría:** pricing
- **Descripción:** El IGV es 18% y se calcula sobre la base imponible = (subtotal − descuento).
- **Fórmula:** `tax = (subtotal − discount) × 0.18`
- **Ejemplos:**
  - subtotal $100, sin descuento → tax = $18.00
  - subtotal $100, descuento $10 → tax = ($90) × 0.18 = $16.20

### RULE-SHIP-01 — Costo de envío
- **Categoría:** pricing
- **Descripción:** El envío es $8.00 plano. Es **gratis** si el subtotal es ≥ $150.00. También es gratis con el código `ENVIOGRATIS`. Carrito vacío → envío $0.
- **Fórmula:** `shipping = (subtotal >= 150 || codigoEnvioGratis || subtotal == 0) ? 0 : 8`
- **Ejemplos:**
  - subtotal $149.99 → envío $8.00
  - subtotal $150.00 → envío gratis
  - subtotal $80 + código ENVIOGRATIS → envío gratis

### RULE-TOTAL-01 — Total de la orden
- **Categoría:** pricing
- **Descripción:** El total es la base imponible más envío más IGV.
- **Fórmula:** `total = (subtotal − discount) + shipping + tax`
- **Ejemplos:**
  - subtotal $200, sin descuento → discount $0, shipping $0 (≥150), tax $36 → total $236.00

### RULE-QTY-01 — Máximo por producto
- **Categoría:** limits
- **Descripción:** Un producto no puede superar 10 unidades en el carrito.
- **Ejemplos:**
  - intentar agregar 11 unidades → rechazo: "Máximo 10 unidades por producto."

### RULE-STOCK-01 — Límite de stock
- **Categoría:** limits
- **Descripción:** No se puede agregar al carrito más unidades que el stock disponible del producto. Un producto con stock 0 está agotado y su botón de agregar está deshabilitado.
- **Ejemplos:**
  - producto con stock 4, intentar agregar 5 → rechazo: "Solo quedan 4 unidades disponibles."
  - producto P-004 (stock 0) → botón "Sin stock", deshabilitado.

### RULE-DISC-01 — Códigos de descuento
- **Categoría:** pricing
- **Descripción:** Tres códigos válidos. Cualquier otro se rechaza.
- **Detalle:**
  - `BIENVENIDO10` — 10% de descuento sobre el subtotal. Sin mínimo.
  - `VERANO25` — 25% de descuento. Requiere subtotal ≥ $100.00.
  - `ENVIOGRATIS` — envío gratis (no descuenta del subtotal).
- **Ejemplos:**
  - subtotal $200 + `BIENVENIDO10` → descuento $20.00
  - subtotal $90 + `VERANO25` → rechazo: "Este código requiere un subtotal mínimo de $100.00."
  - código `XYZ` → rechazo: "El código no existe."

### RULE-VAL-01 — Validaciones de formulario
- **Categoría:** validation
- **Descripción:** Reglas de validación de los formularios de login y checkout.
- **Detalle:**
  - Email: debe tener formato válido (`algo@algo.dominio`).
  - Contraseña (login): mínimo 6 caracteres.
  - Tarjeta: exactamente 16 dígitos.
  - CVV: exactamente 3 dígitos.
  - Vencimiento: formato `MM/AA`.
  - Nombre completo (checkout): mínimo 3 caracteres.
  - Dirección: mínimo 5 caracteres.

### RULE-AUTH-01 — Acceso al checkout
- **Categoría:** validation
- **Descripción:** El checkout requiere sesión iniciada. Sin login, `/checkout` redirige a `/login`.
- **Credencial de demo válida:** `demo@nimbo.store` / `nimbo123`. Cualquier otra combinación se rechaza con "Correo o contraseña incorrectos."

---

## Productos del catálogo

| id | nombre | categoría | precio | stock |
|---|---|---|---|---|
| P-001 | Audífonos Inalámbricos Nimbo Air | Tecnología | $89.90 | 12 |
| P-002 | Teclado Mecánico Nimbo Type | Tecnología | $129.00 | 7 |
| P-003 | Mouse Ergonómico Nimbo Grip | Tecnología | $45.50 | 20 |
| P-004 | Lámpara de Escritorio Nimbo Glow | Oficina | $59.90 | **0 (agotado)** |
| P-005 | Silla Ergonómica Nimbo Rest | Oficina | $240.00 | 4 |
| P-006 | Termo Inteligente Nimbo Heat | Hogar | $34.90 | 30 |
| P-007 | Organizador de Escritorio Nimbo Tidy | Oficina | $22.00 | 15 |
| P-008 | Parlante Portátil Nimbo Boom | Tecnología | $75.00 | 9 |

---

**Última actualización:** 2026-05-16 · maintainedBy: Keeper
