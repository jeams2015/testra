# Adapter — Claude

> Define qué modelo de LLM usan los agentes del Council y cómo se calcula el costo. Para soportar otro proveedor (GPT, Gemini), se crea un adapter hermano.

**Proveedor:** Anthropic Claude · **Integración:** Claude Code

---

## 1. Configuración

Variable de entorno (de `.env`):

```
LLM_PROVIDER      = claude
ANTHROPIC_API_KEY = tu API key
```

## 2. Modelos por agente

Cada agente del Council declara su modelo en el frontmatter de su archivo (`.claude/agents/*.md`). Recomendación v1.0:

| Agente | Modelo sugerido | Por qué |
|---|---|---|
| Analyst | sonnet | Análisis de lenguaje, precisión |
| Sentinel | sonnet | Juicio crítico riguroso |
| Planner | sonnet | Razonamiento + navegación |
| Automator | sonnet | Generación de código |
| Healer | sonnet | Diagnóstico complejo |
| Keeper | sonnet | Consolidación documental |
| Releaser | sonnet | Operaciones Git (tarea acotada) |
| Reporter | sonnet | Integración API (tarea acotada) |

> Releaser y Reporter hacen tareas acotadas — podrían usar un modelo más liviano para optimizar costo. Evaluar en Fase 2 con datos reales del `costLedger`.

## 3. Cálculo de costo

Cada agente, al terminar, registra una `AgentCostEntry` en el `costLedger` del contrato:

```typescript
{
  agent: "Analyst",
  llmUsed: "claude-sonnet-...",
  tokensIn: <n>,
  tokensOut: <n>,
  costUsd: tokensIn * PRICE_IN + tokensOut * PRICE_OUT,
  durationMs: <n>,
  runId: "<id>"
}
```

Los precios por token (`PRICE_IN`, `PRICE_OUT`) se configuran según la tarifa vigente del modelo. El adapter mantiene esa tabla de precios actualizada.

## 4. Cost gate

- `TESTRA_BUDGET_PER_TICKET` (de `.env`) define el presupuesto máximo por ticket.
- El orquestador suma el `costLedger` tras cada agente.
- Si el acumulado supera el presupuesto → **pausa el flujo y consulta al usuario** antes de continuar.
- Esto evita que un ticket problemático consuma costo sin control. Es un diferenciador clave de Testra.

## 5. Council of Validators (modo paranoid — opcional)

Para tickets críticos, el Sentinel puede invocar 2-3 LLMs en paralelo (ej. Claude + GPT vía sus adapters) y aprobar solo si hay consenso. El resultado se guarda en `ValidationResult.consensusFrom`. Modo opcional, se activa por configuración.

---

**Schema del adapter:** v1.0.0 · **Proveedor destino:** Anthropic Claude
