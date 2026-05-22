# Testra — Orquestador del Council

> Este archivo define cómo Claude Code orquesta los 8 agentes del Council. Es lo primero que se lee al iniciar cualquier flujo.

---

## Qué es Testra

Testra convierte un ticket de PM tool en tests automatizados, validados y listos para PR. La metodología se llama **QIA** (QA + IA): el ingeniero orquesta y supervisa; los agentes ejecutan.

- App bajo prueba: ver `APP_BASE_URL` en `.env`
- Framework: Playwright + TypeScript (v1.0)
- PM Tool: Jira (v1.0)
- Stack de orquestación: Claude Code

---

## ⛔ Protocolo — leer antes de cualquier acción

Estas reglas se aplican en CADA historia, sin excepción.

### Prohibiciones absolutas

| ❌ Prohibido | ✅ Correcto |
|---|---|
| Que el orquestador escriba specs directamente | Siempre delegar al **Automator** |
| Continuar con observaciones abiertas del Sentinel | Corregir → reenviar → esperar APROBADO limpio |
| Saltar pasos del flujo "porque parece obvio" | Seguir el flujo paso a paso |
| Generar el spec y luego validar la historia | Validar la historia ANTES de planificar; validar el spec ANTES de ejecutar |
| Hacer push sin ✅ APROBADO del Sentinel | Cero push sin aprobación explícita |
| Que un agente ignore el cost gate | Si se excede `TESTRA_BUDGET_PER_TICKET`, pausar y reportar |

### Secuencia obligatoria — cada historia

```
1. Reporter      lee el ticket de la PM tool
2. Analyst       produce el Contract of Story
3. Sentinel     valida el contrato (modo "contract") → ¿APPROVED? Si no → STOP
4. Releaser      crea la rama
5. Planner   planifica (knowledge-first; abre browser solo si necesario)
6. Automator        genera el código
7. Sentinel     valida el spec (modo "spec") → ¿APPROVED limpio? Si no → Automator corrige → re-valida
8. Ejecuta los tests
9. Healer       si hay fallos de automatización, repara (máx 2 intentos)
10. Keeper     consolida el conocimiento nuevo en el knowledge base
11. Releaser     commit + PR; Reporter comenta en la PM tool
```

**Si el Sentinel dice RECHAZADO → volver al paso anterior. No existe "APROBADO con observaciones".**

---

## Los 8 agentes del Council

| Agente | Archivo | Rol |
|---|---|---|
| **Analyst** | `.claude/agents/analyst.md` | Ticket → Contract of Story |
| **Sentinel** | `.claude/agents/sentinel.md` | Aprueba/Rechaza — contratos, specs y PRs |
| **Planner** | `.claude/agents/planner.md` | Planifica rutas — knowledge-first |
| **Automator** | `.claude/agents/automator.md` | Genera el código de los tests |
| **Healer** | `.claude/agents/healer.md` | Repara tests fallidos + alimenta el knowledge base |
| **Keeper** | `.claude/agents/keeper.md` | Guardián del knowledge base |
| **Releaser** | `.claude/agents/releaser.md` | Git: ramas, commits, PRs |
| **Reporter** | `.claude/agents/reporter.md` | Puente con la PM tool |

> v1.0: solo el prompt del Analyst está completo. El resto se redacta en orden de pipeline durante la Fase 1.

---

## Artefactos centrales

- **Contract of Story** — `core/types/contract.ts`. Fluye por todo el pipeline.
- **Knowledge Base** — `core/types/knowledge.ts`. Memoria de la app. Vive en `knowledge/`.

---

## Reglas del orquestador

1. **Los subagentes no orquestan recursivamente** — solo Claude Code principal sigue los flujos.
2. **El orquestador NUNCA escribe specs** — siempre delega al Automator.
3. **El Healer solo actúa ante errores de automatización** — nunca ante un bug real de la app. Si la app no cumple la assertion, el fallo es válido y es un bug de la app.
4. **Máximo 2 intentos de reparación** por el Healer. Si falla, reportar al usuario.
5. **El Sentinel solo emite APPROVED o REJECTED.** Sin términos medios.
6. **Knowledge-first**: el Planner lee `knowledge/` antes de abrir un browser.
7. **Cost-aware**: cada agente registra tokens en el `costLedger` del contrato.

---

## Comandos disponibles

| Comando | Trigger | Flujo |
|---|---|---|
| `/new-story <TICKET>` | Nuevo ticket | Pipeline completo: ticket → PR |
| `/retest <TICKET>` | Retest de bugs resueltos | Ejecuta → Healer si necesario → cierra bugs |
| `/heal <TEST>` | Test fallido | Diagnóstico + reparación con el Healer |
| `/coverage` | On-demand | Mapa de cobertura + gaps |

> Los comandos se definen en `.claude/commands/`. Los flujos en `.claude/flows/`.

---

**Schema versions:** contract `1.0.0` · knowledge `1.0.0`
