# Selectores — Header / Navegación (global)

> Mantenido por el **Keeper**. Presente en todas las pantallas.
> Clave para la navegación SPA — ver **APP-PATTERN-01** en `patterns.md`.

---

## Selectores

| id semántico | data-testid | Tipo | Stability | Descripción |
|---|---|---|---|---|
| `header.root` | `app-header` | container | stable | Cabecera de la app |
| `header.brandLogo` | `brand-logo` | link | stable | Logo — navega a `/catalog` |
| `header.navCatalog` | `nav-catalog` | link | stable | Enlace "Catálogo" |
| `header.navCart` | `nav-cart` | link | stable | Ícono carrito — navegación SPA segura |
| `header.cartCount` | `cart-count` | text | stable | Contador de ítems en carrito |
| `header.navLogin` | `nav-login` | link | stable | Enlace "Ingresar" (sin sesión) |
| `header.userEmail` | `user-email` | text | stable | Email del usuario con sesión |
| `header.logoutButton` | `logout-button` | button | stable | Botón "Salir" |

---

## Uso crítico — Navegación intra-app

```typescript
// ✅ Correcto — navega al carrito SIN resetear el estado React
await page.locator('[data-testid="nav-cart"]').click();
await page.waitForURL(/\/cart/);

// ✅ Correcto — verificar que el carrito tiene ítems
await expect(page.getByTestId('cart-count')).toHaveText('1');

// ❌ Incorrecto — resetea React Context y el carrito aparece vacío
// await page.goto('/cart');
```

---

## Reglas de visibilidad por estado de sesión

| Elemento | Sin sesión | Con sesión |
|---|---|---|
| `nav-login` | visible | oculto |
| `user-email` | oculto | visible |
| `logout-button` | oculto | visible |
| `cart-count` | visible (0) | visible |

---

**Última verificación:** 2026-05-21 · Keeper · ejecución real Playwright
