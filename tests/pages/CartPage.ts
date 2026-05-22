/**
 * QIA — CartPage
 *
 * Page Object de la pantalla /cart de Nimbo Store.
 * Selectores: SCREEN-03 del knowledge base (knowledge/screens.md).
 * Reglas de negocio: RULE-TAX-01, RULE-SHIP-01, RULE-TOTAL-01, RULE-DISC-01.
 */

import { BasePage } from './BasePage';
import type { Locator } from '@playwright/test';

export class CartPage extends BasePage {
  // ── Ruta ──────────────────────────────────────────────────────────────────
  override async goto(): Promise<void> {
    await this.page.goto('/cart');
  }

  // ── Selectores privados (SCREEN-03) ───────────────────────────────────────
  private discountInput(): Locator   { return this.page.getByTestId('discount-input'); }
  private applyButton(): Locator     { return this.page.getByTestId('apply-discount'); }

  // Locators de lectura — usados en aserciones
  summary(): Locator          { return this.page.getByTestId('cart-summary'); }
  emptyCart(): Locator        { return this.page.getByTestId('empty-cart'); }
  discountMessage(): Locator  { return this.page.getByTestId('discount-message'); }
  summarySubtotal(): Locator  { return this.page.getByTestId('summary-subtotal'); }
  summaryDiscount(): Locator  { return this.page.getByTestId('summary-discount'); }
  summaryShipping(): Locator  { return this.page.getByTestId('summary-shipping'); }
  summaryTax(): Locator       { return this.page.getByTestId('summary-tax'); }
  summaryTotal(): Locator     { return this.page.getByTestId('summary-total'); }
  proceedButton(): Locator    { return this.page.getByTestId('proceed-checkout'); }

  // ── Acciones públicas ──────────────────────────────────────────────────────

  /** Aplica un código de descuento. */
  async applyDiscount(code: string): Promise<void> {
    await this.discountInput().fill(code);
    await this.applyButton().click();
  }

  /**
   * Lee el valor numérico de un campo de resumen (elimina símbolo $ y espacios).
   * Útil para aserciones aritméticas.
   */
  async readAmount(locator: Locator): Promise<number> {
    const text = (await locator.textContent() ?? '0').trim();
    // La app muestra "Gratis" cuando shipping = $0
    if (text.toLowerCase() === 'gratis') return 0;
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }
}
