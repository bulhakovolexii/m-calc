/**
 * Thermal bridge correction classes per EN 12831-1 Table B.1.
 * Used to auto-resolve ΔU_TB when no explicit deltaThermalBridges is provided.
 *
 * When thermalBridgeClass is also omitted, the simplified default of 0.10 applies
 * per EN 12831-1 B.3.2.
 */
export enum ThermalBridgeClass {
  /** New buildings with high insulation and attested minimization of thermal bridges. */
  MINIMIZED_ATTESTED = "MINIMIZED_ATTESTED",
  /** New buildings in compliance with generally recognized rules of practice. */
  STANDARD_PRACTICE = "STANDARD_PRACTICE",
  /** Buildings with mainly internal insulation broken by solid ceilings (e.g. reinforced concrete). */
  INTERNAL_INSULATION_SOLID_CEILING = "INTERNAL_INSULATION_SOLID_CEILING",
  /** All other buildings. */
  OTHER = "OTHER",
}

const DELTA_U_TB_TABLE: Record<ThermalBridgeClass, number> = {
  [ThermalBridgeClass.MINIMIZED_ATTESTED]: 0.02,
  [ThermalBridgeClass.STANDARD_PRACTICE]: 0.05,
  [ThermalBridgeClass.INTERNAL_INSULATION_SOLID_CEILING]: 0.15,
  [ThermalBridgeClass.OTHER]: 0.10,
};

/**
 * Returns the blanket additional thermal transmittance ΔU_TB [W/(m²·K)]
 * for the given thermal bridge class per EN 12831-1 Table B.1.
 */
export function resolveThermalBridgeClass(cls: ThermalBridgeClass): number {
  return DELTA_U_TB_TABLE[cls];
}
