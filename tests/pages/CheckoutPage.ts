/**
 * QIA — CheckoutPage
 *
 * Page Object de /checkout y /confirmation de Nimbo Store.
 * Selectores: SCREEN-04 y SCREEN-05 del knowledge base (knowledge/screens.md).
 * Reglas: RULE-AUTH-01, RULE-VAL-01.
 */

import { BasePage } from './BasePage';
import type { Locator } from '@playwright/test';

export class CheckoutPage extends BasePage {
  // ── Checkout (/checkout) ───────────────────────────────────────────────────

  form(): Locator             { return this.page.getByTestId('checkout-form'); }
  emptyCheckout(): Locator    { return this.page.getByTestId('checkout-empty'); }

  // Resumen de precios en checkout
  subtotal(): Locator         { return this.page.getByTestId('checkout-subtotal'); }
  discount(): Locator         { return this.page.getByTestId('checkout-discount'); }
  shipping(): Locator         { return this.page.getByTestId('checkout-shipping'); }
  tax(): Locator              { return this.page.getByTestId('checkout-tax'); }
  total(): Locator            { return this.page.getByTestId('checkout-total'); }
  placeOrderBtn(): Locator    { return this.page.getByTestId('place-order'); }

  // Campos del formulario — por data-testid (verificados en source)
  fullNameInput(): Locator    { return this.page.getByTestId('checkout-name'); }
  emailInput(): Locator       { return this.page.getByTestId('checkout-email'); }
  addressInput(): Locator     { return this.page.getByTestId('checkout-address'); }
  cityInput(): Locator        { return this.page.getByTestId('checkout-city'); }
  cardNumberInput(): Locator  { return this.page.getByTestId('checkout-card'); }
  expiryInput(): Locator      { return this.page.getByTestId('checkout-expiry'); }
  cvvInput(): Locator         { return this.page.getByTestId('checkout-cvv'); }

  // ── Confirmation (/confirmation) ──────────────────────────────────────────

  confirmationRoot(): Locator  { return this.page.getByTestId('confirmation'); }
  orderId(): Locator           { return this.page.getByTestId('order-id'); }
  orderEmail(): Locator        { return this.page.getByTestId('order-email'); }
  orderTotal(): Locator        { return this.page.getByTestId('order-total'); }
  backToCatalogLink(): Locator { return this.page.getByTestId('back-to-catalog'); }

  // ── Acciones ──────────────────────────────────────────────────────────────

  /** Rellena el formulario de checkout y hace submit. */
  async fillAndSubmit(data: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
  }): Promise<void> {
    await this.fullNameInput().fill(data.fullName);
    await this.emailInput().fill(data.email);
    await this.addressInput().fill(data.address);
    await this.cityInput().fill(data.city);
    await this.cardNumberInput().fill(data.cardNumber);
    await this.expiryInput().fill(data.expiry);
    await this.cvvInput().fill(data.cvv);
    await this.placeOrderBtn().click();
  }

  /** Lee el total de la confirmación como número. */
  async readConfirmedTotal(): Promise<number> {
    const text = await this.orderTotal().textContent() ?? '0';
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }
}
