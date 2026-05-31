/**
 * ρ_a · c_p,a — volumetric heat capacity of air [Wh/(m³·K)].
 * Fixed value per EN 12831-1 §8.3.3 simplified approach.
 */
export const AIR_HEAT_CAPACITY = 0.34;

/**
 * Default blanket additional thermal transmittance for thermal bridges ΔU_TB [W/(m²·K)].
 * EN 12831-1 B.3.2 simplified method — used when neither thermalBridgeClass
 * nor explicit deltaThermalBridges is provided.
 */
export const DELTA_THERMAL_BRIDGES_DEFAULT = 0.10;

/**
 * Default temperature correction factor f_x for elements adjacent to an unheated space.
 * EN 12831-1 Table B.11 — used when neither unheatedSpaceType nor temperatureFactor is provided.
 */
export const UNHEATED_TEMPERATURE_FACTOR = 0.5;

/**
 * Default temperature correction factor f_x for elements adjacent to the ground.
 * EN 12831-1 Table B.11 — used when no explicit temperatureFactor is provided.
 */
export const GROUND_TEMPERATURE_FACTOR = 0.3;

/**
 * Default air change rate n_Build [h⁻¹] for Method 8.
 * EN 12831-1 Table B.12 — STANDARD level (3 < n50 ≤ 6, buildings built before 1995).
 * Used when neither airChangeRate nor buildingAirtightness is provided.
 */
export const AIR_CHANGE_RATE_DEFAULT = 0.5;
