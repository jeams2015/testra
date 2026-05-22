# Flujo — Retest

**Trigger:** `/retest DEMO-42` — un desarrollador resolvió bugs vinculados a un ticket y hay que reverificar.

---

## Propósito

El retest NO genera tests nuevos. Re-ejecuta tests que ya existen, vinculados a bugs que supuestamente fueron resueltos, y confirma si efectivamente lo están.

---

## Secuencia

### 1. Reporter — obtener bugs vinculados
- El Reporter busca en la PM tool los bugs vinculados al ticket que están marcados como resueltos.
- Identifica qué test cubre cada bug.

### 2. Ejecutar los tests vinculados
- Correr exactamente los tests que cubren esos bugs.

### 3. Evaluar resultados
- **Test pasa** → el bug está realmente resuelto.
- **Test falla** → el Healer diagnostica:
  - ¿Bug de la app sigue presente? → el "fix" no funcionó. NO se repara nada. Se reporta.
  - ¿Error de automatización? → el Healer repara (máx 2 intentos) y re-ejecuta.

### 4. Keeper — consolidar (si hubo cambios)
- Si el Healer generó `KnowledgePatch`, el Keeper los revisa.

### 5. Reporter — reportar y cerrar bugs
- Para cada bug cuyo test ahora pasa → el Reporter comenta y transiciona el bug a cerrado.
- Para cada bug cuyo test sigue fallando → el Reporter comenta que el fix no funcionó y reabre / mantiene abierto el bug.

---

## Reglas del flujo

- **El retest no crea specs nuevos.** Solo ejecuta los existentes.
- **Regla fundamental:** el spec es el contrato del negocio. Si un test sigue fallando porque la app no cumple, ese fallo es válido — es el bug que no se resolvió. No se toca el test.
- **El Healer solo repara errores de automatización**, nunca discrepancias reales de la app.

---

## Resultado esperado

Cada bug vinculado queda con un estado claro: cerrado (si su test pasa) o sigue abierto con comentario (si su test falla).
