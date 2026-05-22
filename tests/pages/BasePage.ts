/**
 * QIA — BasePage
 *
 * Clase base para todos los Page Objects de Nimbo Store.
 * Todos los Page Objects extienden esta clase.
 *
 * Convenciones:
 * - Los métodos públicos describen el QUÉ (acciones de usuario).
 * - Los selectores privados encapsulan el CÓMO (interacción con el DOM).
 * - Siempre usar data-testid (getByTestId) como primera opción.
 */

import type { Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /**
   * Navega a la ruta indicada (relativa al baseURL de playwright.config.ts).
   * Si no se pasa ruta, navega a la raíz de la pantalla definida por la subclase.
   */
  async goto(path = ''): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Espera a que la red esté idle — útil en navegaciones tras submit.
   */
  protected async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
}
