import { describe, expect, it } from "vitest";
import {
  calculateHeatLoad,
  calculateTransmissionLoss,
  calculateVentilationLoss,
} from "../calculate.js";
import { AIR_CHANGE_RATE_DEFAULT, AIR_HEAT_CAPACITY, DELTA_THERMAL_BRIDGES_DEFAULT, GROUND_TEMPERATURE_FACTOR, UNHEATED_TEMPERATURE_FACTOR } from "../constants.js";
import { ThermalBridgeClass } from "../thermal-bridges.js";
import type { BuildingParams } from "../types.js";
import { UnheatedSpaceType } from "../unheated-spaces.js";
import { BuildingAirtightness } from "../ventilation.js";

/**
 * Reference scenario (hand-calculated):
 *   Wall: ΔU_TB omitted → default 0.10 (EN 12831-1 B.3.2)
 *   20 m² × (0.3 + 0.10) W/(m²K) × 1.0 × 32 K = 256 W
 *   Ventilation: 300 m³ × 0.5 h⁻¹ × 0.34 × 32 K = 1632 W
 *   Total: 1888 W
 */
const baseParams: BuildingParams = {
  elements: [
    {
      id: "wall-south",
      area: 20,
      uValue: 0.3,
      boundary: "external",
      // deltaThermalBridges omitted — defaults to 0.10 per EN 12831-1 B.3.2
      // no temperatureFactor — external elements always use f_x = 1.0
    },
  ],
  internalVolume: 300,
  airChangeRate: 0.5,
  internalTemperature: 20,
  externalTemperature: -12,
};

const DELTA_T = 32; // 20 - (-12)

describe("calculateTransmissionLoss", () => {
  it("applies default ΔU_TB = 0.10 when deltaThermalBridges and thermalBridgeClass are omitted", () => {
    const { total } = calculateTransmissionLoss(baseParams);
    // 20 × (0.3 + 0.10) × 1.0 × 32 = 256 W
    expect(total).toBeCloseTo(20 * (0.3 + DELTA_THERMAL_BRIDGES_DEFAULT) * 1.0 * 32, 4);
  });

  it("auto-resolves ΔU_TB from thermalBridgeClass (Table B.1 lookup)", () => {
    const params: BuildingParams = {
      ...baseParams,
      elements: [{
        ...baseParams.elements[0]!,
        thermalBridgeClass: ThermalBridgeClass.STANDARD_PRACTICE,
      }],
    };
    const { total } = calculateTransmissionLoss(params);
    // 20 × (0.3 + 0.05) × 1.0 × 32 = 224 W
    expect(total).toBeCloseTo(224, 4);
  });

  it("uses explicit deltaThermalBridges over thermalBridgeClass when both provided", () => {
    const params: BuildingParams = {
      ...baseParams,
      elements: [{
        ...baseParams.elements[0]!,
        thermalBridgeClass: ThermalBridgeClass.STANDARD_PRACTICE, // would give 0.05
        deltaThermalBridges: 0.02,                                 // explicit wins
      }],
    };
    const { total } = calculateTransmissionLoss(params);
    // 20 × (0.3 + 0.02) × 1.0 × 32 = 204.8 W
    expect(total).toBeCloseTo(204.8, 4);
  });

  it("uses explicit deltaThermalBridges when provided, ignoring auto-resolution", () => {
    const params: BuildingParams = {
      ...baseParams,
      elements: [{ ...baseParams.elements[0]!, deltaThermalBridges: 0.05 }],
    };
    const { total } = calculateTransmissionLoss(params);
    // 20 × (0.3 + 0.05) × 1.0 × 32 = 224 W
    expect(total).toBeCloseTo(224, 4);
  });

  it("uses f_x = 1.0 implicitly for external elements", () => {
    const { total: withExternal } = calculateTransmissionLoss(baseParams);
    // conditioned element with same uValue and f_x=1.0 must give same result
    const equivalent: BuildingParams = {
      ...baseParams,
      elements: [
        {
          id: "wall-south",
          area: 20,
          uValue: 0.3,
          boundary: "unheated",
          temperatureFactor: 1.0,
          // deltaThermalBridges omitted — same auto-resolution as external
        },
      ],
    };
    const { total: withConditioned } = calculateTransmissionLoss(equivalent);
    expect(withExternal).toBeCloseTo(withConditioned, 10);
  });

  it("auto-resolves uValue from constructionCatalogId", () => {
    const params: BuildingParams = {
      ...baseParams,
      elements: [{
        id: "wall-south",
        area: 20,
        boundary: "external",
        constructionCatalogId: "WALL_BRICK_510", // U = 1.30
      }],
    };
    const { total } = calculateTransmissionLoss(params);
    // 20 × (1.30 + 0.10) × 1.0 × 32 = 896 W
    expect(total).toBeCloseTo(20 * (1.30 + DELTA_THERMAL_BRIDGES_DEFAULT) * 1.0 * DELTA_T, 4);
  });

  it("uses explicit uValue over constructionCatalogId when both provided", () => {
    const params: BuildingParams = {
      ...baseParams,
      elements: [{
        id: "wall-south",
        area: 20,
        boundary: "external",
        uValue: 0.5,                              // explicit wins
        constructionCatalogId: "WALL_BRICK_510",  // would give 1.30
      }],
    };
    const { total } = calculateTransmissionLoss(params);
    // 20 × (0.5 + 0.10) × 1.0 × 32 = 384 W
    expect(total).toBeCloseTo(20 * (0.5 + DELTA_THERMAL_BRIDGES_DEFAULT) * 1.0 * DELTA_T, 4);
  });

  it("returns per-element breakdown matching the total", () => {
    const { total, elementResults } = calculateTransmissionLoss(baseParams);
    const sumFromElements = elementResults.reduce(
      (s, r) => s + r.transmissionLoss,
      0,
    );
    expect(sumFromElements).toBeCloseTo(total, 10);
  });

  it("applies explicit temperatureFactor on unheated element", () => {
    const params: BuildingParams = {
      ...baseParams,
      elements: [
        {
          id: "wall-unheated",
          area: 20,
          uValue: 0.3,
          deltaThermalBridges: 0.05,
          boundary: "unheated",
          temperatureFactor: 0.5,
        },
      ],
    };
    const { total } = calculateTransmissionLoss(params);
    // 20 × 0.35 × 0.5 × 32 = 112 W
    expect(total).toBeCloseTo(112, 4);
  });

  it("auto-resolves temperatureFactor to 0.5 when unheated element has no type (Table B.11 default)", () => {
    const params: BuildingParams = {
      ...baseParams,
      elements: [
        {
          id: "wall-unheated",
          area: 20,
          uValue: 0.3,
          deltaThermalBridges: 0.05,
          boundary: "unheated",
          // neither unheatedSpaceType nor temperatureFactor — defaults to UNHEATED_TEMPERATURE_FACTOR
        },
      ],
    };
    const { total } = calculateTransmissionLoss(params);
    // 20 × (0.3 + 0.05) × 0.5 × 32 = 112 W
    expect(total).toBeCloseTo(20 * 0.35 * UNHEATED_TEMPERATURE_FACTOR * 32, 4);
  });

  it("auto-resolves temperatureFactor from unheatedSpaceType (Table B.2 lookup)", () => {
    // ROOM_1_EXTERNAL_WALL → f_l = 0.4
    const params: BuildingParams = {
      ...baseParams,
      elements: [
        {
          id: "wall-room",
          area: 20,
          uValue: 0.3,
          deltaThermalBridges: 0.05,
          boundary: "unheated",
          unheatedSpaceType: UnheatedSpaceType.ROOM_1_EXTERNAL_WALL,
        },
      ],
    };
    const { total } = calculateTransmissionLoss(params);
    // 20 × (0.3 + 0.05) × 0.4 × 32 = 89.6 W
    expect(total).toBeCloseTo(89.6, 4);
  });

  it("uses explicit temperatureFactor over unheatedSpaceType when both provided", () => {
    // ROOM_1_EXTERNAL_WALL → f_l = 0.4, but explicit 0.6 overrides
    const params: BuildingParams = {
      ...baseParams,
      elements: [
        {
          id: "wall-room",
          area: 20,
          uValue: 0.3,
          deltaThermalBridges: 0.05,
          boundary: "unheated",
          unheatedSpaceType: UnheatedSpaceType.ROOM_1_EXTERNAL_WALL,
          temperatureFactor: 0.6,
        },
      ],
    };
    const { total } = calculateTransmissionLoss(params);
    // 20 × (0.3 + 0.05) × 0.6 × 32 = 134.4 W (not 89.6)
    expect(total).toBeCloseTo(134.4, 4);
  });

  it("applies explicit temperatureFactor on ground element", () => {
    const params: BuildingParams = {
      ...baseParams,
      elements: [
        {
          id: "floor",
          area: 50,
          uValue: 0.3,
          deltaThermalBridges: 0.0,
          boundary: "ground",
          temperatureFactor: 0.6,
        },
      ],
    };
    const { total } = calculateTransmissionLoss(params);
    // 50 × 0.3 × 0.6 × 32 = 288 W
    expect(total).toBeCloseTo(288, 4);
  });

  it("auto-resolves ground temperatureFactor to 0.3 per EN 12831-1 Table B.11", () => {
    const params: BuildingParams = {
      ...baseParams,
      elements: [
        {
          id: "floor",
          area: 50,
          uValue: 0.3,
          deltaThermalBridges: 0.0,
          boundary: "ground",
          // temperatureFactor omitted — defaults to GROUND_TEMPERATURE_FACTOR (0.3)
        },
      ],
    };
    const { total } = calculateTransmissionLoss(params);
    // 50 × 0.3 × 0.3 × 32 = 144 W
    expect(total).toBeCloseTo(50 * 0.3 * GROUND_TEMPERATURE_FACTOR * 32, 4);
  });

  it("treats explicit deltaThermalBridges of 0 as no correction (Annex C case)", () => {
    const params: BuildingParams = {
      ...baseParams,
      elements: [{ ...baseParams.elements[0]!, deltaThermalBridges: 0 }],
    };
    const { total } = calculateTransmissionLoss(params);
    // 20 × (0.3 + 0.0) × 1.0 × 32 = 192 W
    expect(total).toBeCloseTo(192, 4);
  });

  it("sums multiple elements of mixed boundary types correctly", () => {
    // wall: ΔU_TB omitted → default 0.10
    // roof: ΔU_TB omitted → default 0.10
    // floor: explicit ΔU_TB=0.0
    const params: BuildingParams = {
      ...baseParams,
      elements: [
        { id: "wall-south", area: 20, uValue: 0.3, boundary: "external" },
        { id: "roof", area: 50, uValue: 0.2, boundary: "external" },
        { id: "floor", area: 50, uValue: 0.3, deltaThermalBridges: 0.0, boundary: "ground", temperatureFactor: 0.6 },
      ],
    };
    const { total, elementResults } = calculateTransmissionLoss(params);
    expect(elementResults).toHaveLength(3);
    const expected =
      20 * (0.3 + 0.10) * 1.0 * DELTA_T +
      50 * (0.2 + 0.10) * 1.0 * DELTA_T +
      50 * (0.3 + 0.0)  * 0.6 * DELTA_T;
    expect(total).toBeCloseTo(expected, 4);
  });
});

describe("calculateVentilationLoss", () => {
  it("calculates correct ventilation heat loss (explicit airChangeRate)", () => {
    const result = calculateVentilationLoss(baseParams);
    // 300 × 0.5 × 0.34 × 32 = 1632 W
    expect(result).toBeCloseTo(1632, 4);
  });

  it("uses the AIR_HEAT_CAPACITY constant (0.34)", () => {
    expect(AIR_HEAT_CAPACITY).toBe(0.34);
    const result = calculateVentilationLoss(baseParams);
    const manual =
      baseParams.internalVolume *
      baseParams.airChangeRate! *
      AIR_HEAT_CAPACITY *
      DELTA_T;
    expect(result).toBeCloseTo(manual, 10);
  });

  it("auto-resolves n_Build from buildingAirtightness (Table B.12 lookup)", () => {
    const params: BuildingParams = {
      ...baseParams,
      airChangeRate: undefined,
      buildingAirtightness: BuildingAirtightness.TIGHT,
    };
    const result = calculateVentilationLoss(params);
    // 300 × 0.25 × 0.34 × 32 = 816 W
    expect(result).toBeCloseTo(300 * 0.25 * AIR_HEAT_CAPACITY * DELTA_T, 4);
  });

  it("applies default n_Build = 0.5 when both airChangeRate and buildingAirtightness are omitted", () => {
    const params: BuildingParams = {
      ...baseParams,
      airChangeRate: undefined,
    };
    const result = calculateVentilationLoss(params);
    // 300 × 0.5 × 0.34 × 32 = 1632 W (same as explicit 0.5)
    expect(result).toBeCloseTo(300 * AIR_CHANGE_RATE_DEFAULT * AIR_HEAT_CAPACITY * DELTA_T, 4);
  });

  it("uses explicit airChangeRate over buildingAirtightness when both provided", () => {
    const params: BuildingParams = {
      ...baseParams,
      airChangeRate: 0.25,                                      // explicit wins
      buildingAirtightness: BuildingAirtightness.LEAKY,         // would give 1.0
    };
    const result = calculateVentilationLoss(params);
    // 300 × 0.25 × 0.34 × 32 = 816 W (not 1632)
    expect(result).toBeCloseTo(300 * 0.25 * AIR_HEAT_CAPACITY * DELTA_T, 4);
  });

  it("scales linearly with volume", () => {
    const double = calculateVentilationLoss({
      ...baseParams,
      internalVolume: 600,
    });
    const single = calculateVentilationLoss(baseParams);
    expect(double).toBeCloseTo(single * 2, 10);
  });
});

describe("calculateHeatLoad", () => {
  it("returns correct total heat load (Formula 54)", () => {
    const result = calculateHeatLoad(baseParams);
    // transmission: 20 × (0.3 + 0.10) × 1.0 × 32 = 256 W
    // ventilation: 300 × 0.5 × 0.34 × 32 = 1632 W
    expect(result.totalHeatLoad).toBeCloseTo(256 + 1632, 2);
  });

  it("total equals transmissionLoss + ventilationLoss", () => {
    const result = calculateHeatLoad(baseParams);
    expect(result.totalHeatLoad).toBeCloseTo(
      result.transmissionLoss + result.ventilationLoss,
      10,
    );
  });

  it("includes element-level breakdown in result", () => {
    const result = calculateHeatLoad(baseParams);
    expect(result.elementResults).toHaveLength(1);
    expect(result.elementResults[0]?.elementId).toBe("wall-south");
  });

  it("throws on invalid params with descriptive message", () => {
    const bad: BuildingParams = { ...baseParams, internalVolume: -1 };
    expect(() => calculateHeatLoad(bad)).toThrow("internalVolume");
  });

  it("handles mixed boundary elements and matches manual calculation", () => {
    // wall: ΔU_TB omitted → default 0.10
    // floor: explicit ΔU_TB=0.0
    const params: BuildingParams = {
      elements: [
        {
          id: "wall",
          area: 100,
          uValue: 0.25,
          boundary: "external",
        },
        {
          id: "floor",
          area: 80,
          uValue: 0.3,
          deltaThermalBridges: 0.0,
          boundary: "ground",
          temperatureFactor: 0.6,
        },
      ],
      internalVolume: 500,
      airChangeRate: 0.4,
      internalTemperature: 22,
      externalTemperature: -15,
    };
    const dT = 37; // 22 - (-15)
    const expectedT =
      100 * (0.25 + 0.10) * 1.0 * dT +
      80  * (0.3  + 0.0)  * 0.6 * dT;
    const expectedV = 500 * 0.4 * AIR_HEAT_CAPACITY * dT;

    const result = calculateHeatLoad(params);
    expect(result.transmissionLoss).toBeCloseTo(expectedT, 4);
    expect(result.ventilationLoss).toBeCloseTo(expectedV, 4);
    expect(result.totalHeatLoad).toBeCloseTo(expectedT + expectedV, 4);
  });
});
