# Selectores — SCREEN-02 · Login (`/login`)

> Mantenido por el **Keeper**. Leído por el **Planner** antes de planificar cualquier test de autenticación.
> Todos los selectores son `data-testid` con `stability: stable`.

**Guards:** redirige a `/catalog` si ya hay sesión activa.

---

## Selectores

| id semántico | data-testid | Tipo | Stability | Descripción |
|---|---|---|---|---|
| `login.form` | `login-form` | container | stable | Formulario de login |
| `login.emailInput` | `login-email` | input | stable | Campo de correo electrónico |
| `login.emailError` | `login-email-error` | text | stable | Error de validación del email |
| `login.passwordInput` | `login-password` | input | stable | Campo de contraseña |
| `login.submitButton` | `login-submit` | button | stable | Botón "Ingresar" |
| `login.errorMessage` | `login-error` | text | stable | Error global (credenciales inválidas) |

---

## Cómo usar en Page Objects

```typescript
await page.getByTestId('login-email').fill(email);
await page.getByTestId('login-password').fill(password);
await page.getByTestId('login-submit').click();

// Verificar error global
await expect(page.getByTestId('login-error')).toHaveText('Correo o contraseña incorrectos.');

// Verificar error de email inválido
await expect(page.getByTestId('login-email-error')).toBeVisible();
```

---

## Reglas de negocio activas

- **RULE-AUTH-01** — Credencial válida: `demo@nimbo.store` / `nimbo123`.
- **RULE-VAL-01** — Email: formato válido. Contraseña: mínimo 6 caracteres.
- Sin sesión → `/checkout` redirige a `/login`.

---

## Mensajes de error esperados

| Caso | Selector | Mensaje exacto |
|---|---|---|
| Credenciales inválidas | `login-error` | `"Correo o contraseña incorrectos."` |
| Email inválido | `login-email-error` | visible (texto varía por browser) |
| Contraseña corta | inline | error de validación HTML5 |

---

**Última verificación:** 2026-05-21 · Keeper · ejecución real Playwright
