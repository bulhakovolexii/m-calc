/**
 * Catalog of typical Ukrainian building construction types with U-values.
 * EN 12831-1 A.4.3 — Simplified determination of U-values.
 *
 * Data sourced from Gemini Deep Research,
 * cross-referenced with СНиП II-3-79, ДБН В.2.6-31 (2006/2016/2021),
 * ДСТУ-Н Б А.2.2-5:2007, EN ISO 10077-1:2017, EN ISO 13370.
 *
 * U-values for historical constructions reflect in-use (degraded) conditions,
 * not idealized laboratory values.
 */

export enum ElementType {
  EXTERNAL_WALL        = "EXTERNAL_WALL",
  ROOF                 = "ROOF",
  FLOOR_GROUND         = "FLOOR_GROUND",
  FLOOR_ABOVE_UNHEATED = "FLOOR_ABOVE_UNHEATED",
  WINDOW               = "WINDOW",
  DOOR                 = "DOOR",
}

export interface ConstructionEntry {
  /** Unique identifier in SCREAMING_SNAKE_CASE. */
  id: string;
  elementType: ElementType;
  /** Typical period of construction use, e.g. "до 1993" or "1993–2006". */
  constructionPeriod: string;
  /** Ukrainian human-readable label for the UI. */
  label: string;
  /** U [W/(m²·K)]. Midpoint of research range. null if not determinable. */
  uValue: number | null;
  /** Source reference with range where applicable. */
  source?: string;
}

export const CONSTRUCTION_CATALOG: ConstructionEntry[] = [
  // ── Зовнішні стіни ────────────────────────────────────────────────────────
  {
    id: "WALL_BRICK_510",
    elementType: ElementType.EXTERNAL_WALL,
    constructionPeriod: "до 1993",
    label: "Цегла повнотіла 510 мм (2 цеглини), без утеплення",
    uValue: 1.30,
    source: "Діапазон 1.25–1.37; λ=0.81 W/(m·K), з урахуванням швів та зволоження — Gemini Deep Research, СНиП II-3-79",
  },
  {
    id: "WALL_BRICK_640",
    elementType: ElementType.EXTERNAL_WALL,
    constructionPeriod: "до 1993",
    label: "Цегла повнотіла 640 мм (2,5 цеглини), без утеплення",
    uValue: 1.00,
    source: "Діапазон 0.95–1.06; λ=0.81 W/(m·K) — Gemini Deep Research, СНиП II-3-79",
  },
  {
    id: "WALL_PANEL_KERAMZIT",
    elementType: ElementType.EXTERNAL_WALL,
    constructionPeriod: "до 1993",
    label: "Крупнопанельна, керамзитобетон 300–350 мм (серії 1-464, 1-480, 87, 96)",
    uValue: 1.20,
    source: "Керамзитобетон ρ=1200 kg/m³, λ≈0.52 W/(m·K); приведений R=0.80–0.86 з урахуванням стиків; діапазон 1.15–1.25 — Gemini Deep Research, СНиП II-3-79",
  },
  {
    id: "WALL_PANEL_THREE_LAYER",
    elementType: ElementType.EXTERNAL_WALL,
    constructionPeriod: "до 1993",
    label: "Тришарова залізобетонна панель (серія 90) з деградованим утеплювачем",
    uValue: 1.20,
    source: "ЗБ ребра-містки холоду + деградований мінераловатний серцевина; ефективний діапазон 1.10–1.30 — Gemini Deep Research",
  },
  {
    id: "WALL_BRICK_INSUL_EPS_50",
    elementType: ElementType.EXTERNAL_WALL,
    constructionPeriod: "2000–2010",
    label: "Цегла 510 мм + EPS 50 мм (субоптимальна термомодернізація)",
    uValue: 0.60,
    source: "Lock-in ефект: U падає з 1.25 до ≈0.60 але не досягає сучасних норм — Gemini Deep Research",
  },
  {
    id: "WALL_AERATED_D400_300",
    elementType: ElementType.EXTERNAL_WALL,
    constructionPeriod: "1993–2006",
    label: "Газобетон автоклавний D400, 300 мм (на ЦП розчині)",
    uValue: 0.40,
    source: "λ=0.12 W/(m·K), R≈2.5 m²·K/W — Gemini Deep Research, ДСТУ-Н Б А.2.2-5:2007",
  },
  {
    id: "WALL_BRICK_ETICS_100",
    elementType: ElementType.EXTERNAL_WALL,
    constructionPeriod: "після 2006",
    label: "Цегла 380–510 мм + СФТК (EPS або мінвата) 100 мм",
    uValue: 0.31,
    source: "∆R від EPS 100 мм ≈ 2.5 m²·K/W; сума ≈ 0.30–0.32 — Gemini Deep Research, ДБН В.2.6-31:2006",
  },
  {
    id: "WALL_AERATED_D500_400",
    elementType: ElementType.EXTERNAL_WALL,
    constructionPeriod: "після 2013",
    label: "Газобетон D400/500, 400 мм (на тонкошаровому клеї)",
    uValue: 0.30,
    source: "Тонкошаровий клей мінімізує містки в швах; діапазон 0.28–0.32 — Gemini Deep Research",
  },
  {
    id: "WALL_MODERN_2021",
    elementType: ElementType.EXTERNAL_WALL,
    constructionPeriod: "після 2021",
    label: "Сучасна стіна (ДБН В.2.6-31:2021, I кліматична зона)",
    uValue: 0.25,
    source: "R_min=4.0 m²·K/W за ДБН В.2.6-31:2021 — Gemini Deep Research",
  },

  // ── Покрівля / горищне перекриття ─────────────────────────────────────────
  {
    id: "ROOF_ATTIC_SLAG_UNINSULATED",
    elementType: ElementType.ROOF,
    constructionPeriod: "до 1993",
    label: "Горищне перекриття, ЗБ пустотна плита 220 мм + засипка шлак/керамзит (деградована)",
    uValue: 1.05,
    source: "Керамзит засипка деградує і зволожується; практичний діапазон 0.90–1.20 — Gemini Deep Research, СНиП II-3-79",
  },
  {
    id: "ROOF_FLAT_SLAGCONCRETE",
    elementType: ElementType.ROOF,
    constructionPeriod: "до 1993",
    label: "Суміщена пласка покрівля, ЗБ плита + шлакобетон без ефективного утеплення",
    uValue: 1.10,
    source: "Діапазон 1.00–1.20 — Gemini Deep Research, СНиП II-3-79",
  },
  {
    id: "ROOF_ATTIC_INSUL_100",
    elementType: ElementType.ROOF,
    constructionPeriod: "1993–2006",
    label: "Горищне перекриття + мінвата або EPS 100 мм (перша хвиля енергозбереження)",
    uValue: 0.75,
    source: "Нормативний діапазон 0.65–0.85; зміна №1 до СНиП II-3-79 — Gemini Deep Research",
  },
  {
    id: "ROOF_INSULATED_2006",
    elementType: ElementType.ROOF,
    constructionPeriod: "2006–2021",
    label: "Покрівля або горищне перекриття + ефективне утеплення 150–200 мм (ДБН 2006)",
    uValue: 0.22,
    source: "Нормативний діапазон 0.20–0.25 за ДБН В.2.6-31:2006 — Gemini Deep Research",
  },
  {
    id: "ROOF_MODERN_2021",
    elementType: ElementType.ROOF,
    constructionPeriod: "після 2021",
    label: "Сучасна покрівля (ДБН В.2.6-31:2021, I кліматична зона)",
    uValue: 0.16,
    source: "R_min=6.0 m²·K/W за ДБН В.2.6-31:2021 — Gemini Deep Research",
  },

  // ── Підлога на ґрунті ─────────────────────────────────────────────────────
  {
    id: "FLOOR_GROUND_BARE",
    elementType: ElementType.FLOOR_GROUND,
    constructionPeriod: "до 1993",
    label: "Підлога на ґрунті, бетонна плита без теплоізоляції",
    uValue: 0.73,
    source: "Усереднений U по площі будівлі середнього розміру; діапазон 0.65–0.80 — Gemini Deep Research, EN ISO 13370",
  },
  {
    id: "FLOOR_GROUND_XPS_100",
    elementType: ElementType.FLOOR_GROUND,
    constructionPeriod: "після 2006",
    label: "Підлога на ґрунті, бетонна плита + XPS 100 мм під плитою",
    uValue: 0.23,
    source: "Рівномірний розподіл по площі; діапазон 0.20–0.25 — Gemini Deep Research, ДБН В.2.6-31:2006",
  },

  // ── Перекриття над неопалювальним підвалом ────────────────────────────────
  {
    id: "FLOOR_ABOVE_UNHEATED_BARE",
    elementType: ElementType.FLOOR_ABOVE_UNHEATED,
    constructionPeriod: "до 1993",
    label: "Перекриття над неопалювальним підвалом / підпіллям, ЗБ плита без утеплення",
    uValue: 1.08,
    source: "R≈0.80–1.10 m²·K/W; практичний діапазон U=0.91–1.25 — Gemini Deep Research, СНиП II-3-79",
  },
  {
    id: "FLOOR_ABOVE_UNHEATED_INSUL_50",
    elementType: ElementType.FLOOR_ABOVE_UNHEATED,
    constructionPeriod: "після 2006",
    label: "Перекриття над неопалювальним підвалом / підпіллям + XPS або мінвата 50–100 мм",
    uValue: 0.28,
    source: "Нормативний діапазон 0.26–0.30 за ДБН В.2.6-31:2006 — Gemini Deep Research",
  },

  // ── Вікна ─────────────────────────────────────────────────────────────────
  {
    id: "WINDOW_SINGLE_GLAZING",
    elementType: ElementType.WINDOW,
    constructionPeriod: "до 1970",
    label: "Дерев'яна рама з одинарним склінням",
    uValue: 5.70,
    source: "EN ISO 10077-1:2017, Table B.2",
  },
  {
    id: "WINDOW_DOUBLE_WOOD",
    elementType: ElementType.WINDOW,
    constructionPeriod: "1970–1993",
    label: "Дерев'яна спарена рама, два листи скла (радянський стандарт)",
    uValue: 2.70,
    source: "R≈0.30–0.40 m²·K/W; діапазон 2.50–3.30 — Gemini Deep Research, EN ISO 10077-1:2017",
  },
  {
    id: "WINDOW_PVC_SINGLE_CHAMBER",
    elementType: ElementType.WINDOW,
    constructionPeriod: "1993–2006",
    label: "ПВХ-профіль, однокамерний склопакет без Low-E та газового заповнення",
    uValue: 2.45,
    source: "Діапазон 2.10–2.80 — Gemini Deep Research, Зміна №1 до СНиП II-3-79",
  },
  {
    id: "WINDOW_PVC_DOUBLE_LOW_E",
    elementType: ElementType.WINDOW,
    constructionPeriod: "2006–2021",
    label: "ПВХ-профіль, двокамерний склопакет з Low-E склом та аргоном",
    uValue: 1.38,
    source: "Діапазон 1.30–1.45; відповідає R_min=0.75 за ДБН В.2.6-31:2006 — Gemini Deep Research",
  },
  {
    id: "WINDOW_MODERN",
    elementType: ElementType.WINDOW,
    constructionPeriod: "після 2021",
    label: "ПВХ-профіль, двокамерний склопакет з 2×Low-E, аргон/криптон, «тепла» рамка",
    uValue: 0.90,
    source: "ДБН В.2.6-31:2021, R_min=0.9 m²·K/W — Gemini Deep Research",
  },

  // ── Зовнішні двері ────────────────────────────────────────────────────────
  {
    id: "DOOR_METAL_UNINSULATED",
    elementType: ElementType.DOOR,
    constructionPeriod: "до 2006",
    label: "Металеві або дерев'яні зовнішні двері без ефективного утеплення",
    uValue: 3.25,
    source: "Діапазон 3.00–3.50 — Gemini Deep Research, СНиП II-3-79",
  },
  {
    id: "DOOR_METAL_INSULATED",
    elementType: ElementType.DOOR,
    constructionPeriod: "2006–2021",
    label: "Металеві двері з мінватою або PU-піною (без терморозриву в коробці)",
    uValue: 1.60,
    source: "Діапазон 1.50–1.70; слабке місце — металева коробка — Gemini Deep Research",
  },
  {
    id: "DOOR_THERMAL_BREAK",
    elementType: ElementType.DOOR,
    constructionPeriod: "після 2021",
    label: "Металеві двері з поліамідним терморозривом у полотні та коробці",
    uValue: 0.70,
    source: "ДБН В.2.6-31:2021, U_max=0.70 — Gemini Deep Research",
  },
];

/** Returns U-value [W/(m²·K)] for a catalog entry, or null if unknown. */
export function lookupConstructionUValue(id: string): number | null {
  return CONSTRUCTION_CATALOG.find((e) => e.id === id)?.uValue ?? null;
}

/** Returns all catalog entries for a given element type. */
export function getEntriesByType(type: ElementType): ConstructionEntry[] {
  return CONSTRUCTION_CATALOG.filter((e) => e.elementType === type);
}