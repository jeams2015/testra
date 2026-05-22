/**
 * Testra — Jira CLI
 *
 * Interfaz de línea de comandos para que el Reporter use Jira desde Bash.
 *
 * Uso:
 *   node adapters/pm-tools/jira/src/cli.js get-issue DEMO-42
 *   node adapters/pm-tools/jira/src/cli.js add-comment DEMO-42 "Texto del comentario"
 *   node adapters/pm-tools/jira/src/cli.js create-bug DEMO-42 PROJ "Título" "Descripción"
 *   node adapters/pm-tools/jira/src/cli.js search "project = PROJ AND labels = qia-auto"
 *
 * Salida: JSON en stdout. Errores en stderr con exit code 1.
 */

import { getIssue, addComment, createAutoBug, searchIssues } from './client.js';

async function main() {
  const [, , command, ...args] = process.argv;

  try {
    switch (command) {
      case 'get-issue': {
        const [ticketId] = args;
        if (!ticketId) throw new Error('Uso: get-issue <TICKET-ID>');
        const ticket = await getIssue(ticketId);
        console.log(JSON.stringify(ticket, null, 2));
        break;
      }

      case 'add-comment': {
        const [ticketId, text] = args;
        if (!ticketId || !text) throw new Error('Uso: add-comment <TICKET-ID> "<texto>"');
        await addComment(ticketId, text);
        console.log(JSON.stringify({ ok: true, ticketId }));
        break;
      }

      case 'create-bug': {
        const [relatedTicketId, projectKey, title, description] = args;
        if (!relatedTicketId || !projectKey || !title) {
          throw new Error('Uso: create-bug <RELATED-TICKET> <PROJECT-KEY> "<título>" "<descripción>"');
        }
        const bugKey = await createAutoBug({ projectKey, title, description: description ?? '', relatedTicketId });
        console.log(JSON.stringify({ ok: true, bugKey, relatedTicketId }));
        break;
      }

      case 'search': {
        const [jql] = args;
        if (!jql) throw new Error('Uso: search "<JQL query>"');
        const issues = await searchIssues(jql);
        console.log(JSON.stringify(issues, null, 2));
        break;
      }

      default:
        throw new Error(`Comando desconocido: "${command}". Comandos disponibles: get-issue, add-comment, create-bug, search`);
    }
  } catch (err) {
    console.error('ERROR:', (err as Error).message);
    process.exit(1);
  }
}

main();
