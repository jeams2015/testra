/**
 * QIA — Playwright Configuration
 *
 * Configuración central para todos los tests de Nimbo Store.
 * Lee la URL base desde APP_BASE_URL en el .env.
 *
 * Referencia: adapters/frameworks/playwright/conventions.md §7
 *
 * NOTA ESM: el proyecto usa "type":"module". dotenv no funciona con import ESM
 * en el runner de Playwright. Usamos createRequire para cargarlo vía CJS.
 */

import { defineConfig, devices } from '@playwright/test';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

// Cargar .env via CJS (compatible con ESM + Playwright runner)
const require = createRequire(import.meta.url);
try {
  const dotenv = require('dotenv');
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  dotenv.config({ path: path.join(__dirname, '.env') });
} catch {
  // .env no existe en CI — es esperado
}

export default defineConfig({
  testDir: './tests',

  // Tiempo máximo por test (ms). Generoso para flujos full-flow.
  timeout: 45_000,

  // Un retry absorbe flakiness de red en CI.
  retries: process.env.CI ? 1 : 0,

  // Correr specs en paralelo (workers = CPU / 2 en CI).
  workers: process.env.CI ? 2 : undefined,

  // Reporters: html para revisar offline, list para CI, json para el Healer.
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'playwright-report/results.json' }],
  ],

  use: {
    // La app corre en localhost durante el desarrollo.
    // En CI apunta a staging via APP_BASE_URL.
    baseURL: process.env.APP_BASE_URL ?? 'http://localhost:5173',

    // Capturas y video solo en fallos — reduce ruido.
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Levanta la demo-app automáticamente si no hay APP_BASE_URL externo.
  webServer: process.env.APP_BASE_URL
    ? undefined
    : {
        command: 'npm run dev',
        cwd: './demo-app',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
      },
});
