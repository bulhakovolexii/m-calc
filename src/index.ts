export type {
  BuildingElement,
  BuildingParams,
  ConditionedElement,
  ElementBoundary,
  ElementResult,
  ExternalElement,
  GroundElement,
  HeatLoadResult,
  UnheatedElement,
  ValidationError,
} from "./types.js";
export { isConditioned } from "./types.js";

export { UnheatedSpaceType, resolveUnheatedFactor } from "./unheated-spaces.js";

export {
  calculateHeatLoad,
  calculateTransmissionLoss,
  calculateVentilationLoss,
} from "./calculate.js";
export { validate } from "./validate.js";
export { ThermalBridgeClass, resolveThermalBridgeClass } from "./thermal-bridges.js";
export { BuildingAirtightness, resolveAirChangeRate } from "./ventilation.js";
export type { ClimateRegion } from "./climate.js";
export type { ConstructionEntry } from "./construction-catalog.js";
export { CONSTRUCTION_CATALOG, ElementType, getEntriesByType, lookupConstructionUValue } from "./construction-catalog.js";
export { CLIMATE_REGIONS, UkrainianCity, getDesignTemperature } from "./climate.js";
export { AIR_CHANGE_RATE_DEFAULT, AIR_HEAT_CAPACITY, DELTA_THERMAL_BRIDGES_DEFAULT, GROUND_TEMPERATURE_FACTOR, UNHEATED_TEMPERATURE_FACTOR } from "./constants.js";
