import { describe, expect, it } from "vitest";
import {
  CONSTRUCTION_CATALOG,
  ElementType,
  getEntriesByType,
  lookupConstructionUValue,
} from "../construction-catalog.js";

describe("CONSTRUCTION_CATALOG structure", () => {
  it("has 26 entries", () => {
    expect(CONSTRUCTION_CATALOG).toHaveLength(26);
  });

  it("all IDs are unique", () => {
    const ids = CONSTRUCTION_CATALOG.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all entries have a non-null uValue (no unfilled placeholders)", () => {
    for (const entry of CONSTRUCTION_CATALOG) {
      expect(entry.uValue).not.toBeNull();
    }
  });

  it("covers all 6 element types", () => {
    const types = new Set(CONSTRUCTION_CATALOG.map((e) => e.elementType));
    expect(types.has(ElementType.EXTERNAL_WALL)).toBe(true);
    expect(types.has(ElementType.ROOF)).toBe(true);
    expect(types.has(ElementType.FLOOR_GROUND)).toBe(true);
    expect(types.has(ElementType.FLOOR_ABOVE_UNHEATED)).toBe(true);
    expect(types.has(ElementType.WINDOW)).toBe(true);
    expect(types.has(ElementType.DOOR)).toBe(true);
  });
});

describe("getEntriesByType", () => {
  it("returns only entries of the requested type", () => {
    const walls = getEntriesByType(ElementType.EXTERNAL_WALL);
    expect(walls.every((e) => e.elementType === ElementType.EXTERNAL_WALL)).toBe(true);
    expect(walls.length).toBeGreaterThan(0);
  });

  it("returns 9 external walls", () => {
    expect(getEntriesByType(ElementType.EXTERNAL_WALL)).toHaveLength(9);
  });

  it("returns 5 roof entries", () => {
    expect(getEntriesByType(ElementType.ROOF)).toHaveLength(5);
  });

  it("returns 5 window entries", () => {
    expect(getEntriesByType(ElementType.WINDOW)).toHaveLength(5);
  });
});

describe("lookupConstructionUValue", () => {
  it("returns correct U-value for known IDs", () => {
    expect(lookupConstructionUValue("WINDOW_SINGLE_GLAZING")).toBe(5.70);
    expect(lookupConstructionUValue("WALL_BRICK_510")).toBe(1.30);
    expect(lookupConstructionUValue("WALL_MODERN_2021")).toBe(0.25);
    expect(lookupConstructionUValue("DOOR_THERMAL_BREAK")).toBe(0.70);
  });

  it("returns null for unknown ID", () => {
    expect(lookupConstructionUValue("DOES_NOT_EXIST")).toBeNull();
  });
});