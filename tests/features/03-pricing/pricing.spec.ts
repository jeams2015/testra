/**
 * QIA · Feature 03 — Precios
 *
 * Valida la aritmética completa de la orden: subtotal, descuento,
 * envío, IGV y total. Toda la lógica vive en demo-app/src/lib/rules.ts.
 *
 * Reglas cubiertas: RULE-TAX-01, RULE-SHIP-01, RULE-TOTAL-01, RULE-DISC-01
 * Generado por: Automator (demo manual — Fase 1)
 * Contract: QIA-DEMO-003 · Schema v1.0.0
 */

import { test, expect } from '@playwright/test';
import { CartPage } from '@pages/CartPage';
import type { PricingCase } from '@fixtures/types';
import CASES from '@fixtures/data/pricing-cases.json' with { type: 'json' };

// Helper: agrega un producto al carrito con la cantidad deseada y navega via SPA
async function seedAndNavigate(
  page: import('@playwright/test').Page,
  productId: string,
  qty: number,
) {
  await page.goto('/catalog');
  await page.waitForSelector('[data-testid="product-grid"]', { state: 'visible' });

  const card = page.locator(`[data-testid="product-${productId}"]`);
  await card.waitFor({ state: 'visible' });

  // Ajustar cantidad con botón + si qty > 1
  if (qty > 1) {
    const inc = card.locator('[data-testid="qty-increase"]');
    for (let i = 1; i < qty; i++) await inc.click();
  }

  await card.locator('[data-testid="add-to-cart-button"]').click();
  await expect(page.locator('[data-testid="cart-count"]')).not.toHaveText('0');

  // Navegar al carrito via SPA (APP-PATTERN-01: no usar page.goto)
  await page.locator('[data-testid="nav-cart"]').click();
  await page.waitForURL(/\/cart/);
}

// ── Suite — data-driven ────────────────────────────────────────────────────

for (const tc of CASES as PricingCase[]) {
  test(`${tc.id} | ${tc.description}`, async ({ page }) => {
    await seedAndNavigate(page, tc.product, tc.qty);

    const cart = new CartPage(page);
    await expect(cart.summary()).toBeVisible();

    // Aplicar descuento si el caso lo requiere
    if (tc.discountCode) {
      await cart.applyDiscount(tc.discountCode);
      await expect(cart.discountMessage()).toBeVisible();
    }

    // ── Aserciones de aritmética ───────────────────────────────────────────

    const subtotal = await cart.readAmount(cart.summarySubtotal());
    expect(subtotal).toBeCloseTo(tc.expectedSubtotal, 2);

    const shipping = await cart.readAmount(cart.summaryShipping());
    expect(shipping).toBeCloseTo(tc.expectedShipping, 2);

    const tax = await cart.readAmount(cart.summaryTax());
    expect(tax).toBeCloseTo(tc.expectedTax, 2);

    const total = await cart.readAmount(cart.summaryTotal());
    expect(total).toBeCloseTo(tc.expectedTotal, 2);

    if (tc.expectedDiscount > 0) {
      const discount = await cart.readAmount(cart.summaryDiscount());
      expect(discount).toBeCloseTo(tc.expectedDiscount, 2);
    }
  });
}
