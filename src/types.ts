import type { ThermalBridgeClass } from "./thermal-bridges.js";
import type { UnheatedSpaceType } from "./unheated-spaces.js";
import type { BuildingAirtightness } from "./ventilation.js";

/**
 * Boundary condition of a building element — defines which temperature
 * correction factor (f_x) applies (EN 12831-1 §8.3.2).
 */
export type ElementBoundary = "external" | "unheated" | "ground";

interface BuildingElementBase {
  /** Unique identifier — used in result breakdown and validation messages. */
  id: string;
  /** Human-readable name, used in UI / reports. */
  label?: string | undefined;
  /** A_k — area of the building element [m²] */
  area: number;
  /**
   * U_k — thermal transmittance [W/(m²·K)].
   * Overrides constructionCatalogId when both are provided.
   * Either uValue or constructionCatalogId must be present.
   */
  uValue?: number;
  /**
   * ID from CONSTRUCTION_CATALOG — auto-resolves uValue.
   * Used when uValue is omitted. Validated at runtime (unknown IDs are rejected).
   */
  constructionCatalogId?: string;
  /**
   * EN 12831-1 Table B.1 class — auto-resolves ΔU_TB when deltaThermalBridges is omitted.
   * When both are omitted, the simplified default of 0.10 applies (EN 12831-1 B.3.2).
   */
  thermalBridgeClass?: ThermalBridgeClass;
  /**
   * ΔU_TB — explicit blanket additional thermal transmittance for thermal bridges [W/(m²·K)].
   * Overrides thermalBridgeClass and the default when provided.
   * Set to 0 if thermal bridges are accounted for by other means (e.g. detailed Annex C).
   */
  deltaThermalBridges?: number;
}

/** Element adjacent to external air — f_x = 1.0 by definition (§8.3.2). */
export interface ExternalElement extends BuildingElementBase {
  boundary: "external";
}

/**
 * Element adjacent to an unheated (unconditioned) space.
 * - `unheatedSpaceType` — auto-resolves f_x from EN 12831-1 Table B.2.
 * - `temperatureFactor` — explicit f_x,k ∈ (0, 1]; overrides auto-resolution.
 * - When both are omitted, the default of 0.5 applies (EN 12831-1 Table B.11).
 */
export interface UnheatedElement extends BuildingElementBase {
  boundary: "unheated";
  /** EN 12831-1 Table B.2 space type — auto-resolves temperatureFactor. */
  unheatedSpaceType?: UnheatedSpaceType;
  /** f_x,k — explicit override; defaults to 0.5 when both this and unheatedSpaceType are omitted. */
  temperatureFactor?: number;
}

/**
 * Element adjacent to the ground.
 * When temperatureFactor is omitted, the EN 12831-1 default of 0.3 (Table B.11) is used.
 */
export interface GroundElement extends BuildingElementBase {
  boundary: "ground";
  /** f_x,k — explicit override; defaults to 0.3 per EN 12831-1 Table B.11. */
  temperatureFactor?: number;
}

/**
 * Element adjacent to an unheated space or ground.
 * Union of UnheatedElement and GroundElement for backward compatibility.
 */
export type ConditionedElement = UnheatedElement | GroundElement;

/**
 * A single element of the thermal building envelope.
 * Only outer surfaces shall be taken into account (§8.3.2).
 *
 * Discriminated on `boundary`:
 * - `"external"` → f_x = 1.0 implicitly
 * - `"unheated"` → b_U from Table 3 or explicit temperatureFactor
 * - `"ground"` → explicit temperatureFactor required
 */
export type BuildingElement = ExternalElement | UnheatedElement | GroundElement;

/**
 * All input parameters required for Method 8 — Simplified method for
 * building design heat load (EN 12831-1 §8).
 */
export interface BuildingParams {
  /** Thermal envelope elements (must include all outer surfaces). */
  elements: BuildingElement[];
  /** V_Build — internal (air) volume of the heated building [m³] */
  internalVolume: number;
  /**
   * n_Build — explicit air change rate [h⁻¹].
   * Overrides buildingAirtightness and the default when provided.
   */
  airChangeRate?: number;
  /**
   * EN 12831-1 Table B.12 airtightness level — auto-resolves n_Build.
   * Used when airChangeRate is omitted. When both are omitted, 0.5 h⁻¹ applies.
   */
  buildingAirtightness?: BuildingAirtightness;
  /** θ_int,build — internal design temperature [°C] */
  internalTemperature: number;
  /** θ_e — external design temperature [°C] */
  externalTemperature: number;
}

/** Transmission heat loss broken down per building element. */
export interface ElementResult {
  elementId: string;
  /** Φ_T,k [W] */
  transmissionLoss: number;
}

/** Full result of Method 8 heat load calculation. */
export interface HeatLoadResult {
  /** Φ_T,build — building design transmission heat loss [W] (Formula 55) */
  transmissionLoss: number;
  /** Φ_V,build — building design ventilation heat loss [W] (Formula 56) */
  ventilationLoss: number;
  /** Φ_HL,build — building design heat load [W] (Formula 54) */
  totalHeatLoad: number;
  /** Per-element breakdown of transmission losses. */
  elementResults: ElementResult[];
}

/** Narrow a BuildingElement to ConditionedElement (unheated or ground). */
export function isConditioned(el: BuildingElement): el is ConditionedElement {
  return el.boundary !== "external";
}

/** A single validation error tied to a specific field path. */
export interface ValidationError {
  /** Dot-notation path, e.g. "elements[0].area" or "internalVolume". */
  path: string;
  message: string;
}
