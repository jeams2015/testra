# Nimbo Store — Demo-app de Testra

Tienda e-commerce de demostración. Es el **campo de pruebas** sobre el cual corren los tests del Council de Testra. No es un producto real — existe para que el framework tenga una app realista que probar.

## Stack

Vite + React 18 + TypeScript + React Router.

## Correr localmente

```bash
npm install
npm run dev      # http://localhost:5173
```

## Pantallas

| Ruta | Pantalla |
|---|---|
| `/` | Catálogo de productos con filtro por categoría |
| `/login` | Inicio de sesión |
| `/cart` | Carrito con códigos de descuento y totales |
| `/checkout` | Formulario de envío y pago (requiere login) |
| `/confirmation` | Confirmación de la orden |

## Credencial de demo

`demo@nimbo.store` / `nimbo123`

## Reglas de negocio (en `src/lib/rules.ts`)

- **IGV:** 18% sobre (subtotal − descuento).
- **Envío:** $8 plano; **gratis** desde $150 de subtotal.
- **Máximo por producto:** 10 unidades.
- **Stock:** no se puede agregar más de lo disponible.
- **Códigos de descuento:**
  - `BIENVENIDO10` — 10% de descuento.
  - `VERANO25` — 25% de descuento (requiere subtotal ≥ $100).
  - `ENVIOGRATIS` — envío gratis.
- **Validaciones:** email con formato válido, tarjeta de 16 dígitos, CVV de 3 dígitos, vencimiento MM/AA.

## data-testid

Todos los elementos interactivos tienen atributo `data-testid`. Esto es deliberado: Testra predica selectores basados en `testid`, así que la demo-app practica lo que el framework enseña. El knowledge base de Testra referencia estos `data-testid`.
