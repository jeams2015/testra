/**
 * QIA — Fixture Types
 *
 * Tipos TypeScript para todos los fixtures JSON de los tests.
 * El Automator genera fixtures que cumplen estas interfaces.
 */

// ── Auth ──────────────────────────────────────────────────────────────────

export interface LoginCase {
  id: string;
  description: string;
  email: string;
  password: string;
  expectedOutcome: 'success' | 'error';
  /** Texto esperado en login-error o login-email-error. Solo en casos de error. */
  expectedMessage?: string;
  /** Ruta a la que debe redirigir tras un login exitoso. */
  expectedRedirect?: string;
}

// ── Cart / Pricing ────────────────────────────────────────────────────────

export interface DiscountCase {
  id: string;
  description: string;
  /** Subtotal inicial del carrito (ya poblado por precondición). */
  subtotalUsd: number;
  discountCode: string;
  expectedOutcome: 'applied' | 'rejected';
  expectedMessage: string;
  /** Solo si outcome es 'applied'. */
  expectedDiscountUsd?: number;
  /** Regla de negocio que valida este caso. */
  rule: string;
}

export interface PricingCase {
  id: string;
  description: string;
  product: string;
  productName: string;
  unitPrice: number;
  qty: number;
  discountCode: string | null;
  expectedSubtotal: number;
  expectedDiscount: number;
  expectedShipping: number;
  expectedTax: number;
  expectedTotal: number;
  rules: string[];
}

// ── Full Flow ──────────────────────────────────────────────────────────────

export interface FullFlowCase {
  id: string;
  description: string;
  productId: string;
  quantity: number;
  discountCode?: string;
  credentials: { email: string; password: string };
  checkout: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
  };
  expectedTotal: number;
}
