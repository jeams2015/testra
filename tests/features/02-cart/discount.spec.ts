/**
 * QIA · Feature 02 — Carrito · Códigos de descuento
 *
 * Historia: Como usuario, quiero aplicar códigos de descuento
 * para obtener beneficios en mi compra.
 *
 * Reglas cubiertas: RULE-DISC-01, RULE-SHIP-01
 * Generado por: Automator (demo manual — Fase 1)
 * Contract: QIA-DEMO-002 · Schema v1.0.0
 *
 * IMPORTANTE — Patrón SPA:
 *   page.goto('/cart') hace un full reload y resetea el estado React.
 *   La navegación al carrito DEBE hacerse via el link del header (nav-cart)
 *   para que el estado del carrito persista.
 */

import { test, expect } from '@playwright/test';
import { CartPage } from '@pages/CartPage';
import type { DiscountCase } from '@fixtures/types';
import CASES from '@fixtures/data/discount-cases.json' with { type: 'json' };

// Helper: puebla el carrito y navega al carrito via SPA (sin full reload)
async function seedCartAndNavigate(page: import('@playwright/test').Page, targetSubtotal: number) {
  await page.goto('/catalog');
  await page.waitForSelector('[data-testid="product-grid"]', { state: 'visible' });

  if (targetSubtotal >= 150) {
    // P-005 Silla Ergonómica $240 (stock 4) — cubre subtotales ≥ $150
    const btn = page.locator('[data-testid="product-P-005"] [data-testid="add-to-cart-button"]');
    await btn.waitFor({ state: 'visible' });
    await btn.click();
  } else {
    // P-001 Audífonos $89.90 (stock 12) — cubre subtotales < $150 con 1 ítem
    const btn = page.locator('[data-testid="product-P-001"] [data-testid="add-to-cart-button"]');
    await btn.waitFor({ state: 'visible' });
    await btn.click();
  }

  // Verificar que se agregó (cart-count debe ser > 0)
  await expect(page.locator('[data-testid="cart-count"]')).not.toHaveText('0');

  // Navegar al carrito via link del header (SPA — preserva estado React)
  await page.locator('[data-testid="nav-cart"]').click();
  await page.waitForURL(/\/cart/);
}

// ── Suite — data-driven ────────────────────────────────────────────────────

for (const tc of CASES as DiscountCase[]) {
  test(`${tc.id} | ${tc.description}`, async ({ page }) => {
    // Precondición: carrito poblado + navegación SPA al carrito
    await seedCartAndNavigate(page, tc.subtotalUsd);

    const cart = new CartPage(page);

    // Esperar resumen del carrito
    await expect(cart.summary()).toBeVisible();

    // Aplicar código
    await cart.applyDiscount(tc.discountCode);

    // Verificar mensaje de feedback
    await expect(cart.discountMessage()).toContainText(tc.expectedMessage);

    if (tc.expectedOutcome === 'applied' && tc.expectedDiscountUsd !== undefined && tc.expectedDiscountUsd > 0) {
      const discountAmount = await cart.readAmount(cart.summaryDiscount());
      expect(discountAmount).toBeCloseTo(tc.expectedDiscountUsd, 2);
    }
  });
}
