/**
 * Testra — Contract of Story
 *
 * El artefacto central que fluye por el pipeline de los 8 agentes del Council.
 * Producido por Analyst, validado por Sentinel, consumido por Planner y Automator.
 *
 * Schema v1.0.0
 */

// ============================================================
// ENUMS — vocabulario controlado
// ============================================================

export enum ContractStatus {
  DRAFT               = "draft",
  AWAITING_VALIDATION = "awaiting_validation",
  APPROVED            = "approved",
  REJECTED            = "rejected",
  IN_PLANNING         = "in_planning",
  IN_GENERATION       = "in_generation",
  IMPLEMENTED         = "implemented",
  EXECUTING           = "executing",
  COMPLETED           = "completed",
  ARCHIVED            = "archived",
}

export enum TestType {
  SMOKE      = "smoke",
  REGRESSION = "regression",
  RULE_LIMIT = "rule-limit",
  FULL_FLOW  = "full-flow",
  COMPLIANCE = "compliance",
  VISUAL     = "visual",
  API        = "api",
}

export enum TestLayer {
  UI     = "ui",
  API    = "api",
  VISUAL = "visual",
}

export enum TestCriticality {
  CRITICAL = "critical",
  HIGH     = "high",
  MEDIUM   = "medium",
  LOW      = "low",
}

export enum TargetFramework {
  PLAYWRIGHT = "playwright",
  CYPRESS    = "cypress",   // Fase 2
  SELENIUM   = "selenium",  // futuro
}

export enum PmToolType {
  JIRA         = "jira",
  LINEAR       = "linear",        // Fase 2
  AZURE_DEVOPS = "azure-devops",  // Fase 2
  CLICKUP      = "clickup",       // Fase 2
}

// ============================================================
// PIEZAS BÁSICAS
// ============================================================

/** Referencia al ticket original en cualquier PM tool. */
export interface SourceTicket {
  pmTool: PmToolType;
  ticketId: string;
  url: string;
  title: string;
  description: string;
  reporter: string;
  createdAt: string;
  updatedAt: string;
  /** Si el ticket tiene link de Figma, el Analyst genera un VisualContract. */
  linkedFigmaUrl?: string;
  labels?: string[];
}

/** Un criterio de aceptación atómico y verificable. */
export interface AcceptanceCriterion {
  id: string;
  description: string;
  type: "functional" | "non-functional" | "visual" | "api";
  /** Si no es verificable deterministicamente, el Sentinel debe rechazar. */
  verifiable: boolean;
}

/** Requerimiento de un dato para un test. */
export interface DataRequirement {
  field: string;
  type: "string" | "number" | "email" | "passport" | "date" | "enum" | "boolean";
  constraints: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    enumValues?: string[];
    /** Si true, se genera valor único por test (ej: email, passport). */
    unique?: boolean;
    range?: [number, number];
  };
  source: "fixture" | "generated" | "env";
  example?: unknown;
}

/** Un paso atómico dentro de un test. */
export interface TestStep {
  order: number;
  action: string;
  /** Selector simbólico (id del knowledge base), no CSS crudo. */
  target?: string;
  data?: unknown;
  expectedOutcome?: string;
  /** Tiempo máximo para este paso en ms. Default 30000. */
  timeoutMs?: number;
}

/** Un test case individual. */
export interface TestCase {
  id: string;
  name: string;
  description: string;
  type: TestType;
  layer: TestLayer;
  criticality: TestCriticality;
  preconditions: string[];
  steps: TestStep[];
  expectedResult: string;
  data: Record<string, unknown>;
  dataRequirements?: DataRequirement[];
  tags: string[];
  dependsOn?: string[];
}

// ============================================================
// METADATA DEL PIPELINE — los agentes la van llenando
// ============================================================

/** Veredicto del Sentinel. */
export interface ValidationResult {
  validator: "Sentinel";
  mode: "contract" | "spec" | "pr";
  timestamp: string;
  verdict: "APPROVED" | "REJECTED";
  reasoning: string;
  llmUsed: string;
  tokensConsumed: number;
  costUsd: number;
  /** Si se usó Council of Validators (modo paranoid). */
  consensusFrom?: Array<{ llm: string; verdict: string }>;
  observations?: string[];
}

/** Registro de costo de un agente. */
export interface AgentCostEntry {
  agent: string;
  timestamp: string;
  llmUsed: string;
  tokensIn: number;
  tokensOut: number;
  costUsd: number;
  durationMs: number;
  runId: string;
}

/** Referencia al plan generado por Planner. */
export interface PathfinderPlanRef {
  planFile: string;
  generatedAt: string;
  knowledgeUsed: string[];
  /** false = el knowledge base fue suficiente, no se abrió browser. */
  browserOpened: boolean;
  newElementsCount: number;
}

/** Output del Automator. */
export interface ForgeOutputRef {
  specFiles: string[];
  pageObjectFiles?: string[];
  fixtureFiles?: string[];
  generatedAt: string;
  targetFramework: TargetFramework;
  loc: number;
}

/** Resultado de ejecución de los tests. */
export interface ExecutionResult {
  executedAt: string;
  durationMs: number;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  healerRunId?: string;
  reportPath: string;
}

// ============================================================
// CONTRACT — raíz
// ============================================================

export interface Contract {
  contractId: string;
  schemaVersion: "1.0.0";

  source: SourceTicket;

  title: string;
  description: string;
  acceptanceCriteria: AcceptanceCriterion[];
  testCases: TestCase[];

  targetFramework: TargetFramework;
  targetApp: {
    name: string;
    baseUrl?: string;
    env: "staging" | "production" | "demo";
  };

  /** Contratos que deben estar APPROVED antes que este. */
  dependsOn?: string[];
  /** Feature al que pertenece (mapea a tests/features/). */
  feature: string;

  status: ContractStatus;
  validationHistory: ValidationResult[];

  scribeAnalysis?: {
    completedAt: string;
    notes: string;
    /** Si hay ambigüedades, el Sentinel debe rechazar. */
    ambiguitiesFound?: string[];
  };
  pathfinderPlan?: PathfinderPlanRef;
  forgeOutput?: ForgeOutputRef;
  execution?: ExecutionResult;

  costLedger: AgentCostEntry[];
  /** Si está definido, el orquestador pausa al excederse. */
  budgetUsd?: number;
  totalCostUsd: number;

  createdAt: string;
  updatedAt: string;
  version: number;
  authorAgent: string;
}

/** Variante cuando el ticket trae un link de Figma. */
export interface VisualContract extends Contract {
  visualSpec: {
    figmaUrl: string;
    figmaNodeId?: string;
    breakpoints: Array<"mobile" | "tablet" | "desktop">;
    languages: string[];
    tolerance: {
      pixel: number;
      threshold: number;
    };
    ignoreRegions?: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
    }>;
  };
}
