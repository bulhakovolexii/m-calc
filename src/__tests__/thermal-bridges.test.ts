import { describe, expect, it } from "vitest";
import { ThermalBridgeClass, resolveThermalBridgeClass } from "../thermal-bridges.js";

describe("resolveThermalBridgeClass — EN 12831-1 Table B.1", () => {
  it("MINIMIZED_ATTESTED → 0.02", () => {
    expect(resolveThermalBridgeClass(ThermalBridgeClass.MINIMIZED_ATTESTED)).toBe(0.02);
  });

  it("STANDARD_PRACTICE → 0.05", () => {
    expect(resolveThermalBridgeClass(ThermalBridgeClass.STANDARD_PRACTICE)).toBe(0.05);
  });

  it("INTERNAL_INSULATION_SOLID_CEILING → 0.15", () => {
    expect(resolveThermalBridgeClass(ThermalBridgeClass.INTERNAL_INSULATION_SOLID_CEILING)).toBe(0.15);
  });

  it("OTHER → 0.10 (matches B.3.2 simplified default)", () => {
    expect(resolveThermalBridgeClass(ThermalBridgeClass.OTHER)).toBe(0.10);
  });
});
