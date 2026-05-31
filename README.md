# m-calc

TypeScript ESM module for building design heat load calculation per **EN 12831-1:2017, Method 8** (Simplified method for building design heat load).

Intended for use in Angular-based online calculators targeting the Ukrainian market. Climate data is sourced from ДСТУ-Н Б В.1.1-27:2010; construction U-values reflect the Ukrainian existing building stock.

**93 tests passing. Zero runtime dependencies.**

---

## What it calculates

**Formula 54 — Building design heat load:**

```text
Φ_HL,build = Φ_T,build + Φ_V,build
```

**Formula 55 — Transmission heat loss:**

```text
Φ_T,build = Σ_k [ A_k · (U_k + ΔU_TB) · f_x,k ] · (θ_int − θ_e)
```

**Formula 56 — Ventilation heat loss:**

```text
Φ_V,build = V_Build · n_Build · 0.34 · (θ_int − θ_e)
```

Method 8 is appropriate for determining the heat generator capacity (boiler, heat pump) in existing buildings. It is not a substitute for the full standard method (Method 6) when designing both the heat generation and emission systems simultaneously.

---

## Installation

```bash
npm install m-calc
```

Requires Node.js ≥ 18 (ESM, `"type": "module"`).

---

## Quick start

```typescript
import {
  calculateHeatLoad,
  BuildingAirtightness,
  UkrainianCity,
  getDesignTemperature,
} from "m-calc";

const result = calculateHeatLoad({
  internalTemperature: 20,
  externalTemperature: getDesignTemperature(UkrainianCity.KHARKIV)!, // -23 °C
  internalVolume: 250,
  buildingAirtightness: BuildingAirtightness.STANDARD, // → n_Build = 0.5 h⁻¹
  elements: [
    {
      id: "walls",
      boundary: "external",
      area: 76.4,
      constructionCatalogId: "WALL_BRICK_510", // → U = 1.30 W/(m²·K)
    },
    {
      id: "roof",
      boundary: "external",
      area: 100,
      constructionCatalogId: "ROOF_ATTIC_SLAG_UNINSULATED", // → U = 1.05 W/(m²·K)
    },
    {
      id: "floor",
      boundary: "ground",
      area: 100,
      constructionCatalogId: "FLOOR_GROUND_BARE", // → U = 0.73, f_x = 0.3
    },
    {
      id: "windows",
      boundary: "external",
      area: 20,
      constructionCatalogId: "WINDOW_DOUBLE_WOOD", // → U = 2.70 W/(m²·K)
    },
    {
      id: "doors",
      boundary: "external",
      area: 3.6,
      constructionCatalogId: "DOOR_METAL_UNINSULATED", // → U = 3.25 W/(m²·K)
    },
  ],
});

console.log(`Transmission: ${(result.transmissionLoss / 1000).toFixed(2)} kW`);
console.log(`Ventilation:  ${(result.ventilationLoss / 1000).toFixed(2)} kW`);
console.log(`Total load:   ${(result.totalHeatLoad / 1000).toFixed(2)} kW`);
// Transmission: 13.54 kW
// Ventilation:  1.83 kW
// Total load:   15.37 kW
```

A fully annotated version of this example is in [examples/example-calculation.ts](examples/example-calculation.ts). A step-by-step walkthrough with formula references is in [example-calculation-explanation.md](example-calculation-explanation.md).

---

## Core API

### `calculateHeatLoad(params: BuildingParams): HeatLoadResult`

Runs validation, then computes Formulas 54–56. Throws `Error` if validation fails — the error message lists all invalid fields.

```typescript
interface HeatLoadResult {
  transmissionLoss: number;   // Φ_T,build [W]
  ventilationLoss:  number;   // Φ_V,build [W]
  totalHeatLoad:    number;   // Φ_HL,build [W]
  elementResults:   ElementResult[]; // per-element breakdown
}

interface ElementResult {
  elementId:        string;
  transmissionLoss: number; // Φ_T,k [W]
}
```

### `calculateTransmissionLoss(params)` / `calculateVentilationLoss(params)`

Same inputs as `calculateHeatLoad`, but skip validation and return individual components. Useful when you need partial results or have already validated upstream.

### `validate(params: BuildingParams): ValidationError[]`

Returns an empty array when inputs are valid, or a list of field-level errors:

```typescript
interface ValidationError {
  path:    string; // e.g. "elements[0].uValue"
  message: string;
}
```

Call this separately when you want per-field error display (e.g. form validation in UI) rather than a thrown exception.

---

## Input parameters

### `BuildingParams`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `elements` | `BuildingElement[]` | yes | All outer surfaces of the thermal envelope |
| `internalVolume` | `number` | yes | V_Build — air volume [m³] |
| `internalTemperature` | `number` | yes | θ_int [°C] |
| `externalTemperature` | `number` | yes | θ_e [°C] |
| `airChangeRate` | `number` | no | n_Build [h⁻¹] — explicit override |
| `buildingAirtightness` | `BuildingAirtightness` | no | Table B.12 lookup for n_Build |

When both `airChangeRate` and `buildingAirtightness` are omitted, `n_Build = 0.5 h⁻¹` applies (EN 12831-1 Table B.12, STANDARD level).

### `BuildingElement`

Discriminated union on `boundary`:

```typescript
type BuildingElement = ExternalElement | UnheatedElement | GroundElement;
```

**Fields common to all elements:**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes | Unique identifier |
| `label` | `string` | no | Human-readable name for reports |
| `area` | `number` | yes | A_k [m²] — outer surface area |
| `uValue` | `number` | one of | U_k [W/(m²·K)] — explicit value |
| `constructionCatalogId` | `string` | one of | ID from `CONSTRUCTION_CATALOG` — auto-resolves U_k |
| `deltaThermalBridges` | `number` | no | ΔU_TB [W/(m²·K)] — explicit override |
| `thermalBridgeClass` | `ThermalBridgeClass` | no | Table B.1 lookup for ΔU_TB |

Either `uValue` or `constructionCatalogId` must be provided. When `deltaThermalBridges` and `thermalBridgeClass` are both omitted, `ΔU_TB = 0.10` applies (EN 12831-1 B.3.2, class OTHER).

**`boundary: "external"`** — f_x = 1.0, no additional fields.

**`boundary: "unheated"`** — element adjacent to an unconditioned space:

| Field | Type | Description |
| --- | --- | --- |
| `unheatedSpaceType` | `UnheatedSpaceType` | Table B.2 lookup for f_x |
| `temperatureFactor` | `number` | Explicit f_x override |

When both are omitted, `f_x = 0.5` (EN 12831-1 Table B.11).

**`boundary: "ground"`** — element adjacent to the ground:

| Field | Type | Description |
| --- | --- | --- |
| `temperatureFactor` | `number` | Explicit f_x override |

When omitted, `f_x = 0.3` (EN 12831-1 Table B.11).

---

## Three-tier resolution

Every auto-resolvable parameter follows the same priority order:

```text
1. Explicit value     — highest priority, always wins
2. Enum / catalog     — lookup from Table B.x or CONSTRUCTION_CATALOG
3. Default constant   — lowest priority, applies when nothing is provided
```

| Parameter | Explicit field | Enum/catalog | Default |
| --- | --- | --- | --- |
| U_k | `uValue` | `constructionCatalogId` | — *(error if both absent)* |
| ΔU_TB | `deltaThermalBridges` | `thermalBridgeClass` | `0.10` (B.3.2) |
| n_Build | `airChangeRate` | `buildingAirtightness` | `0.5` (B.12 STANDARD) |
| f_x (unheated) | `temperatureFactor` | `unheatedSpaceType` | `0.5` (B.11) |
| f_x (ground) | `temperatureFactor` | — | `0.3` (B.11) |
| f_x (external) | — | — | `1.0` (§8.3.2) |

---

## Climate data

```typescript
import { UkrainianCity, getDesignTemperature, CLIMATE_REGIONS } from "m-calc";

// Look up θ_e for a city
getDesignTemperature(UkrainianCity.KYIV);     // -22
getDesignTemperature(UkrainianCity.KHARKIV);  // -23
getDesignTemperature(UkrainianCity.LVIV);     // -19
getDesignTemperature(UkrainianCity.ODESA);    // -15

// 57 cities across 25 regions
CLIMATE_REGIONS.forEach(r => console.log(r.region, r.cities));
```

Source: **ДСТУ-Н Б В.1.1-27:2010**, column t_н5 (design temperature of the coldest five-day period, probability 0.92).

---

## Construction catalog

```typescript
import {
  CONSTRUCTION_CATALOG,
  ElementType,
  getEntriesByType,
  lookupConstructionUValue,
} from "m-calc";

// All 26 entries
console.log(CONSTRUCTION_CATALOG.length); // 26

// Entries for a specific element type
const walls = getEntriesByType(ElementType.EXTERNAL_WALL); // 9 entries

// Look up U-value by catalog ID
lookupConstructionUValue("WALL_BRICK_510");          // 1.30
lookupConstructionUValue("WINDOW_PVC_DOUBLE_LOW_E"); // 1.38
lookupConstructionUValue("DOES_NOT_EXIST");          // null
```

**Catalog coverage:**

| Type | Count | Period range |
| --- | --- | --- |
| External walls | 9 | до 1993 → після 2021 |
| Roof / attic | 5 | до 1993 → після 2021 |
| Floor on ground | 2 | до 1993, після 2006 |
| Floor above unheated space | 2 | до 1993, після 2006 |
| Windows | 5 | до 1970 → modern |
| Doors | 3 | uninsulated → thermal break |

U-values reflect in-use (degraded) conditions for historical constructions. Sources: СНиП II-3-79, ДБН В.2.6-31 (2006/2016/2021), ДСТУ-Н Б А.2.2-5:2007, EN ISO 10077-1:2017.

---

## Enums reference

### `BuildingAirtightness` — EN 12831-1 Table B.12

| Value | n50 | Typical building | n_Build |
| --- | --- | --- | --- |
| `TIGHT` | ≤ 3 h⁻¹ | Built ≥ 1995, certified windows | 0.25 h⁻¹ |
| `STANDARD` | 3–6 h⁻¹ | Built before 1995 | 0.5 h⁻¹ |
| `LEAKY` | > 6 h⁻¹ | Built before 1977, visible leakages | 1.0 h⁻¹ |

### `ThermalBridgeClass` — EN 12831-1 Table B.1

| Value | ΔU_TB | Description |
| --- | --- | --- |
| `MINIMIZED_ATTESTED` | 0.02 | New buildings, attested minimization |
| `STANDARD_PRACTICE` | 0.05 | New buildings, standard practice |
| `INTERNAL_INSULATION_SOLID_CEILING` | 0.15 | Internal insulation broken by solid ceilings |
| `OTHER` | 0.10 | All other buildings *(default)* |

### `UnheatedSpaceType` — EN 12831-1 Table B.2

| Value | f_x | Space description |
| --- | --- | --- |
| `ROOM_1_EXTERNAL_WALL` | 0.4 | Room with 1 external wall |
| `ROOM_2_EXTERNAL_WALLS_NO_DOOR` | 0.5 | Room with 2 external walls, no external door |
| `ROOM_2_EXTERNAL_WALLS_WITH_DOOR` | 0.6 | Room with 2 external walls and external door |
| `ROOM_3_OR_MORE_EXTERNAL_WALLS` | 0.8 | Room with 3+ external walls |
| `BASEMENT_NO_OPENINGS` | 0.5 | Basement, >70% wall area below ground, no openings |
| `BASEMENT_WITH_OPENINGS` | 0.8 | Basement with openings |
| `ROOF_SPACE_HIGH_VENTILATION` | 1.0 | Highly ventilated roof space |
| `ROOF_SPACE_NOT_INSULATED` | 0.9 | Roof space, not insulated |
| `ROOF_SPACE_INSULATED` | 0.7 | Roof space, insulated floor |
| `CIRCULATION_INTERNAL_LOW_VENT` | 0.0 | Internal stairwell, low ventilation |
| `CIRCULATION_FREELY_VENTILATED` | 1.0 | Freely ventilated stairwell |
| `FLOOR_ABOVE_CRAWL_SPACE` | 0.8 | Floor above crawl space |

---

## Advanced usage

### Form validation before calculation

```typescript
import { validate, calculateHeatLoad } from "m-calc";

const errors = validate(params);
if (errors.length > 0) {
  // show errors in the form
  errors.forEach(e => console.error(`${e.path}: ${e.message}`));
} else {
  const result = calculateHeatLoad(params);
}
```

### Mixed explicit and catalog values

```typescript
// Most elements use catalog IDs; one uses an explicit U-value from a passport
{
  id: "wall-certified",
  boundary: "external",
  area: 45,
  uValue: 0.18,                  // from building energy certificate
  thermalBridgeClass: ThermalBridgeClass.MINIMIZED_ATTESTED, // → ΔU_TB = 0.02
}
```

### Explicit thermal bridge correction

```typescript
// Detailed Annex C calculation was performed — no blanket correction
{
  id: "roof-detailed",
  boundary: "external",
  area: 120,
  uValue: 0.20,
  deltaThermalBridges: 0,  // bridges accounted for explicitly
}
```

### Element adjacent to unheated basement

```typescript
import { UnheatedSpaceType } from "m-calc";

{
  id: "floor-over-basement",
  boundary: "unheated",
  area: 85,
  constructionCatalogId: "FLOOR_ABOVE_UNHEATED_BARE",
  unheatedSpaceType: UnheatedSpaceType.BASEMENT_NO_OPENINGS, // → f_x = 0.5
}
```

---

## Development

```bash
npm test          # run all 93 tests (vitest)
npm run test:watch
npm run build     # compile to dist/
```

TypeScript strict mode is enabled throughout:
`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitReturns`.

---

## Standards and sources

| Document | Used for |
| --- | --- |
| **EN 12831-1:2017** | Core calculation method (Formulas 54–56), default values (Annex B) |
| **ДСТУ-Н Б В.1.1-27:2010** | Design external temperatures for 57 Ukrainian cities |
| **СНиП II-3-79** | U-values for Soviet-era wall and roof constructions |
| **ДБН В.2.6-31:2006/2016/2021** | U-values for post-1993 constructions |
| **ДСТУ-Н Б А.2.2-5:2007** | Reference U-values for existing building stock surveys |
| **EN ISO 10077-1:2017** | U-values for windows and doors |
| **EN ISO 13370:2017** | Ground heat transfer methodology (informative reference) |
