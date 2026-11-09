import type { Localized } from '../i18n/ui';

export interface HeroShot {
  video: string;
  name: Localized;
  /** Položaj na obrisu općine, u postocima. */
  dot: { x: number; y: number };
}

export const heroCopy: Localized<{
  h1: string;
  regionLabel: string;
  posterAlt: string;
  nowShowing: string;
  shotLabel: (current: number, total: number) => string;
  nextShot: string;
  mapAlt: string;
}> = {
  hr: {
    h1: 'Zmijavci — turistički vodič kroz Imotsku krajinu',
    regionLabel: 'Zmijavci iz zraka',
    posterAlt: 'Ranokršćanska bazilika u Zmijavcima iz zraka',
    nowShowing: 'Trenutno u kadru',
    shotLabel: (current, total) => `Kadar ${current} od ${total}`,
    nextShot: 'Sljedeći kadar',
    mapAlt: 'Obris općine Zmijavci',
  },
  en: {
    h1: 'Zmijavci — travel guide to the Imotski region',
    regionLabel: 'Zmijavci from above',
    posterAlt: 'The Early Christian basilica in Zmijavci from above',
    nowShowing: 'Now on screen',
    shotLabel: (current, total) => `Shot ${current} of ${total}`,
    nextShot: 'Next shot',
    mapAlt: 'Outline of the Municipality of Zmijavci',
  },
};

const GRADINA: Localized = { hr: 'Todorića gradina', en: 'Todorića gradina' };
const GRADINA_DOT = { x: 30, y: 82 };

export const heroShots: HeroShot[] = [
  {
    video: 'bazilika',
    name: { hr: 'Ranokršćanska bazilika', en: 'Early Christian Basilica' },
    dot: { x: 46, y: 30 },
  },
  { video: 'zmijavacki-most', name: { hr: 'Zmijavački most', en: 'Zmijavci Bridge' }, dot: { x: 58, y: 26 } },
  { video: 'kriz-uspon', name: GRADINA, dot: GRADINA_DOT },
  { video: 'kriz', name: GRADINA, dot: GRADINA_DOT },
  { video: 'crkva', name: { hr: 'Crkva Svih svetih', en: 'All Saints Church' }, dot: { x: 44, y: 46 } },
  { video: 'advent', name: { hr: 'Advent u Zmijavcima', en: 'Advent in Zmijavci' }, dot: { x: 39, y: 40 } },
];
