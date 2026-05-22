# Adapter — Jira

> Este archivo lo lee el **Reporter** para hablar con Jira. Para soportar Linear, Azure DevOps o ClickUp, se crea un adapter hermano — el Reporter no cambia, solo habla siempre en términos del `SourceTicket`.

**PM Tool:** Atlassian Jira · **API:** REST API v3

---

## 1. Autenticación

Variables de entorno (de `.env`):

```
JIRA_BASE_URL    = https://tu-org.atlassian.net
JIRA_EMAIL       = correo de la cuenta
JIRA_API_TOKEN   = token de API de Atlassian
```

Autenticación: Basic Auth con `email:api_token` en base64.
Si el adicional MCP de Atlassian está disponible, se prefiere sobre llamadas REST crudas.

## 2. Operaciones que el adapter expone al Reporter

| Operación | Endpoint Jira | Uso en Testra |
|---|---|---|
| Leer issue | `GET /rest/api/3/issue/{key}` | El Reporter obtiene el ticket |
| Crear issue | `POST /rest/api/3/issue` | El Reporter crea bugs `[AUTO]` |
| Comentar | `POST /rest/api/3/issue/{key}/comment` | El Reporter reporta resultados |
| Vincular issues | `POST /rest/api/3/issueLink` | Vincular bug ↔ historia |
| Transicionar | `POST /rest/api/3/issue/{key}/transitions` | Cambiar estado del issue |
| Buscar (JQL) | `GET /rest/api/3/search` | Buscar bugs vinculados (retest) |

## 3. Mapeo Jira issue → SourceTicket

El Reporter convierte la respuesta de Jira al tipo `SourceTicket` de `core/types/contract.ts`:

| Campo `SourceTicket` | Origen en Jira |
|---|---|
| `pmTool` | constante `"jira"` |
| `ticketId` | `key` (ej. `DEMO-42`) |
| `url` | `JIRA_BASE_URL` + `/browse/` + `key` |
| `title` | `fields.summary` |
| `description` | `fields.description` (ADF → texto plano) |
| `reporter` | `fields.reporter.emailAddress` |
| `createdAt` | `fields.created` |
| `updatedAt` | `fields.updated` |
| `labels` | `fields.labels` |
| `linkedFigmaUrl` | escanear `fields.description` y comentarios buscando URLs de figma.com |

## 4. Creación de bug `[AUTO]`

Cuando el Healer detecta un bug real de la app, el Reporter crea un issue:

- `issuetype`: `Bug`
- `summary`: `[AUTO] {descripción corta del fallo}`
- `description`: test que lo encontró, qué se esperaba, qué pasó, evidencia.
- `labels`: incluir `testra-auto`
- Tras crearlo, vincularlo al ticket original con tipo de link `"relates to"`.

## 5. Notas de la Atlassian REST API v3

- La descripción usa formato **ADF** (Atlassian Document Format), no Markdown. Al leer, convertir ADF → texto. Al escribir comentarios, construir ADF mínimo.
- Rate limits: respetar `429` con backoff exponencial.
- Las transiciones dependen del workflow del proyecto — leer transiciones disponibles con `GET .../transitions` antes de transicionar.

---

**Schema del adapter:** v1.0.0 · **PM Tool destino:** Jira Cloud REST API v3
