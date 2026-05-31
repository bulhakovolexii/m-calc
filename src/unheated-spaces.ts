/**
 * Unheated (unconditioned) adjacent space types per EN 12831-1 Table B.2.
 * Used to auto-resolve the temperature adjustment factor f_l (≡ f_x,k).
 *
 * When unheatedSpaceType is omitted, the simplified default of 0.5 applies
 * per EN 12831-1 Table B.11.
 */
export enum UnheatedSpaceType {
  // Room or group of adjoining rooms/spaces
  ROOM_1_EXTERNAL_WALL = "ROOM_1_EXTERNAL_WALL",
  ROOM_2_EXTERNAL_WALLS_NO_DOOR = "ROOM_2_EXTERNAL_WALLS_NO_DOOR",
  ROOM_2_EXTERNAL_WALLS_WITH_DOOR = "ROOM_2_EXTERNAL_WALLS_WITH_DOOR",
  ROOM_3_OR_MORE_EXTERNAL_WALLS = "ROOM_3_OR_MORE_EXTERNAL_WALLS",

  // Basement (>70% of external wall area in contact with the ground)
  BASEMENT_NO_OPENINGS = "BASEMENT_NO_OPENINGS",
  BASEMENT_WITH_OPENINGS = "BASEMENT_WITH_OPENINGS",

  // Roof space
  ROOF_SPACE_HIGH_VENTILATION = "ROOF_SPACE_HIGH_VENTILATION",
  ROOF_SPACE_NOT_INSULATED = "ROOF_SPACE_NOT_INSULATED",
  ROOF_SPACE_INSULATED = "ROOF_SPACE_INSULATED",

  // Circulation area
  CIRCULATION_INTERNAL_LOW_VENT = "CIRCULATION_INTERNAL_LOW_VENT",
  CIRCULATION_FREELY_VENTILATED = "CIRCULATION_FREELY_VENTILATED",

  // Floor
  FLOOR_ABOVE_CRAWL_SPACE = "FLOOR_ABOVE_CRAWL_SPACE",
}

const F_L_TABLE: Record<UnheatedSpaceType, number> = {
  [UnheatedSpaceType.ROOM_1_EXTERNAL_WALL]: 0.4,
  [UnheatedSpaceType.ROOM_2_EXTERNAL_WALLS_NO_DOOR]: 0.5,
  [UnheatedSpaceType.ROOM_2_EXTERNAL_WALLS_WITH_DOOR]: 0.6,
  [UnheatedSpaceType.ROOM_3_OR_MORE_EXTERNAL_WALLS]: 0.8,

  [UnheatedSpaceType.BASEMENT_NO_OPENINGS]: 0.5,
  [UnheatedSpaceType.BASEMENT_WITH_OPENINGS]: 0.8,

  [UnheatedSpaceType.ROOF_SPACE_HIGH_VENTILATION]: 1.0,
  [UnheatedSpaceType.ROOF_SPACE_NOT_INSULATED]: 0.9,
  [UnheatedSpaceType.ROOF_SPACE_INSULATED]: 0.7,

  [UnheatedSpaceType.CIRCULATION_INTERNAL_LOW_VENT]: 0.0,
  [UnheatedSpaceType.CIRCULATION_FREELY_VENTILATED]: 1.0,

  [UnheatedSpaceType.FLOOR_ABOVE_CRAWL_SPACE]: 0.8,
};

/**
 * Returns the temperature adjustment factor f_l (≡ f_x,k) for the given
 * unheated space type per EN 12831-1 Table B.2.
 */
export function resolveUnheatedFactor(type: UnheatedSpaceType): number {
  return F_L_TABLE[type];
}
