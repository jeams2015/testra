Diagnostica y, si corresponde, repara el test fallido $ARGUMENTS usando el Healer.

Pasos:
1. Lee `test-results/results.json` y encuentra el test $ARGUMENTS — extrae el mensaje de error, el stack trace y la duración.
2. Identifica el spec y el Page Object involucrados.
3. Invoca al Healer para que:
   - Diagnostique la causa raíz.
   - Clasifique: ¿error de automatización o bug real de la app?
   - Si es bug de la app → NO repara nada. Reporta el hallazgo para que el Reporter cree un bug `[AUTO]`.
   - Si es error de automatización → repara con el cambio mínimo necesario (máx 2 intentos) y re-ejecuta.
   - Si aprende algo reutilizable → genera un KnowledgePatch.
4. Reporta el diagnóstico y el resultado.

Recuerda: nunca cambies una aserción para que un test pase. La aserción es el contrato del negocio.
