/**
 * Приклад розрахунку розрахункового теплового навантаження будівлі
 * за EN 12831-1:2017, Метод 8 (спрощений метод для будівлі).
 *
 * Об'єкт: одноповерховий житловий будинок, м. Харків, 1980-ті рр. побудови.
 * Мета: визначення потужності теплогенератора для системи опалення.
 */

import { BuildingAirtightness }   from "../src/ventilation.js";
import { UkrainianCity, getDesignTemperature } from "../src/climate.js";
import { calculateHeatLoad }      from "../src/calculate.js";
import type { BuildingParams, HeatLoadResult } from "../src/types.js";

// ── 1. Кліматичні дані ────────────────────────────────────────────────────────
// Джерело: ДСТУ-Н Б В.1.1-27:2010, колонка t_н5 (температура холодної п'ятиденки)
const city = UkrainianCity.KHARKIV;
const externalTemperature = getDesignTemperature(city)!; // -23 °C

// ── 2. Опис будівлі ───────────────────────────────────────────────────────────
// Будинок: 10×10 м в плані, висота поверху 2.5 м
// Периметр стін: 4×10 м × 2.5 м = 100 м², мінус вікна (20 м²) та двері (3.6 м²) = 76.4 м²
// Двері: 2 × (0.9 × 2.0) = 3.6 м²

const params: BuildingParams = {
  internalTemperature: 20,          // θ_int = +20 °C (проектна)
  externalTemperature,              // θ_e  = -23 °C (ДСТУ-Н Б В.1.1-27:2010)
  internalVolume: 250,              // V_Build = 100 м² × 2.5 м = 250 м³

  // n_Build: будівля до 1995 р. → STANDARD → 0.5 год⁻¹ (EN 12831-1 Таблиця B.12)
  buildingAirtightness: BuildingAirtightness.STANDARD,

  elements: [
    // ── Зовнішні стіни ─────────────────────────────────────────────────────
    // Цегла повнотіла 510 мм (2 цеглини), без утеплення, серед. стан
    // U = 1.30 W/(m²·K) — CONSTRUCTION_CATALOG id "WALL_BRICK_510"
    // ΔU_TB = 0.10 за замовчуванням (EN 12831-1 B.3.2, клас "OTHER")
    // f_x = 1.0 (межа з зовнішнім повітрям)
    {
      id: "walls-external",
      label: "Зовнішні стіни (цегла 510 мм)",
      boundary: "external",
      area: 76.4,
      constructionCatalogId: "WALL_BRICK_510",
    },

    // ── Горищне перекриття / дах ────────────────────────────────────────────
    // Горищне перекриття, шлакобетон без утеплення
    // U = 1.05 W/(m²·K) — CONSTRUCTION_CATALOG id "ROOF_ATTIC_SLAG_UNINSULATED"
    {
      id: "roof",
      label: "Горищне перекриття (шлакобетон, без утеплення)",
      boundary: "external",
      area: 100,
      constructionCatalogId: "ROOF_ATTIC_SLAG_UNINSULATED",
    },

    // ── Підлога по ґрунту ───────────────────────────────────────────────────
    // Бетонна плита по ґрунту, без утеплення
    // U = 0.73 W/(m²·K) — CONSTRUCTION_CATALOG id "FLOOR_GROUND_BARE"
    // f_x = 0.3 за замовчуванням (EN 12831-1 Таблиця B.11)
    {
      id: "floor-ground",
      label: "Підлога по ґрунту (бетон, без утеплення)",
      boundary: "ground",
      area: 100,
      constructionCatalogId: "FLOOR_GROUND_BARE",
    },

    // ── Вікна ───────────────────────────────────────────────────────────────
    // Дерев'яні рами, двокамерне склопакет
    // U = 2.70 W/(m²·K) — CONSTRUCTION_CATALOG id "WINDOW_DOUBLE_WOOD"
    {
      id: "windows",
      label: "Вікна (дерево, 2-камерний склопакет)",
      boundary: "external",
      area: 20,
      constructionCatalogId: "WINDOW_DOUBLE_WOOD",
    },

    // ── Зовнішні двері ──────────────────────────────────────────────────────
    // Металеві без утеплення, 2 × (0.9 × 2.0) м
    // U = 3.25 W/(m²·K) — CONSTRUCTION_CATALOG id "DOOR_METAL_UNINSULATED"
    {
      id: "doors-external",
      label: "Зовнішні двері (метал, без утеплення)",
      boundary: "external",
      area: 3.6,
      constructionCatalogId: "DOOR_METAL_UNINSULATED",
    },
  ],
};

// ── 3. Розрахунок ─────────────────────────────────────────────────────────────
const result: HeatLoadResult = calculateHeatLoad(params);

// ── 4. Виведення результатів ──────────────────────────────────────────────────
const kW = (w: number) => `${(w / 1000).toFixed(2)} кВт`;
const pct = (part: number, total: number) =>
  `${((part / total) * 100).toFixed(1)}%`;

console.log("═══════════════════════════════════════════════════════════════");
console.log(" Пояснювальна записка — EN 12831-1, Метод 8");
console.log("═══════════════════════════════════════════════════════════════");
console.log(`  Місто: ${city}  |  θ_e = ${externalTemperature} °C  |  θ_int = ${params.internalTemperature} °C`);
console.log(`  ΔT = ${params.internalTemperature - externalTemperature} К`);
console.log(`  V_Build = ${params.internalVolume} м³  |  n_Build = 0.5 год⁻¹ (STANDARD)`);
console.log("───────────────────────────────────────────────────────────────");
console.log(" Трансмісійні втрати — елементи оболонки:");
console.log("───────────────────────────────────────────────────────────────");

for (const el of params.elements) {
  const er = result.elementResults.find((r) => r.elementId === el.id)!;
  const label = ("label" in el ? el.label : el.id) ?? el.id;
  console.log(`  ${label}`);
  console.log(`    → Φ_T = ${kW(er.transmissionLoss)}`);
}

console.log("───────────────────────────────────────────────────────────────");
console.log(
  ` Φ_T,build (трансмісія):   ${kW(result.transmissionLoss).padStart(10)}` +
  `  (${pct(result.transmissionLoss, result.totalHeatLoad)})`,
);
console.log(
  ` Φ_V,build (вентиляція):   ${kW(result.ventilationLoss).padStart(10)}` +
  `  (${pct(result.ventilationLoss, result.totalHeatLoad)})`,
);
console.log("═══════════════════════════════════════════════════════════════");
console.log(
  ` Φ_HL,build (навантаження):${kW(result.totalHeatLoad).padStart(10)}`,
);
console.log("═══════════════════════════════════════════════════════════════");
console.log(" Рекомендована потужність теплогенератора (з запасом 20%):");
console.log(`   ${kW(result.totalHeatLoad * 1.2)}`);
console.log("═══════════════════════════════════════════════════════════════");
