/**
 * Testra — Jira REST Client
 *
 * Cliente HTTP para Jira Cloud REST API v3.
 * Lo usa el Reporter para leer tickets, comentar y crear bugs.
 *
 * Autenticación: Basic Auth (email:api_token en base64)
 * Variables requeridas: JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN
 */

import type { SourceTicket } from '../../../../core/types/contract.js';
import { PmToolType } from '../../../../core/types/contract.js';

// ── Config ────────────────────────────────────────────────────────────────────

function getConfig() {
  const baseUrl  = process.env.JIRA_BASE_URL?.replace(/\/$/, '');
  const email    = process.env.JIRA_EMAIL;
  const token    = process.env.JIRA_API_TOKEN;

  if (!baseUrl || !email || !token) {
    throw new Error(
      'Faltan variables de entorno: JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN'
    );
  }

  const auth = Buffer.from(`${email}:${token}`).toString('base64');
  return { baseUrl, auth };
}

// ── HTTP helper ───────────────────────────────────────────────────────────────

async function jiraFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const { baseUrl, auth } = getConfig();
  const url = `${baseUrl}/rest/api/3${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept':        'application/json',
      'Content-Type':  'application/json',
      ...options.headers,
    },
  });

  if (res.status === 429) {
    // Rate limit — esperar el tiempo indicado y reintentar una vez
    const retryAfter = parseInt(res.headers.get('Retry-After') ?? '5', 10);
    await new Promise(r => setTimeout(r, retryAfter * 1000));
    return jiraFetch<T>(path, options);
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Jira API ${res.status} en ${path}: ${body}`);
  }

  return res.json() as Promise<T>;
}

// ── ADF → texto plano ─────────────────────────────────────────────────────────

/** Convierte un nodo ADF (Atlassian Document Format) a texto plano. */
function adfToText(node: any): string {
  if (!node) return '';

  if (node.type === 'text') return node.text ?? '';

  if (node.type === 'mention') return `@${node.attrs?.text ?? ''}`;

  if (Array.isArray(node.content)) {
    const text = node.content.map(adfToText).join('');
    // Agregar saltos de línea entre bloques
    if (['paragraph', 'heading', 'listItem', 'bulletList', 'orderedList'].includes(node.type)) {
      return text + '\n';
    }
    return text;
  }

  return '';
}

// ── Buscar URL de Figma en texto ──────────────────────────────────────────────

function extractFigmaUrl(text: string): string | undefined {
  const match = text.match(/https:\/\/www\.figma\.com\/[^\s)>"]+/);
  return match?.[0];
}

// ── Operaciones públicas ──────────────────────────────────────────────────────

/** Lee un issue de Jira y lo convierte a SourceTicket. */
export async function getIssue(ticketId: string): Promise<SourceTicket> {
  const issue = await jiraFetch<any>(`/issue/${ticketId}`);
  const { baseUrl } = getConfig();

  const descriptionText = adfToText(issue.fields.description);
  const figmaUrl = extractFigmaUrl(descriptionText);

  return {
    pmTool:       PmToolType.JIRA,
    ticketId:     issue.key,
    url:          `${baseUrl}/browse/${issue.key}`,
    title:        issue.fields.summary,
    description:  descriptionText.trim(),
    reporter:     issue.fields.reporter?.emailAddress ?? 'unknown',
    createdAt:    issue.fields.created,
    updatedAt:    issue.fields.updated,
    labels:       issue.fields.labels ?? [],
    ...(figmaUrl ? { linkedFigmaUrl: figmaUrl } : {}),
  };
}

/** Agrega un comentario a un issue (formato ADF mínimo). */
export async function addComment(ticketId: string, markdown: string): Promise<void> {
  // ADF mínimo: un solo párrafo de texto
  const body = {
    version: 1,
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [{ type: 'text', text: markdown }],
      },
    ],
  };

  await jiraFetch(`/issue/${ticketId}/comment`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  });
}

/** Crea un bug [AUTO] y lo vincula al ticket original. */
export async function createAutoBug(params: {
  projectKey: string;
  title: string;
  description: string;
  relatedTicketId: string;
}): Promise<string> {
  const body = {
    fields: {
      project:     { key: params.projectKey },
      issuetype:   { name: 'Bug' },
      summary:     `[AUTO] ${params.title}`,
      description: {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: params.description }],
          },
        ],
      },
      labels: ['qia-auto'],
    },
  };

  const created = await jiraFetch<any>('/issue', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const bugKey = created.key as string;

  // Vincular bug ↔ historia original
  await jiraFetch('/issueLink', {
    method: 'POST',
    body: JSON.stringify({
      type: { name: 'Relates' },
      inwardIssue:  { key: bugKey },
      outwardIssue: { key: params.relatedTicketId },
    }),
  });

  return bugKey;
}

/** Busca issues por JQL (usado en /retest para encontrar bugs vinculados). */
export async function searchIssues(jql: string): Promise<Array<{ key: string; summary: string; status: string }>> {
  const result = await jiraFetch<any>(
    `/search?jql=${encodeURIComponent(jql)}&fields=summary,status`
  );

  return result.issues.map((i: any) => ({
    key:     i.key,
    summary: i.fields.summary,
    status:  i.fields.status.name,
  }));
}

/** Transiciona un issue a un estado (requiere conocer el transition ID). */
export async function transitionIssue(ticketId: string, transitionName: string): Promise<void> {
  // Primero obtener transiciones disponibles
  const { transitions } = await jiraFetch<any>(`/issue/${ticketId}/transitions`);
  const target = transitions.find((t: any) =>
    t.name.toLowerCase() === transitionName.toLowerCase()
  );

  if (!target) {
    throw new Error(
      `Transición "${transitionName}" no encontrada. Disponibles: ${transitions.map((t: any) => t.name).join(', ')}`
    );
  }

  await jiraFetch(`/issue/${ticketId}/transitions`, {
    method: 'POST',
    body: JSON.stringify({ transition: { id: target.id } }),
  });
}
