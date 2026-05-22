# Testra

> **El framework del nuevo QA.** Orquestación de testing con IA, basada en la metodología QIA.

Testra convierte un ticket de tu PM tool en tests automatizados, validados y listos para PR — sin intervención manual para historias estándar. Un Council de 8 agentes de IA se encarga de leer, planificar, generar, validar, ejecutar y reparar.

---

## Qué es QIA

**QIA** (QA + IA) es la metodología detrás de Testra: el nuevo rol del QA, donde el ingeniero deja de escribir cada test a mano y pasa a orquestar, supervisar y curar el conocimiento. Testra es la herramienta que hace QIA realidad.

## El Council — 8 agentes

| Agente | Rol |
|---|---|
| **Analyst** | Lee el ticket de la PM tool → produce el Contract of Story |
| **Sentinel** | Aprueba o rechaza contratos, specs y PRs — sin términos medios |
| **Planner** | Planifica las rutas de prueba — knowledge-first |
| **Automator** | Genera el código de los tests |
| **Healer** | Repara tests fallidos y alimenta el knowledge base |
| **Keeper** | Guardián del knowledge base |
| **Releaser** | Gestiona Git: ramas, commits, PRs |
| **Reporter** | Puente con la PM tool (Jira, Linear, etc.) |

## Stack

- **Playwright** + **TypeScript** — motor de testing (v1.0)
- **Claude Code** — orquestador de los agentes
- **GitHub Actions** — CI/CD
- **Jira** — gestión de historias (v1.0)

> v1.0 soporta Playwright + Jira + Claude. Cypress, Linear, Azure DevOps y otros LLMs llegan en versiones siguientes vía el sistema de adapters.

## Arquitectura

```
core/        Lógica framework-agnóstica: tipos, orquestador, control de costo
adapters/    Conectores intercambiables
  frameworks/  playwright (cypress, selenium → futuro)
  pm-tools/    jira (linear, azure → futuro)
  llm/         claude (openai, gemini → futuro)
.claude/     Los 8 agentes, comandos slash y flujos de orquestación
knowledge/   El knowledge base: selectores, reglas, flujos, patrones
demo-app/    App de demostración (Next.js) sobre la que corren los tests
tests/       Los tests generados
```

## Conceptos clave

- **Contract of Story** — artefacto central que fluye por el pipeline. Ver `core/types/contract.ts`.
- **Knowledge Base** — memoria compartida y versionada de la app. Ver `core/types/knowledge.ts`.
- **Knowledge-first** — los agentes leen el knowledge base antes de abrir un browser.
- **Self-improving loop** — cuando el Healer repara algo, propone un parche al knowledge base.
- **Cost gates** — cada agente reporta tokens; presupuesto configurable por ticket.

## Estado

🚧 En desarrollo — Fase 1 (Core MVP). Ver `docs/` para el roadmap.

## Licencia

Por definir. Ver `docs/`.
