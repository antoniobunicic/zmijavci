import type { Localized } from '../i18n/ui';

export interface Trip {
  name: Localized;
  tag: Localized;
  description: Localized;
}

export const tripsCopy: Localized<{ eyebrow: string; title: string; lead: string; map: string }> = {
  hr: {
    eyebrow: 'Ideje za izlete',
    title: 'Izleti u Imotskoj krajini',
    lead: 'Krška jezera, utvrde nad poljem i planina koja se spušta u more — sve na kratkoj vožnji od Zmijavaca.',
    map: 'Karta izleta',
  },
  en: {
    eyebrow: 'Day trips',
    title: 'Day trips around the Imotski region',
    lead: 'Karst lakes, fortresses above the field and a mountain that drops into the sea — all a short drive from Zmijavci.',
    map: 'Day trip map',
  },
};

const NATURE: Localized = { hr: 'Priroda', en: 'Nature' };
const CULTURE: Localized = { hr: 'Kultura', en: 'Culture' };
const ACTIVE: Localized = { hr: 'Aktivno', en: 'Active' };

export const trips: Trip[] = [
  {
    name: { hr: 'Modro jezero', en: 'Blue Lake' },
    tag: NATURE,
    description: {
      hr: 'Krško jezero na rubu Imotskog. Kad ljeti presuši, na njegovu se dnu igra nogomet.',
      en: 'A karst lake on the edge of Imotski. When it dries out in summer, football is played on its bed.',
    },
  },
  {
    name: { hr: 'Crveno jezero', en: 'Red Lake' },
    tag: NATURE,
    description: {
      hr: 'Duboka krška jama strmih crvenkastih stijena, jedna od najdubljih u Europi.',
      en: 'A deep karst sinkhole with steep reddish cliffs, one of the deepest in Europe.',
    },
  },
  {
    name: { hr: 'Tvrđava Topana', en: 'Topana Fortress' },
    tag: CULTURE,
    description: {
      hr: 'Utvrda nad Imotskim s pogledom ravno u Modro jezero i preko cijelog polja.',
      en: 'A fortress above Imotski looking straight down into the Blue Lake and across the whole field.',
    },
  },
  {
    name: { hr: 'Biokovo', en: 'Biokovo' },
    tag: ACTIVE,
    description: {
      hr: 'Park prirode, vidikovac Skywalk i vrh Sveti Jure, s pogledom na otoke.',
      en: 'A nature park with the Skywalk viewpoint and Sveti Jure peak, looking out over the islands.',
    },
  },
  {
    name: { hr: 'Prološko blato', en: 'Prološko blato' },
    tag: NATURE,
    description: {
      hr: 'Močvarni krajolik uz Proložac, utočište ptica i mirnih šetnji.',
      en: 'Wetlands near Proložac, a refuge for birds and quiet walks.',
    },
  },
  {
    name: { hr: 'Rijeka Vrljika', en: 'Vrljika River' },
    tag: ACTIVE,
    description: {
      hr: 'Ponornica koja vijuga Imotskim poljem — za bicikl ili šetnju uz vodu.',
      en: 'A sinking river winding through the Imotski field — for cycling or a walk by the water.',
    },
  },
];
