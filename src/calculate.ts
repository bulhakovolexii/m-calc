import { AIR_CHANGE_RATE_DEFAULT, AIR_HEAT_CAPACITY, DELTA_THERMAL_BRIDGES_DEFAULT, GROUND_TEMPERATURE_FACTOR, UNHEATED_TEMPERATURE_FACTOR } from "./constants.js";
import { lookupConstructionUValue } from "./construction-catalog.js";
import { resolveThermalBridgeClass } from "./thermal-bridges.js";
import type { BuildingElement, BuildingParams, ElementResult, HeatLoadResult } from "./types.js";
import { resolveUnheatedFactor } from "./unheated-spaces.js";
import { validate } from "./validate.js";
import { resolveAirChangeRate } from "./ventilation.js";

function resolveTemperatureFactor(el: BuildingElement): number {
  if (el.boundary === "external") return 1.0;
  if (el.boundary === "ground") return el.temperatureFactor ?? GROUND_TEMPERATURE_FACTOR;
  // boundary === "unheated": explicit override → type lookup → Table B.11 default
  if (el.temperatureFactor !== undefined) return el.temperatureFactor;
  if (el.unheatedSpaceType !== undefined) return resolveUnheatedFactor(el.unheatedSpaceType);
  return UNHEATED_TEMPERATURE_FACTOR;
}

function resolveAirChanges(params: BuildingParams): number {
  if (params.airChangeRate !== undefined) return params.airChangeRate;
  if (params.buildingAirtightness !== undefined) return resolveAirChangeRate(params.buildingAirtightness);
  return AIR_CHANGE_RATE_DEFAULT;
}

function resolveUValue(el: BuildingElement): number {
  if (el.uValue !== undefined) return el.uValue;
  if (el.constructionCatalogId !== undefined) {
    const u = lookupConstructionUValue(el.constructionCatalogId);
    if (u !== null) return u;
  }
  throw new Error(`Element "${el.id}": uValue or constructionCatalogId must be provided`);
}

function resolveDeltaTB(el: BuildingElement): number {
  if (el.deltaThermalBridges !== undefined) return el.deltaThermalBridges;
  if (el.thermalBridgeClass !== undefined) return resolveThermalBridgeClass(el.thermalBridgeClass);
  return DELTA_THERMAL_BRIDGES_DEFAULT;
}

/**
 * Phi_T,build — building design transmission heat loss [W].
 * EN 12831-1 Formula (55).
 */
export function calculateTransmissionLoss(params: BuildingParams): {
  total: number;
  elementResults: ElementResult[];
} {
  const deltaT = params.internalTemperature - params.externalTemperature;
  const elementResults: ElementResult[] = [];
  let total = 0;

  for (const el of params.elements) {
    const loss =
      el.area *
      (resolveUValue(el) + resolveDeltaTB(el)) *
      resolveTemperatureFactor(el) *
      deltaT;
    elementResults.push({ elementId: el.id, transmissionLoss: loss });
    total += loss;
  }

  return { total, elementResults };
}

/**
 * Phi_V,build — building design ventilation heat loss [W].
 * EN 12831-1 Formula (56).
 */
export function calculateVentilationLoss(params: BuildingParams): number {
  const deltaT = params.internalTemperature - params.externalTemperature;
  return (
    params.internalVolume * resolveAirChanges(params) * AIR_HEAT_CAPACITY * deltaT
  );
}

/**
 * Phi_HL,build — building design heat load [W].
 * EN 12831-1 Formula (54): Phi_HL,build = Phi_T,build + Phi_V,build.
 *
 * Throws if validation fails — call `validate()` first when you need
 * per-field error details (e.g. for form validation in the UI).
 */
export function calculateHeatLoad(params: BuildingParams): HeatLoadResult {
  const errors = validate(params);
  if (errors.length > 0) {
    const summary = errors.map((e) => `${e.path}: ${e.message}`).join("; ");
    throw new Error(`Invalid input parameters: ${summary}`);
  }

  const { total: transmissionLoss, elementResults } =
    calculateTransmissionLoss(params);
  const ventilationLoss = calculateVentilationLoss(params);

  return {
    transmissionLoss,
    ventilationLoss,
    totalHeatLoad: transmissionLoss + ventilationLoss,
    elementResults,
  };
}
