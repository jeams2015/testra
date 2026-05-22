/**
 * Testra — Knowledge Base
 *
 * El "cerebro" knowledge-first de Testra. Memoria compartida y versionada
 * de la app bajo prueba. El Planner la lee antes de abrir un browser;
 * el Keeper la mantiene; el Healer la alimenta vía el self-improving loop.
 *
 * Schema v1.0.0
 */

// ============================================================
// ENUMS
// ============================================================

export enum SelectorType {
  CSS    = "css",
  XPATH  = "xpath",
  ROLE   = "role",     // getByRole — preferido
  TESTID = "testid",   // data-testid — preferido
  TEXT   = "text",
  LABEL  = "label",
}

export enum ElementType {
  INPUT     = "input",
  BUTTON    = "button",
  LINK      = "link",
  TEXT      = "text",
  DROPDOWN  = "dropdown",
  CHECKBOX  = "checkbox",
  RADIO     = "radio",
  CONTAINER = "container",
  IMAGE     = "image",
  MODAL     = "modal",
}

export enum Stability {
  STABLE     = "stable",
  FRAGILE    = "fragile",
  DEPRECATED = "deprecated",
}

// ============================================================
// PIEZAS BÁSICAS
// ============================================================

/** Registro de verificación — quién y cuándo confirmó algo. */
export interface Verification {
  date: string;
  by: string;
  method: "browser" | "manual" | "inherited";
}

/** Un selector de un elemento de la UI. */
export interface SelectorEntry {
  id: string; // id semántico: "login.emailInput"
  description: string;
  selector: string;
  selectorType: SelectorType;
  elementType: ElementType;
  stability: Stability;
  verification: Verification;
  /** Selectores alternativos si el principal falla. */
  fallbacks?: string[];
  notes?: string;
}

/** Conocimiento de una pantalla completa. */
export interface ScreenKnowledge {
  id: string;
  name: string;
  url: string;
  description: string;
  /** Para apps multi-portal. */
  portal?: string;
  /** Precondiciones para llegar a esta pantalla. */
  guards: string[];
  elements: SelectorEntry[];
  lastUpdated: string;
}

/** Una regla de negocio del dominio. */
export interface BusinessRule {
  id: string;
  category: string; // "pricing" | "limits" | "validation" | "compliance"
  description: string;
  formula?: string;
  /** Ejemplos verificables — el Sentinel los usa para validar contratos. */
  examples: Array<{ input: string; expected: string }>;
  knownBugs?: string[];
  source: string;
  lastUpdated: string;
}

/** Un user journey documentado. */
export interface FlowKnowledge {
  id: string;
  name: string;
  description: string;
  steps: string[];
  screensInvolved: string[];
  estimatedSteps?: number;
}

/** Un patrón técnico o "quirk" de la app. */
export interface AppPattern {
  id: string;
  title: string;
  description: string;
  /** Qué agentes necesitan conocer este patrón. */
  affects: string[];
  workaround?: string;
}

// ============================================================
// SELF-IMPROVING LOOP
// ============================================================

/** Un parche de conocimiento propuesto — corazón del loop self-improving. */
export interface KnowledgePatch {
  id: string;
  proposedBy: string; // "Healer" típicamente
  timestamp: string;
  type:
    | "selector-update"
    | "new-screen"
    | "rule-correction"
    | "pattern-discovered"
    | "flow-added";
  /** Id de la entrada del knowledge base que modifica. */
  target: string;
  before?: string;
  after: string;
  reason: string;
  /** Evidencia que respalda el parche (screenshot, error log, etc.). */
  evidence?: string;
  status: "proposed" | "accepted" | "rejected";
  reviewedBy?: string; // "Keeper"
  reviewNote?: string;
}

// ============================================================
// KNOWLEDGE BASE — raíz
// ============================================================

export interface KnowledgeBase {
  schemaVersion: "1.0.0";

  project: {
    name: string;
    appUrl: string;
    framework: string;
    portals?: string[];
  };

  screens: ScreenKnowledge[];
  businessRules: BusinessRule[];
  flows: FlowKnowledge[];
  patterns: AppPattern[];
  glossary: Record<string, string>;

  /** Parches pendientes de revisión por el Keeper. */
  pendingPatches: KnowledgePatch[];

  meta: {
    createdAt: string;
    updatedAt: string;
    maintainedBy: string; // "Keeper"
    coverage: {
      screensDocumented: number;
      selectorsTotal: number;
      /** Selectores no verificados recientemente — deuda de conocimiento. */
      selectorsStale: number;
      businessRules: number;
    };
  };
}
