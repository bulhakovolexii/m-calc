import { describe, expect, it } from "vitest";
import { validate } from "../validate.js";
import type { BuildingParams } from "../types.js";
import { UnheatedSpaceType } from "../unheated-spaces.js";

const validParams: BuildingParams = {
  elements: [
    {
      id: "wall-south",
      area: 20,
      uValue: 0.3,
      boundary: "external",
      // deltaThermalBridges omitted — auto-resolved
    },
  ],
  internalVolume: 300,
  airChangeRate: 0.5,
  internalTemperature: 20,
  externalTemperature: -12,
};

describe("validate", () => {
  it("returns no errors for valid external element params", () => {
    expect(validate(validParams)).toEqual([]);
  });

  it("returns no errors when conditioned element has valid temperatureFactor", () => {
    const params: BuildingParams = {
      ...validParams,
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
    expect(validate(params)).toEqual([]);
  });

  describe("elements", () => {
    it("errors when elements array is empty", () => {
      const errors = validate({ ...validParams, elements: [] });
      expect(errors).toContainEqual(
        expect.objectContaining({ path: "elements" }),
      );
    });

    it("errors when element area is zero", () => {
      const params: BuildingParams = {
        ...validParams,
        elements: [{ ...validParams.elements[0]!, area: 0 }],
      };
      const errors = validate(params);
      expect(errors).toContainEqual(
        expect.objectContaining({ path: "elements[0].area" }),
      );
    });

    it("errors when element area is negative", () => {
      const params: BuildingParams = {
        ...validParams,
        elements: [{ ...validParams.elements[0]!, area: -5 }],
      };
      const errors = validate(params);
      expect(errors).toContainEqual(
        expect.objectContaining({ path: "elements[0].area" }),
      );
    });

    it("errors when both uValue and constructionCatalogId are omitted", () => {
      const params: BuildingParams = {
        ...validParams,
        elements: [{ id: "wall", area: 20, boundary: "external" }],
      };
      const errors = validate(params);
      expect(errors).toContainEqual(
        expect.objectContaining({ path: "elements[0].uValue" }),
      );
    });

    it("accepts valid constructionCatalogId without uValue", () => {
      const params: BuildingParams = {
        ...validParams,
        elements: [{ id: "wall", area: 20, boundary: "external", constructionCatalogId: "WALL_BRICK_510" }],
      };
      expect(validate(params)).toEqual([]);
    });

    it("errors on unknown constructionCatalogId", () => {
      const params: BuildingParams = {
        ...validParams,
        elements: [{ id: "wall", area: 20, boundary: "external", constructionCatalogId: "DOES_NOT_EXIST" }],
      };
      const errors = validate(params);
      expect(errors).toContainEqual(
        expect.objectContaining({ path: "elements[0].constructionCatalogId" }),
      );
    });

    it("does not validate constructionCatalogId when explicit uValue is also provided", () => {
      const params: BuildingParams = {
        ...validParams,
        elements: [{ id: "wall", area: 20, uValue: 0.3, boundary: "external", constructionCatalogId: "DOES_NOT_EXIST" }],
      };
      expect(validate(params)).toEqual([]);
    });

    it("errors when uValue is negative", () => {
      const params: BuildingParams = {
        ...validParams,
        elements: [{ ...validParams.elements[0]!, uValue: -0.1 }],
      };
      const errors = validate(params);
      expect(errors).toContainEqual(
        expect.objectContaining({ path: "elements[0].uValue" }),
      );
    });

    it("allows uValue of zero (theoretical perfect insulation)", () => {
      const params: BuildingParams = {
        ...validParams,
        elements: [{ ...validParams.elements[0]!, uValue: 0 }],
      };
      expect(validate(params)).toEqual([]);
    });

    it("errors when explicit deltaThermalBridges is negative", () => {
      const params: BuildingParams = {
        ...validParams,
        elements: [{ ...validParams.elements[0]!, deltaThermalBridges: -0.01 }],
      };
      const errors = validate(params);
      expect(errors).toContainEqual(
        expect.objectContaining({ path: "elements[0].deltaThermalBridges" }),
      );
    });

    it("does not error when deltaThermalBridges is omitted (auto-resolved)", () => {
      expect(validate(validParams)).toEqual([]);
    });

    it("allows explicit deltaThermalBridges of 0 (Annex C case)", () => {
      const params: BuildingParams = {
        ...validParams,
        elements: [{ ...validParams.elements[0]!, deltaThermalBridges: 0 }],
      };
      expect(validate(params)).toEqual([]);
    });

    it("errors on duplicate element ids", () => {
      const params: BuildingParams = {
        ...validParams,
        elements: [
          { ...validParams.elements[0]!, id: "dup" },
          { ...validParams.elements[0]!, id: "dup" },
        ],
      };
      const errors = validate(params);
      expect(errors).toContainEqual(
        expect.objectContaining({ path: "elements[1].id" }),
      );
    });

    it("errors when element id is empty", () => {
      const params: BuildingParams = {
        ...validParams,
        elements: [{ ...validParams.elements[0]!, id: "" }],
      };
      const errors = validate(params);
      expect(errors).toContainEqual(
        expect.objectContaining({ path: "elements[0].id" }),
      );
    });

    describe("temperatureFactor — boundary-specific rules", () => {
      it("does not require temperatureFactor on external elements", () => {
        expect(validate(validParams)).toEqual([]);
      });

      describe("boundary: unheated", () => {
        it("accepts unheated element with no type and no factor (defaults to 0.5)", () => {
          const params: BuildingParams = {
            ...validParams,
            elements: [
              { id: "wall", area: 20, uValue: 0.3, boundary: "unheated" },
            ],
          };
          expect(validate(params)).toEqual([]);
        });

        it("accepts unheatedSpaceType without temperatureFactor", () => {
          const params: BuildingParams = {
            ...validParams,
            elements: [
              {
                id: "wall",
                area: 20,
                uValue: 0.3,
                boundary: "unheated",
                unheatedSpaceType: UnheatedSpaceType.BASEMENT_NO_OPENINGS,
              },
            ],
          };
          expect(validate(params)).toEqual([]);
        });

        it("accepts explicit temperatureFactor without unheatedSpaceType", () => {
          const params: BuildingParams = {
            ...validParams,
            elements: [
              {
                id: "wall",
                area: 20,
                uValue: 0.3,
                boundary: "unheated",
                temperatureFactor: 0.5,
              },
            ],
          };
          expect(validate(params)).toEqual([]);
        });

        it("accepts both unheatedSpaceType and explicit temperatureFactor (override)", () => {
          const params: BuildingParams = {
            ...validParams,
            elements: [
              {
                id: "wall",
                area: 20,
                uValue: 0.3,
                boundary: "unheated",
                unheatedSpaceType: UnheatedSpaceType.BASEMENT_NO_OPENINGS,
                temperatureFactor: 0.45,
              },
            ],
          };
          expect(validate(params)).toEqual([]);
        });

        it("errors when explicit temperatureFactor is zero", () => {
          const params: BuildingParams = {
            ...validParams,
            elements: [
              {
                id: "wall-unheated",
                area: 20,
                uValue: 0.3,
                boundary: "unheated",
                temperatureFactor: 0,
              },
            ],
          };
          const errors = validate(params);
          expect(errors).toContainEqual(
            expect.objectContaining({ path: "elements[0].temperatureFactor" }),
          );
        });

        it("allows temperatureFactor of exactly 1.0", () => {
          const params: BuildingParams = {
            ...validParams,
            elements: [
              {
                id: "wall-unheated",
                area: 20,
                uValue: 0.3,
                boundary: "unheated",
                temperatureFactor: 1.0,
              },
            ],
          };
          expect(validate(params)).toEqual([]);
        });
      });

      describe("boundary: ground", () => {
        it("accepts ground element without temperatureFactor (auto-resolves to 0.3)", () => {
          const params: BuildingParams = {
            ...validParams,
            elements: [
              { id: "floor", area: 50, uValue: 0.3, boundary: "ground" },
            ],
          };
          expect(validate(params)).toEqual([]);
        });

        it("errors when explicit temperatureFactor exceeds 1", () => {
          const params: BuildingParams = {
            ...validParams,
            elements: [
              {
                id: "floor",
                area: 50,
                uValue: 0.3,
                deltaThermalBridges: 0.0,
                boundary: "ground",
                temperatureFactor: 1.1,
              },
            ],
          };
          const errors = validate(params);
          expect(errors).toContainEqual(
            expect.objectContaining({ path: "elements[0].temperatureFactor" }),
          );
        });

        it("accepts explicit temperatureFactor of exactly 1.0", () => {
          const params: BuildingParams = {
            ...validParams,
            elements: [
              {
                id: "floor",
                area: 50,
                uValue: 0.3,
                boundary: "ground",
                temperatureFactor: 1.0,
              },
            ],
          };
          expect(validate(params)).toEqual([]);
        });
      });
    });
  });

  describe("building params", () => {
    it("errors when internalVolume is zero", () => {
      const errors = validate({ ...validParams, internalVolume: 0 });
      expect(errors).toContainEqual(
        expect.objectContaining({ path: "internalVolume" }),
      );
    });

    it("errors when airChangeRate is zero", () => {
      const errors = validate({ ...validParams, airChangeRate: 0 });
      expect(errors).toContainEqual(
        expect.objectContaining({ path: "airChangeRate" }),
      );
    });

    it("errors when internalTemperature equals externalTemperature", () => {
      const errors = validate({
        ...validParams,
        internalTemperature: -12,
        externalTemperature: -12,
      });
      expect(errors).toContainEqual(
        expect.objectContaining({ path: "internalTemperature" }),
      );
    });

    it("errors when internalTemperature is less than externalTemperature", () => {
      const errors = validate({
        ...validParams,
        internalTemperature: -15,
        externalTemperature: -12,
      });
      expect(errors).toContainEqual(
        expect.objectContaining({ path: "internalTemperature" }),
      );
    });

    it("collects multiple independent errors at once", () => {
      const errors = validate({
        ...validParams,
        internalVolume: 0,
        airChangeRate: -1,
      });
      expect(errors.length).toBeGreaterThanOrEqual(2);
    });
  });
});
