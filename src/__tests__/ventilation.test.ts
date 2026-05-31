import { describe, expect, it } from "vitest";
import { BuildingAirtightness, resolveAirChangeRate } from "../ventilation.js";

describe("resolveAirChangeRate — EN 12831-1 Table B.12", () => {
  it("TIGHT → 0.25 h⁻¹ (n50 ≤ 3, built ≥1995)", () => {
    expect(resolveAirChangeRate(BuildingAirtightness.TIGHT)).toBe(0.25);
  });

  it("STANDARD → 0.5 h⁻¹ (3 < n50 ≤ 6, built before 1995)", () => {
    expect(resolveAirChangeRate(BuildingAirtightness.STANDARD)).toBe(0.5);
  });

  it("LEAKY → 1.0 h⁻¹ (n50 > 6, built before 1977)", () => {
    expect(resolveAirChangeRate(BuildingAirtightness.LEAKY)).toBe(1.0);
  });
});
