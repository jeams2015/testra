# Flujo — Nueva historia

**Trigger:** el usuario proporciona un id de ticket (ej. `DEMO-42`) o usa `/new-story DEMO-42`.

Ejecutar este flujo automáticamente, paso a paso, sin pedir confirmación intermedia y sin saltarse ningún paso.

---

## Secuencia

### 1. Reporter — leer el ticket
- El Reporter obtiene el ticket de la PM tool y lo convierte en un `SourceTicket`.
- Si el ticket está vacío o incompleto → STOP, reportar al usuario.

### 2. Analyst — producir el Contract of Story
- El Analyst lee el knowledge base y transforma el ticket en un `Contract`.
- Detecta ambigüedades y las registra en `scribeAnalysis.ambiguitiesFound`.

### 3. Sentinel — validar el contrato (modo `contract`)
- ¿Veredicto **REJECTED**? → STOP. Reportar al usuario las correcciones necesarias.
  - Si el rechazo es por ambigüedades, normalmente requiere intervención humana (aclarar el ticket).
- ¿Veredicto **APPROVED**? → continuar.

### 4. Releaser — crear la rama
- `feature/{ticket-id}-{modulo}`.

### 5. Planner — planificar
- Lee el knowledge base. Abre browser solo para lo genuinamente nuevo.
- Produce el plan en `plans/{contractId}-plan.md`.

### 6. Automator — generar el código
- Lee TODOS los specs existentes primero.
- Genera specs / Page Objects / fixtures.
- Verifica que compila (`tsc --noEmit`).

### 7. Sentinel — validar el spec (modo `spec`)
- ¿Veredicto **REJECTED**? → el Automator corrige → volver a validar. Repetir hasta APPROVED limpio.
- ¿Veredicto **APPROVED**? → continuar.

### 8. Ejecutar los tests
- Correr los tests generados localmente.
- ¿Todos pasan? → paso 10.
- ¿Hay fallos? → paso 9.

### 9. Healer — diagnosticar fallos (si los hay)
- El Healer clasifica cada fallo: error de automatización o bug de la app.
- Error de automatización → repara (máx 2 intentos) → re-ejecutar.
- Bug de la app → NO se repara. El Reporter creará un bug `[AUTO]` en el paso 11.
- Si tras 2 intentos un fallo de automatización persiste → STOP, reportar al usuario.

### 10. Keeper — consolidar conocimiento
- Revisa los `KnowledgePatch` propuestos por el Healer.
- Consolida selectores, pantallas, reglas y patrones nuevos en el knowledge base.
- Reporta salud del knowledge base.

### 11. Releaser + Reporter — cerrar
- Releaser: commit + push + Pull Request.
- Reporter: comenta el resultado en el ticket; crea bugs `[AUTO]` si los hubo.

---

## Reglas del flujo

- **Validar antes de avanzar.** El contrato se valida antes de planificar; el spec antes de ejecutar.
- **Cero push sin APPROVED del Sentinel.**
- **Cost gate:** si el costo acumulado en el `costLedger` supera `TESTRA_BUDGET_PER_TICKET`, pausar y consultar al usuario.
- **Un fallo de la app no detiene el flujo** — se reporta como bug y el flujo continúa.
- **Un rechazo del Sentinel sí detiene** o retrocede el flujo, según el modo.

---

## Resultado esperado

Un PR abierto hacia `main` con los tests de la historia, el knowledge base actualizado, y un comentario en el ticket con el resumen.
