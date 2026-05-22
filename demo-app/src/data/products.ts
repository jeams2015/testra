/** Catálogo de Nimbo Store — datos estáticos de demo. */

export interface Product {
  id: string;
  name: string;
  category: "Tecnología" | "Hogar" | "Oficina";
  price: number;
  stock: number;
  description: string;
  emoji: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "P-001",
    name: "Audífonos Inalámbricos Nimbo Air",
    category: "Tecnología",
    price: 89.9,
    stock: 12,
    description: "Audífonos bluetooth con cancelación de ruido y 30h de batería.",
    emoji: "🎧",
  },
  {
    id: "P-002",
    name: "Teclado Mecánico Nimbo Type",
    category: "Tecnología",
    price: 129.0,
    stock: 7,
    description: "Teclado mecánico retroiluminado, switches silenciosos.",
    emoji: "⌨️",
  },
  {
    id: "P-003",
    name: "Mouse Ergonómico Nimbo Grip",
    category: "Tecnología",
    price: 45.5,
    stock: 20,
    description: "Mouse vertical ergonómico, reduce la tensión de muñeca.",
    emoji: "🖱️",
  },
  {
    id: "P-004",
    name: "Lámpara de Escritorio Nimbo Glow",
    category: "Oficina",
    price: 59.9,
    stock: 0,
    description: "Lámpara LED regulable con tres temperaturas de color.",
    emoji: "💡",
  },
  {
    id: "P-005",
    name: "Silla Ergonómica Nimbo Rest",
    category: "Oficina",
    price: 240.0,
    stock: 4,
    description: "Silla de oficina con soporte lumbar y apoyabrazos ajustable.",
    emoji: "🪑",
  },
  {
    id: "P-006",
    name: "Termo Inteligente Nimbo Heat",
    category: "Hogar",
    price: 34.9,
    stock: 30,
    description: "Termo de acero que mantiene la temperatura por 12 horas.",
    emoji: "🧴",
  },
  {
    id: "P-007",
    name: "Organizador de Escritorio Nimbo Tidy",
    category: "Oficina",
    price: 22.0,
    stock: 15,
    description: "Organizador de bambú para útiles y accesorios.",
    emoji: "🗄️",
  },
  {
    id: "P-008",
    name: "Parlante Portátil Nimbo Boom",
    category: "Tecnología",
    price: 75.0,
    stock: 9,
    description: "Parlante bluetooth resistente al agua, sonido 360°.",
    emoji: "🔊",
  },
];

export function findProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
