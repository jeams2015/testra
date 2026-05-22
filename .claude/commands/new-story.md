Ejecuta el flujo completo de nueva historia para el ticket $ARGUMENTS.

Sigue el protocolo definido en `.claude/flows/01-new-ticket.md` paso a paso, sin saltarte ninguno y sin pedir confirmación intermedia:

1. Reporter lee el ticket $ARGUMENTS de la PM tool
2. Analyst produce el Contract of Story
3. Sentinel valida el contrato (modo contract) — si RECHAZADO, detente y reporta
4. Releaser crea la rama
5. Planner planifica (knowledge-first)
6. Automator genera el código
7. Sentinel valida el spec (modo spec) — si RECHAZADO, Automator corrige y revalida
8. Ejecuta los tests
9. Healer diagnostica fallos si los hay (máx 2 intentos)
10. Keeper consolida el conocimiento
11. Releaser abre el PR; Reporter comenta en el ticket

Respeta el cost gate `TESTRA_BUDGET_PER_TICKET`. Si se excede, pausa y consulta.
