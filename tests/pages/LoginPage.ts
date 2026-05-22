/**
 * QIA — LoginPage
 *
 * Page Object de la pantalla /login de Nimbo Store.
 * Selectores: SCREEN-02 del knowledge base (knowledge/screens.md).
 * Reglas de negocio: RULE-AUTH-01, RULE-VAL-01.
 */

import { BasePage } from './BasePage';
import type { Locator } from '@playwright/test';

export class LoginPage extends BasePage {
  // ── Ruta ──────────────────────────────────────────────────────────────────
  override async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  // ── Selectores privados (SCREEN-02) ───────────────────────────────────────
  private form(): Locator          { return this.page.getByTestId('login-form'); }
  private emailInput(): Locator    { return this.page.getByTestId('login-email'); }
  private passwordInput(): Locator { return this.page.getByTestId('login-password'); }
  private submitButton(): Locator  { return this.page.getByTestId('login-submit'); }

  // Locators de lectura — usados en las aserciones del spec
  emailError(): Locator   { return this.page.getByTestId('login-email-error'); }
  globalError(): Locator  { return this.page.getByTestId('login-error'); }

  // ── Acciones públicas ──────────────────────────────────────────────────────

  /** Completa el formulario y hace submit. */
  async signIn(email: string, password: string): Promise<void> {
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
    await this.submitButton().click();
  }

  /** Llena solo el email (para tests de validación de formato). */
  async fillEmail(email: string): Promise<void> {
    await this.emailInput().fill(email);
    await this.emailInput().blur();
  }

  /** Indica si el formulario está visible. */
  async isVisible(): Promise<boolean> {
    return this.form().isVisible();
  }
}
