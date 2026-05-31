import { describe, expect, it } from "vitest";
import { UnheatedSpaceType, resolveUnheatedFactor } from "../unheated-spaces.js";

describe("resolveUnheatedFactor — EN 12831-1 Table B.2", () => {
  describe("room or group of rooms", () => {
    it("1 external wall → 0.4", () => {
      expect(resolveUnheatedFactor(UnheatedSpaceType.ROOM_1_EXTERNAL_WALL)).toBe(0.4);
    });
    it("2 external walls, no door → 0.5", () => {
      expect(resolveUnheatedFactor(UnheatedSpaceType.ROOM_2_EXTERNAL_WALLS_NO_DOOR)).toBe(0.5);
    });
    it("2 external walls, with door → 0.6", () => {
      expect(resolveUnheatedFactor(UnheatedSpaceType.ROOM_2_EXTERNAL_WALLS_WITH_DOOR)).toBe(0.6);
    });
    it("3 or more external walls → 0.8", () => {
      expect(resolveUnheatedFactor(UnheatedSpaceType.ROOM_3_OR_MORE_EXTERNAL_WALLS)).toBe(0.8);
    });
  });

  describe("basement (>70% walls in contact with ground)", () => {
    it("no external doors/windows → 0.5", () => {
      expect(resolveUnheatedFactor(UnheatedSpaceType.BASEMENT_NO_OPENINGS)).toBe(0.5);
    });
    it("with external doors/windows → 0.8", () => {
      expect(resolveUnheatedFactor(UnheatedSpaceType.BASEMENT_WITH_OPENINGS)).toBe(0.8);
    });
  });

  describe("roof space", () => {
    it("high ventilation rate → 1.0", () => {
      expect(resolveUnheatedFactor(UnheatedSpaceType.ROOF_SPACE_HIGH_VENTILATION)).toBe(1.0);
    });
    it("other non-insulated → 0.9", () => {
      expect(resolveUnheatedFactor(UnheatedSpaceType.ROOF_SPACE_NOT_INSULATED)).toBe(0.9);
    });
    it("insulated → 0.7", () => {
      expect(resolveUnheatedFactor(UnheatedSpaceType.ROOF_SPACE_INSULATED)).toBe(0.7);
    });
  });

  describe("circulation area", () => {
    it("internal, no external walls, low ventilation → 0.0", () => {
      expect(resolveUnheatedFactor(UnheatedSpaceType.CIRCULATION_INTERNAL_LOW_VENT)).toBe(0.0);
    });
    it("freely ventilated → 1.0", () => {
      expect(resolveUnheatedFactor(UnheatedSpaceType.CIRCULATION_FREELY_VENTILATED)).toBe(1.0);
    });
  });

  describe("floor", () => {
    it("suspended floor above crawl space → 0.8", () => {
      expect(resolveUnheatedFactor(UnheatedSpaceType.FLOOR_ABOVE_CRAWL_SPACE)).toBe(0.8);
    });
  });
});
