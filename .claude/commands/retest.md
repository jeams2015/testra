Ejecuta el flujo de retest para el ticket $ARGUMENTS.

Sigue el protocolo definido en `.claude/flows/02-retest.md` paso a paso:

1. Reporter obtiene los bugs vinculados a $ARGUMENTS que están marcados como resueltos
2. Ejecuta exactamente los tests que cubren esos bugs
3. Para cada test que falla, el Healer diagnostica: ¿bug de la app sigue presente, o error de automatización?
4. Keeper consolida si hubo KnowledgePatch
5. Reporter cierra los bugs cuyos tests pasan; comenta los que siguen fallando

Recuerda: el retest no crea specs nuevos. El spec es el contrato — si la app no cumple, el fallo es válido y el bug no se resolvió.
