import { describe, expect, it } from "vitest";
import { CLIMATE_REGIONS, UkrainianCity, getDesignTemperature } from "../climate.js";

const ALL_ENUM_VALUES = Object.values(UkrainianCity);
const ALL_REGION_CITIES = CLIMATE_REGIONS.flatMap((r) => r.cities);

describe("CLIMATE_REGIONS structure", () => {
  it("has 25 regions", () => {
    expect(CLIMATE_REGIONS).toHaveLength(25);
  });

  it("has 57 cities in total", () => {
    expect(ALL_REGION_CITIES).toHaveLength(57);
  });

  it("every city in CLIMATE_REGIONS is a valid UkrainianCity enum value", () => {
    const enumSet = new Set(ALL_ENUM_VALUES);
    for (const city of ALL_REGION_CITIES) {
      expect(enumSet.has(city)).toBe(true);
    }
  });

  it("every UkrainianCity enum value appears in CLIMATE_REGIONS exactly once", () => {
    expect(ALL_REGION_CITIES).toHaveLength(ALL_ENUM_VALUES.length);
    expect(new Set(ALL_REGION_CITIES).size).toBe(ALL_ENUM_VALUES.length);
  });
});

describe("getDesignTemperature", () => {
  it("returns a number for every city (no unfilled placeholders)", () => {
    for (const city of ALL_ENUM_VALUES) {
      expect(getDesignTemperature(city)).not.toBeNull();
    }
  });

  it("returns correct values for selected cities", () => {
    expect(getDesignTemperature(UkrainianCity.KHARKIV)).toBe(-23);
    expect(getDesignTemperature(UkrainianCity.KYIV)).toBe(-22);
    expect(getDesignTemperature(UkrainianCity.LVIV)).toBe(-19);
    expect(getDesignTemperature(UkrainianCity.YALTA)).toBe(-6);
    expect(getDesignTemperature(UkrainianCity.SUMY)).toBe(-25);
  });
});
