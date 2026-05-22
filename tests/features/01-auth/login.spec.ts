/**
 * QIA · Feature 01 — Autenticación
 *
 * Historia: Como usuario, quiero iniciar sesión con mis credenciales
 * para acceder al checkout de Nimbo Store.
 *
 * Reglas cubiertas: RULE-AUTH-01, RULE-VAL-01
 * Generado por: Automator (demo manual — Fase 1)
 * Contract: QIA-DEMO-001 · Schema v1.0.0
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import type { LoginCase } from '@fixtures/types';
import CASES from '@fixtures/data/login-cases.json' with { type: 'json' };

// ── Suite principal — data-driven sobre todos los casos ──────────────────

for (const tc of CASES as LoginCase[]) {
  test(`${tc.id} | ${tc.description}`, async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    // El formulario de login debe estar visible
    await expect(login.isVisible()).resolves.toBe(true);

    await login.signIn(tc.email, tc.password);

    if (tc.expectedOutcome === 'success') {
      // Login exitoso → redirige fuera de /login
      await expect(page).toHaveURL(tc.expectedRedirect ?? '/catalog');

    } else {
      // Login fallido → permanece en /login y muestra el mensaje de error correcto

      // Determinar dónde aparece el error (global vs campo email)
      const isEmailFormatError = tc.id === 'TC-AUTH-04';
      const isPasswordFormatError = tc.id === 'TC-AUTH-05';

      if (isEmailFormatError) {
        await expect(login.emailError()).toContainText(tc.expectedMessage!);
      } else if (isPasswordFormatError) {
        // El error de contraseña corta aparece en el error global en Nimbo Store
        await expect(login.globalError()).toContainText(tc.expectedMessage!);
      } else {
        await expect(login.globalError()).toContainText(tc.expectedMessage!);
      }

      // Debe seguir en /login
      await expect(page).toHaveURL(/\/login/);
    }
  });
}

// ── Caso especial — redirección protegida al checkout ────────────────────

test('TC-AUTH-06 | acceso a /checkout sin sesión redirige a /login', async ({ page }) => {
  // Navegar directo al checkout sin haber iniciado sesión
  await page.goto('/checkout');

  // RULE-AUTH-01: debe redirigir a login
  await expect(page).toHaveURL(/\/login/);

  // El formulario de login debe aparecer
  const login = new LoginPage(page);
  await expect(login.isVisible()).resolves.toBe(true);
});
