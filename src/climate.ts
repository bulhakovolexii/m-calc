/**
 * Design external temperature θ_e for Ukrainian cities.
 * Source: ДСТУ-Н Б В.1.1-27:2010 (temperature of the coldest five-day period).
 */

export enum UkrainianCity {
  // Автономна Республіка Крим
  AY_PETRI = "Ай-Петрі",
  KLEPYNINE = "Клепиніне",
  SIMFEROPOL = "Сімферополь",
  FEODOSIA = "Феодосія",
  YALTA = "Ялта",
  // Вінницька область
  VINNYTSIA = "Вінниця",
  // Волинська область
  KOVEL = "Ковель",
  LUTSK = "Луцьк",
  // Дніпропетровська область
  DNIPRO = "Дніпро",
  KOMISARIVKA = "Комісарівка",
  KRYVYI_RIH = "Кривий Ріг",
  // Донецька область
  DONETSK = "Донецьк",
  // Житомирська область
  ZHYTOMYR = "Житомир",
  OVRUCH = "Овруч",
  // Закарпатська область
  BEREHOVE = "Берегове",
  MIZHGIRYA = "Міжгір'я",
  PLAY = "Плай",
  RAKHIV = "Рахів",
  UZHHOROD = "Ужгород",
  KHUST = "Хуст",
  // Запорізька область
  HULYAIPOLE = "Гуляйполе",
  ZAPORIZHZHIA = "Запоріжжя",
  KYRYLIVKA = "Кирилівка",
  // Івано-Франківська область
  IVANO_FRANKIVSK = "Івано-Франківськ",
  POZHEZHIVSKA = "Пожежівська",
  // Кіровоградська область
  HAIVORON = "Гайворон",
  ZNAMIANKA = "Знам'янка",
  KROPYVNYTSKYI = "Кропивницький",
  // Київська область
  KYIV = "Київ",
  MYRONIVKA = "Миронівка",
  // Луганська область
  LUHANSK = "Луганськ",
  // Львівська область
  LVIV = "Львів",
  // Миколаївська область
  MYKOLAIV = "Миколаїв",
  // Одеська область
  IZMAIL = "Ізмаїл",
  LIUBASHIVKA = "Любашівка",
  ODESA = "Одеса",
  ROZDILNA = "Роздільна",
  SARATA = "Сарата",
  // Полтавська область
  LUBNY = "Лубни",
  POLTAVA = "Полтава",
  // Рівненська область
  RIVNE = "Рівне",
  SARNY = "Сарни",
  // Сумська область
  ROMNY = "Ромни",
  SUMY = "Суми",
  // Тернопільська область
  TERNOPIL = "Тернопіль",
  // Харківська область
  LOZOVA = "Лозова",
  KHARKIV = "Харків",
  // Херсонська область
  ASKANIA_NOVA = "Асканія-Нова",
  HENICHESK = "Генічеськ",
  KHERSON = "Херсон",
  // Хмельницька область
  KHMELNYTSKYI = "Хмельницький",
  // Черкаська область
  ZOLOTONOSHA = "Золотоноша",
  UMAN = "Умань",
  CHERKASY = "Черкаси",
  // Чернівецька область
  CHERNIVTSI = "Чернівці",
  // Чернігівська область
  SEMENIVKA = "Семенівка",
  CHERNIHIV = "Чернігів",
}

/**
 * Design external temperature θ_e [°C] per city.
 * null = not yet filled in. Source: ДСТУ-Н Б В.1.1-27:2010, column "t_н5" (найхолодніша п'ятиденка).
 */
const DESIGN_TEMPERATURES: Record<UkrainianCity, number | null> = {
  // Автономна Республіка Крим
  [UkrainianCity.AY_PETRI]: -18,
  [UkrainianCity.KLEPYNINE]: -21,
  [UkrainianCity.SIMFEROPOL]: -15,
  [UkrainianCity.FEODOSIA]: -15,
  [UkrainianCity.YALTA]: -6,
  // Вінницька область
  [UkrainianCity.VINNYTSIA]: -21,
  // Волинська область
  [UkrainianCity.KOVEL]: -21,
  [UkrainianCity.LUTSK]: -20,
  // Дніпропетровська область
  [UkrainianCity.DNIPRO]: -24,
  [UkrainianCity.KOMISARIVKA]: -20,
  [UkrainianCity.KRYVYI_RIH]: -17,
  // Донецька область
  [UkrainianCity.DONETSK]: -22,
  // Житомирська область
  [UkrainianCity.ZHYTOMYR]: -22,
  [UkrainianCity.OVRUCH]: -21,
  // Закарпатська область
  [UkrainianCity.BEREHOVE]: -15,
  [UkrainianCity.MIZHGIRYA]: -15,
  [UkrainianCity.PLAY]: -20,
  [UkrainianCity.RAKHIV]: -15,
  [UkrainianCity.UZHHOROD]: -18,
  [UkrainianCity.KHUST]: -16,
  // Запорізька область
  [UkrainianCity.HULYAIPOLE]: -21,
  [UkrainianCity.ZAPORIZHZHIA]: -21,
  [UkrainianCity.KYRYLIVKA]: -22,
  // Івано-Франківська область
  [UkrainianCity.IVANO_FRANKIVSK]: -20,
  [UkrainianCity.POZHEZHIVSKA]: -20,
  // Кіровоградська область
  [UkrainianCity.HAIVORON]: -22,
  [UkrainianCity.ZNAMIANKA]: -22,
  [UkrainianCity.KROPYVNYTSKYI]: -22,
  // Київська область
  [UkrainianCity.KYIV]: -22,
  [UkrainianCity.MYRONIVKA]: -22,
  // Луганська область
  [UkrainianCity.LUHANSK]: -25,
  // Львівська область
  [UkrainianCity.LVIV]: -19,
  // Миколаївська область
  [UkrainianCity.MYKOLAIV]: -20,
  // Одеська область
  [UkrainianCity.IZMAIL]: -15,
  [UkrainianCity.LIUBASHIVKA]: -19,
  [UkrainianCity.ODESA]: -18,
  [UkrainianCity.ROZDILNA]: -17,
  [UkrainianCity.SARATA]: -20,
  // Полтавська область
  [UkrainianCity.LUBNY]: -23,
  [UkrainianCity.POLTAVA]: -23,
  // Рівненська область
  [UkrainianCity.RIVNE]: -21,
  [UkrainianCity.SARNY]: -21,
  // Сумська область
  [UkrainianCity.ROMNY]: -23,
  [UkrainianCity.SUMY]: -25,
  // Тернопільська область
  [UkrainianCity.TERNOPIL]: -20,
  // Харківська область
  [UkrainianCity.LOZOVA]: -22,
  [UkrainianCity.KHARKIV]: -23,
  // Херсонська область
  [UkrainianCity.ASKANIA_NOVA]: -20,
  [UkrainianCity.HENICHESK]: -19,
  [UkrainianCity.KHERSON]: -19,
  // Хмельницька область
  [UkrainianCity.KHMELNYTSKYI]: -21,
  // Черкаська область
  [UkrainianCity.ZOLOTONOSHA]: -21,
  [UkrainianCity.UMAN]: -20,
  [UkrainianCity.CHERKASY]: -21,
  // Чернівецька область
  [UkrainianCity.CHERNIVTSI]: -20,
  // Чернігівська область
  [UkrainianCity.SEMENIVKA]: -24,
  [UkrainianCity.CHERNIHIV]: -23,
};

export interface ClimateRegion {
  region: string;
  cities: UkrainianCity[];
}

/** Regions with their climate stations, ordered as in ДСТУ-Н Б В.1.1-27:2010. */
export const CLIMATE_REGIONS: ClimateRegion[] = [
  {
    region: "Автономна Республіка Крим",
    cities: [
      UkrainianCity.AY_PETRI,
      UkrainianCity.KLEPYNINE,
      UkrainianCity.SIMFEROPOL,
      UkrainianCity.FEODOSIA,
      UkrainianCity.YALTA,
    ],
  },
  {
    region: "Вінницька область",
    cities: [UkrainianCity.VINNYTSIA],
  },
  {
    region: "Волинська область",
    cities: [UkrainianCity.KOVEL, UkrainianCity.LUTSK],
  },
  {
    region: "Дніпропетровська область",
    cities: [
      UkrainianCity.DNIPRO,
      UkrainianCity.KOMISARIVKA,
      UkrainianCity.KRYVYI_RIH,
    ],
  },
  {
    region: "Донецька область",
    cities: [UkrainianCity.DONETSK],
  },
  {
    region: "Житомирська область",
    cities: [UkrainianCity.ZHYTOMYR, UkrainianCity.OVRUCH],
  },
  {
    region: "Закарпатська область",
    cities: [
      UkrainianCity.BEREHOVE,
      UkrainianCity.MIZHGIRYA,
      UkrainianCity.PLAY,
      UkrainianCity.RAKHIV,
      UkrainianCity.UZHHOROD,
      UkrainianCity.KHUST,
    ],
  },
  {
    region: "Запорізька область",
    cities: [
      UkrainianCity.HULYAIPOLE,
      UkrainianCity.ZAPORIZHZHIA,
      UkrainianCity.KYRYLIVKA,
    ],
  },
  {
    region: "Івано-Франківська область",
    cities: [UkrainianCity.IVANO_FRANKIVSK, UkrainianCity.POZHEZHIVSKA],
  },
  {
    region: "Кіровоградська область",
    cities: [
      UkrainianCity.HAIVORON,
      UkrainianCity.ZNAMIANKA,
      UkrainianCity.KROPYVNYTSKYI,
    ],
  },
  {
    region: "Київська область",
    cities: [UkrainianCity.KYIV, UkrainianCity.MYRONIVKA],
  },
  {
    region: "Луганська область",
    cities: [UkrainianCity.LUHANSK],
  },
  {
    region: "Львівська область",
    cities: [UkrainianCity.LVIV],
  },
  {
    region: "Миколаївська область",
    cities: [UkrainianCity.MYKOLAIV],
  },
  {
    region: "Одеська область",
    cities: [
      UkrainianCity.IZMAIL,
      UkrainianCity.LIUBASHIVKA,
      UkrainianCity.ODESA,
      UkrainianCity.ROZDILNA,
      UkrainianCity.SARATA,
    ],
  },
  {
    region: "Полтавська область",
    cities: [UkrainianCity.LUBNY, UkrainianCity.POLTAVA],
  },
  {
    region: "Рівненська область",
    cities: [UkrainianCity.RIVNE, UkrainianCity.SARNY],
  },
  {
    region: "Сумська область",
    cities: [UkrainianCity.ROMNY, UkrainianCity.SUMY],
  },
  {
    region: "Тернопільська область",
    cities: [UkrainianCity.TERNOPIL],
  },
  {
    region: "Харківська область",
    cities: [UkrainianCity.LOZOVA, UkrainianCity.KHARKIV],
  },
  {
    region: "Херсонська область",
    cities: [
      UkrainianCity.ASKANIA_NOVA,
      UkrainianCity.HENICHESK,
      UkrainianCity.KHERSON,
    ],
  },
  {
    region: "Хмельницька область",
    cities: [UkrainianCity.KHMELNYTSKYI],
  },
  {
    region: "Черкаська область",
    cities: [
      UkrainianCity.ZOLOTONOSHA,
      UkrainianCity.UMAN,
      UkrainianCity.CHERKASY,
    ],
  },
  {
    region: "Чернівецька область",
    cities: [UkrainianCity.CHERNIVTSI],
  },
  {
    region: "Чернігівська область",
    cities: [UkrainianCity.SEMENIVKA, UkrainianCity.CHERNIHIV],
  },
];

/** Returns θ_e [°C] for the given city, or null when the value has not been filled in yet. */
export function getDesignTemperature(city: UkrainianCity): number | null {
  return DESIGN_TEMPERATURES[city];
}
