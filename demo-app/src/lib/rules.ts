/**
 * Reglas de negocio de Nimbo Store.
 *
 * Este módulo concentra TODA la lógica de negocio testeable. El knowledge base
 * de Testra documenta estas reglas; el Scribe y el Sentinel las usan para
 * verificar la aritmética de los contratos.
 */

// ---- Constantes de negocio ----
export const IGV_RATE = 0.18; // 18% IGV (impuesto Perú)
export const FLAT_SHIPPING = 8.0; // costo de envío estándar
export const FREE_SHIPPING_THRESHOLD = 150.0; // envío gratis desde este subtotal
export const MAX_QTY_PER_ITEM = 10; // unidades máximas por producto en el carrito

// ---- Códigos de descuento ----
export interface DiscountCode {
  code: string;
  type: "percent" | "free-shipping";
  /** Valor del porcentaje si type = "percent". */
  value: number;
  /** Subtotal mínimo para que el código sea válido. */
  minSubtotal?: number;
}

export const DISCOUNT_CODES: DiscountCode[] = [
  { code: "BIENVENIDO10", type: "percent", value: 10 },
  { code: "VERANO25", type: "percent", value: 25, minSubtotal: 100 },
  { code: "ENVIOGRATIS", type: "free-shipping", value: 0 },
];

export interface DiscountResult {
  valid: boolean;
  reason?: string;
  applied?: DiscountCode;
}

/** Valida un código de descuento contra el subtotal actual. */
export function validateDiscountCode(
  rawCode: string,
  subtotal: number,
): DiscountResult {
  const code = rawCode.trim().toUpperCase();
  if (code === "") {
    return { valid: false, reason: "Ingresa un código." };
  }
  const found = DISCOUNT_CODES.find((d) => d.code === code);
  if (!found) {
    return { valid: false, reason: "El código no existe." };
  }
  if (found.minSubtotal !== undefined && subtotal < found.minSubtotal) {
    return {
      valid: false,
      reason: `Este código requiere un subtotal mínimo de $${found.minSubtotal.toFixed(2)}.`,
    };
  }
  return { valid: true, applied: found };
}

// ---- Cálculo de totales ----
export interface CartLine {
  unitPrice: number;
  quantity: number;
}

export interface OrderTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

/** Redondea a 2 decimales de forma estable. */
function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/**
 * Calcula los totales de la orden.
 * Total = (subtotal − descuento) + envío + IGV
 * El IGV se calcula sobre (subtotal − descuento).
 */
export function calculateTotals(
  lines: CartLine[],
  discount?: DiscountCode,
): OrderTotals {
  const subtotal = round2(
    lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0),
  );

  let discountAmount = 0;
  let freeShipping = false;

  if (discount) {
    if (discount.type === "percent") {
      discountAmount = round2(subtotal * (discount.value / 100));
    } else if (discount.type === "free-shipping") {
      freeShipping = true;
    }
  }

  const taxableBase = round2(subtotal - discountAmount);

  const shipping =
    freeShipping || subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0
      ? 0
      : FLAT_SHIPPING;

  const tax = round2(taxableBase * IGV_RATE);
  const total = round2(taxableBase + shipping + tax);

  return {
    subtotal,
    discount: discountAmount,
    shipping,
    tax,
    total,
  };
}

// ---- Validaciones de formulario ----
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Tarjeta válida: exactamente 16 dígitos (ignora espacios). */
export function isValidCardNumber(card: string): boolean {
  return /^\d{16}$/.test(card.replace(/\s/g, ""));
}

/** CVV válido: exactamente 3 dígitos. */
export function isValidCvv(cvv: string): boolean {
  return /^\d{3}$/.test(cvv.trim());
}
