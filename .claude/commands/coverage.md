Genera el mapa de cobertura de tests del proyecto e identifica los gaps.

Pasos:
1. Lee `knowledge/product.md` — extrae todas las reglas de negocio documentadas.
2. Lee todos los specs en `tests/features/**/*.spec.ts` — extrae qué casos están cubiertos (por tipo, criticidad, feature).
3. Cruza ambas listas:
   - Qué reglas de negocio tienen al menos un test.
   - Qué reglas de negocio NO tienen ningún test (gaps).
4. Lee el knowledge base y reporta su salud: pantallas documentadas, selectores totales, selectores stale.
5. Presenta un mapa de cobertura:

## Mapa de cobertura

### Por feature
| Feature | Test cases | Tipos cubiertos | Criticidad |
|---|---|---|---|

### Gaps detectados
- Reglas de negocio sin ningún test: <lista>
- Selectores stale (>30 días): <n>

### Recomendación
<qué historias crear para cerrar los gaps más críticos primero>
