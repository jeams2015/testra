import { createContext, useContext, useState, type ReactNode } from "react";
import { MAX_QTY_PER_ITEM, type DiscountCode } from "../lib/rules";
import { findProduct } from "../data/products";

export interface CartItem {
  productId: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  /** Devuelve un mensaje de error si no se pudo agregar, o null si OK. */
  addItem: (productId: string, quantity?: number) => string | null;
  setQuantity: (productId: string, quantity: number) => string | null;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  itemCount: number;
  /** Descuento aplicado al carrito (persiste hacia el checkout). */
  discount: DiscountCode | null;
  setDiscount: (d: DiscountCode | null) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<DiscountCode | null>(null);

  function addItem(productId: string, quantity = 1): string | null {
    const product = findProduct(productId);
    if (!product) return "Producto no encontrado.";
    if (product.stock === 0) return "Producto agotado.";

    const existing = items.find((i) => i.productId === productId);
    const current = existing ? existing.quantity : 0;
    const next = current + quantity;

    if (next > product.stock) {
      return `Solo quedan ${product.stock} unidades disponibles.`;
    }
    if (next > MAX_QTY_PER_ITEM) {
      return `Máximo ${MAX_QTY_PER_ITEM} unidades por producto.`;
    }

    setItems((prev) => {
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: next } : i,
        );
      }
      return [...prev, { productId, quantity }];
    });
    return null;
  }

  function setQuantity(productId: string, quantity: number): string | null {
    const product = findProduct(productId);
    if (!product) return "Producto no encontrado.";
    if (quantity < 1) {
      removeItem(productId);
      return null;
    }
    if (quantity > product.stock) {
      return `Solo quedan ${product.stock} unidades disponibles.`;
    }
    if (quantity > MAX_QTY_PER_ITEM) {
      return `Máximo ${MAX_QTY_PER_ITEM} unidades por producto.`;
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    );
    return null;
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function clearCart() {
    setItems([]);
    setDiscount(null);
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        setQuantity,
        removeItem,
        clearCart,
        itemCount,
        discount,
        setDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
