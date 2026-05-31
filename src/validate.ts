import { lookupConstructionUValue } from "./construction-catalog.js";
import type { BuildingElement, BuildingParams, ValidationError } from "./types.js";

function validateElement(
  el: BuildingElement,
  index: number,
  errors: ValidationError[],
): void {
  const p = (field: string) => `elements[${index}].${field}`;

  if (!el.id || el.id.trim() === "") {
    errors.push({
      path: p("id"),
      message: "Element id must be a non-empty string.",
    });
  }
  if (el.area <= 0) {
    errors.push({
      path: p("area"),
      message: `Area must be > 0, got ${el.area}.`,
    });
  }
  if (el.uValue === undefined && el.constructionCatalogId === undefined) {
    errors.push({
      path: p("uValue"),
      message: "Either uValue or constructionCatalogId must be provided.",
    });
  } else if (el.uValue !== undefined && el.uValue < 0) {
    errors.push({
      path: p("uValue"),
      message: `U-value must be >= 0, got ${el.uValue}.`,
    });
  } else if (el.constructionCatalogId !== undefined && el.uValue === undefined) {
    if (lookupConstructionUValue(el.constructionCatalogId) === null) {
      errors.push({
        path: p("constructionCatalogId"),
        message: `Unknown construction catalog ID: "${el.constructionCatalogId}".`,
      });
    }
  }
  if (el.deltaThermalBridges !== undefined && el.deltaThermalBridges < 0) {
    errors.push({
      path: p("deltaThermalBridges"),
      message: `DeltaU_TB must be >= 0, got ${el.deltaThermalBridges}.`,
    });
  }

  if (el.boundary === "unheated") {
    if (
      el.temperatureFactor !== undefined &&
      (el.temperatureFactor <= 0 || el.temperatureFactor > 1)
    ) {
      errors.push({
        path: p("temperatureFactor"),
        message: `Temperature factor f_x must be in range (0, 1], got ${el.temperatureFactor}.`,
      });
    }
  } else if (el.boundary === "ground") {
    if (
      el.temperatureFactor !== undefined &&
      (el.temperatureFactor <= 0 || el.temperatureFactor > 1)
    ) {
      errors.push({
        path: p("temperatureFactor"),
        message: `Temperature factor f_x must be in range (0, 1], got ${el.temperatureFactor}.`,
      });
    }
  }
}

/**
 * Validates all input parameters for Method 8.
 * Returns an empty array when inputs are valid.
 */
export function validate(params: BuildingParams): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!Array.isArray(params.elements) || params.elements.length === 0) {
    errors.push({
      path: "elements",
      message: "At least one building element must be provided.",
    });
  } else {
    const ids = new Set<string>();
    params.elements.forEach((el, i) => {
      validateElement(el, i, errors);
      if (el.id) {
        if (ids.has(el.id)) {
          errors.push({
            path: `elements[${i}].id`,
            message: `Duplicate element id "${el.id}".`,
          });
        }
        ids.add(el.id);
      }
    });
  }

  if (params.internalVolume <= 0) {
    errors.push({
      path: "internalVolume",
      message: `Internal volume must be > 0, got ${params.internalVolume}.`,
    });
  }
  if (params.airChangeRate !== undefined && params.airChangeRate <= 0) {
    errors.push({
      path: "airChangeRate",
      message: `Air change rate must be > 0, got ${params.airChangeRate}.`,
    });
  }
  if (params.internalTemperature <= params.externalTemperature) {
    errors.push({
      path: "internalTemperature",
      message:
        `Internal temperature (${params.internalTemperature}°C) must be ` +
        `greater than external temperature (${params.externalTemperature}°C).`,
    });
  }

  return errors;
}
