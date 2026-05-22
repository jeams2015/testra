/**
 * QIA · Feature 04 — Full Flow E2E
 *
 * El flujo completo de compra: catálogo → carrito → login → checkout → confirmación.
 * Este es el test "dinero" de QIA: demuestra el pipeline de punta a punta.
 *
 * Reglas cubiertas: todas (AUTH-01, VAL-01, TAX-01, SHIP-01, TOTAL-01, DISC-01)
 * Generado por: Automator (demo manual — Fase 1)
 * Contract: QIA-DEMO-004 · Schema v1.0.0
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { CartPage } from '@pages/CartPage';
import { CheckoutPage } from '@pages/CheckoutPage';
import type { FullFlowCase } from '@fixtures/types';
import CASES from '@fixtures/data/full-flow-cases.json' with { type: 'json' };

for (const tc of CASES as FullFlowCase[]) {
  test(`${tc.id} | ${tc.description}`, async ({ page }) => {

    // ── PASO 1: Catálogo → agregar producto ──────────────────────────────────
    await page.goto('/catalog');
    await page.waitForSelector('[data-testid="product-grid"]', { state: 'visible' });

    const card = page.locator(`[data-testid="product-${tc.productId}"]`);
    await card.waitFor({ state: 'visible' });

    if (tc.quantity > 1) {
      const inc = card.locator('[data-testid="qty-increase"]');
      for (let i = 1; i < tc.quantity; i++) await inc.click();
    }
    await card.locator('[data-testid="add-to-cart-button"]').click();
    await expect(page.locator('[data-testid="cart-count"]')).not.toHaveText('0');

    // ── PASO 2: Navegar al carrito (SPA — APP-PATTERN-01) ────────────────────
    await page.locator('[data-testid="nav-cart"]').click();
    await page.waitForURL(/\/cart/);

    const cart = new CartPage(page);
    await expect(cart.summary()).toBeVisible();

    // Aplicar descuento si corresponde
    if (tc.discountCode) {
      await cart.applyDiscount(tc.discountCode);
      await expect(cart.discountMessage()).toBeVisible();
    }

    // ── PASO 3: Ir al checkout → redirige a login (RULE-AUTH-01) ─────────────
    await cart.proceedButton().click();
    await page.waitForURL(/\/login/);

    // ── PASO 4: Login ─────────────────────────────────────────────────────────
    const login = new LoginPage(page);
    await login.signIn(tc.credentials.email, tc.credentials.password);
    await page.waitForURL(/\/checkout/);

    // ── PASO 5: Checkout — verificar resumen y completar formulario ───────────
    const checkout = new CheckoutPage(page);
    await expect(checkout.form()).toBeVisible();

    // El total en checkout debe coincidir con lo esperado
    const checkoutTotal = await page.getByTestId('checkout-total').textContent();
    const parsedTotal = parseFloat((checkoutTotal ?? '0').replace(/[^0-9.]/g, ''));
    expect(parsedTotal).toBeCloseTo(tc.expectedTotal, 2);

    await checkout.fillAndSubmit(tc.checkout);

    // ── PASO 6: Confirmación ──────────────────────────────────────────────────
    await page.waitForURL(/\/confirmation/);
    await expect(checkout.confirmationRoot()).toBeVisible();

    // Verificar datos de la confirmación
    await expect(checkout.orderId()).not.toBeEmpty();
    await expect(checkout.orderEmail()).toContainText(tc.credentials.email);

    const confirmedTotal = await checkout.readConfirmedTotal();
    expect(confirmedTotal).toBeCloseTo(tc.expectedTotal, 2);
  });
}
