# Adapter — Playwright

> Este archivo lo lee el **Automator** antes de generar código. Define cómo se escribe un test de Playwright en Testra. Para soportar otro framework (Cypress, etc.), se crea un adapter hermano — el Automator no cambia.

**Framework:** `@playwright/test` · **Lenguaje:** TypeScript

---

## 1. Estructura de un spec

Un spec por feature. Vive en `tests/features/{NN}-{feature}/{kebab-nombre}.spec.ts`.

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import type { LoginCase } from '@fixtures/types';
import CASES from '@fixtures/data/login-cases.json';

for (const tc of CASES as LoginCase[]) {
  test(`${tc.id} | ${tc.description}`, async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.signIn(tc.email, tc.password);
    await expect(login.result()).toHaveText(tc.expectedMessage);
  });
}
```

## 2. Data-driven — obligatorio

- Todo test lee su perfil de un fixture JSON en `tests/fixtures/data/`.
- Nunca se hardcodean valores en el spec.
- Los tipos de los fixtures viven en `tests/fixtures/types.ts`.
- El test se parametriza con un `for...of` sobre el array de casos.

## 3. Page Object Model — obligatorio

- Cada pantalla = un Page Object en `tests/pages/{NombrePage}.ts`.
- El spec describe el QUÉ; el Page Object encapsula el CÓMO (la interacción con el DOM).
- Todos los Page Objects extienden `BasePage`.

```typescript
// tests/pages/BasePage.ts
import type { Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}
  async goto(path = ''): Promise<void> {
    await this.page.goto(path);
  }
}
```

## 4. Selectores — desde el knowledge base

- El Automator usa los selectores que el plan del Planner especifica (vienen del knowledge base).
- **Orden de preferencia:** `getByTestId` > `getByRole` > `getByLabel` > `getByText` > CSS > XPath.
- Si un selector tiene `stability: fragile`, el Page Object incluye su fallback.
- Nunca selectores CSS crudos sueltos en el spec — siempre encapsulados en el Page Object.

## 5. Aserciones

- Aserciones fuertes: verifica QUÉ aparece, no que "algo" aparece.
- `await expect(locator).toHaveText('...')` — no `await expect(locator).toBeVisible()` a secas cuando se puede verificar el contenido.
- Web-first assertions (con auto-wait de Playwright) — no `waitForTimeout` manual.

## 6. Convenciones de código

- **Path aliases:** `@pages/*`, `@fixtures/*`, `@core/*`. Nunca rutas relativas largas.
- **Nombres de test:** `` `${tc.id} | ${tc.description}` `` — el id primero, para filtrar con `--grep`.
- **Contextos de browser separados** si la app tiene múltiples portales (cookies que colisionan).
- **Datos únicos generados** (email, identificadores) con `Date.now()` cuando el sistema los usa como llave.

## 7. Configuración (`playwright.config.ts`)

- `testDir: './tests'`
- `retries: 1` — un retry absorbe flakiness de red en CI.
- `timeout` generoso para flujos largos (full-flow).
- Reporters: `html`, `list`, `json` (el `json` lo lee el Healer).
- `screenshot: 'only-on-failure'`, `video: 'retain-on-failure'`.

## 8. Plantilla de Page Object (referencia para el Automator)

```typescript
import { BasePage } from './BasePage';
import type { Locator } from '@playwright/test';

export class LoginPage extends BasePage {
  // Selectores — ids del knowledge base
  private emailInput(): Locator { return this.page.getByTestId('email'); }
  private passwordInput(): Locator { return this.page.getByTestId('password'); }
  private submitButton(): Locator { return this.page.getByRole('button', { name: 'Ingresar' }); }

  // Acciones — el "cómo"
  async signIn(email: string, password: string): Promise<void> {
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
    await this.submitButton().click();
  }

  // Lectura de resultados
  result(): Locator { return this.page.getByTestId('login-result'); }
}
```

---

**Schema del adapter:** v1.0.0 · **Framework destino:** Playwright `^1.51.0`
