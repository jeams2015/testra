# Flujo — Regression

**Trigger:** `/regression` (suite completa) o `/regression-critical` (solo critical path).

---

## Propósito

Validar que toda la plataforma sigue funcionando tras un deploy, cambio mayor o release. A diferencia del retest —que parte de bugs conocidos— la regression **descubre** fallos nuevos.

---

## Tiers de ejecución

Los tests se ejecutan por tiers, según su `criticality` en el contrato:

| Tier | Qué incluye | Comportamiento ante fallo |
|---|---|---|
| **Tier 1 — Critical** | Tests `criticality: critical` — el critical path | Fail-fast: si un test crítico falla, se reporta de inmediato |
| **Tier 2 — High** | Tests `criticality: high` | Continúa, acumula fallos |
| **Tier 3 — Resto** | `medium` y `low` | Continúa, acumula fallos |

`/regression-critical` corre solo el Tier 1.

---

## Secuencia

### 1. Seleccionar el conjunto de tests
- Leer `tests/features/` y clasificar por `criticality`.

### 2. Ejecutar Tier 1 (Critical)
- Correr los tests críticos.
- Si alguno falla → reportarlo inmediatamente (fail-fast), pero continuar con los tiers siguientes para tener el panorama completo.

### 3. Ejecutar Tier 2 y Tier 3
- Correr el resto, acumulando resultados.

### 4. Healer — diagnosticar (NO reparar automático)
- El Healer diagnostica cada fallo y lo clasifica: error de automatización o bug de la app.
- **En regression, los fixes del Healer NO van directo a main.** Van a un PR de revisión aparte. La regression es un diagnóstico, no un fix automático.

### 5. Reporter — reportar
- Resumen ejecutivo: cuántos pasaron / fallaron por tier.
- Bugs de la app detectados → issues `[AUTO]`.
- Tests de automatización rotos → listados para revisión.

---

## Reglas del flujo

- **La regression descubre, no repara.** Cualquier fix del Healer va a un PR de revisión separado, nunca directo a `main`.
- **Fail-fast solo en Tier 1.** Un fallo crítico se reporta de inmediato; los tiers siguientes igual se corren para el panorama completo.
- **Stagger entre jobs paralelos** si la app de staging se degrada bajo carga.

---

## Resultado esperado

Un reporte ejecutivo del estado de la plataforma: qué funciona, qué se rompió, qué es bug de la app y qué es test que necesita mantenimiento.
