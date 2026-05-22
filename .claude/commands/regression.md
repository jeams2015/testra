Ejecuta la suite de regresión completa (Tier 1 + Tier 2 + Tier 3).

Sigue el protocolo definido en `.claude/flows/03-regression.md` paso a paso:

1. Lee `tests/features/` y clasifica todos los tests por `criticality` (critical / high / medium / low)
2. Ejecuta Tier 1 (critical) primero — fail-fast: reporta de inmediato si alguno falla, pero continúa
3. Ejecuta Tier 2 (high) y Tier 3 (medium + low) acumulando resultados
4. El Healer diagnostica cada fallo: ¿error de automatización o bug de la app?
   - Los fixes del Healer en regression NO van directo a main — se registran para PR de revisión aparte
5. El Reporter genera el resumen ejecutivo: pasados / fallados por tier, bugs detectados

Recuerda: la regression **descubre**, no repara automáticamente. Cualquier fix del Healer se registra como PR separado, nunca directo a main.
