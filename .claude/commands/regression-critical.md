Ejecuta solo el Tier 1 (critical path) de la suite de regresión.

Sigue el protocolo definido en `.claude/flows/03-regression.md` — solo Tier 1:

1. Lee `tests/features/` y filtra solo los tests con `criticality: critical`
2. Ejecuta esos tests — fail-fast: detente e informa de inmediato ante el primer fallo
3. El Healer diagnostica cada fallo: ¿error de automatización o bug de la app?
4. El Reporter reporta el estado del critical path: verde o rojo

Usa este comando antes de un deploy o release para verificar rápidamente que el flujo principal sigue funcionando. Para el mapa completo usa `/regression`.
