/**
 * EN 12831-1 Table B.12 — Air change rate levels for Method 8 (building heat load).
 *
 * Levels are defined by blower-door test result (n50) and year of construction
 * as a proxy when no measured n50 is available.
 */
export enum BuildingAirtightness {
  /** n50 ≤ 3 h⁻¹ — built ≥1995 or certified tight windows → 0.25 h⁻¹ */
  TIGHT = "TIGHT",
  /** 3 h⁻¹ < n50 ≤ 6 h⁻¹ — built before 1995 → 0.5 h⁻¹ */
  STANDARD = "STANDARD",
  /** n50 > 6 h⁻¹ — built before 1977, obvious leakages → 1.0 h⁻¹ */
  LEAKY = "LEAKY",
}

const AIR_CHANGE_RATE_TABLE: Record<BuildingAirtightness, number> = {
  [BuildingAirtightness.TIGHT]: 0.25,
  [BuildingAirtightness.STANDARD]: 0.5,
  [BuildingAirtightness.LEAKY]: 1.0,
};

export function resolveAirChangeRate(level: BuildingAirtightness): number {
  return AIR_CHANGE_RATE_TABLE[level];
}
