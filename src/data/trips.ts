import type { ImageMetadata } from 'astro';
import type { Localized } from '../i18n/ui';
import blueLake from '../assets/images/izlet-modro-jezero.jpg';
import redLake from '../assets/images/izlet-crveno-jezero.jpg';
import topana from '../assets/images/izlet-topana.jpg';
import biokovo from '../assets/images/izlet-biokovo.jpg';
import prolozacWetlands from '../assets/images/izlet-prolosko-blato.jpg';
import vrljika from '../assets/images/izlet-vrljika.jpg';

export interface Trip {
  image: { src: ImageMetadata; alt: Localized };
  name: Localized;
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

export const trips: Trip[] = [
  {
    image: {
      src: blueLake,
      alt: {
        hr: 'Modro jezero iz zraka, s tirkiznom vodom ispod kamenih litica Imotskog',
        en: 'The Blue Lake from above, its turquoise water below the cliffs of Imotski',
      },
    },
    name: { hr: 'Modro jezero', en: 'Blue Lake' },
    description: {
      hr: 'Krško jezero na rubu Imotskog. Kad ljeti presuši, na njegovu se dnu igra nogomet.',
      en: 'A karst lake on the edge of Imotski. When it dries out in summer, football is played on its bed.',
    },
  },
  {
    image: {
      src: redLake,
      alt: {
        hr: 'Crveno jezero, duboka krška jama strmih crvenkastih stijena',
        en: 'The Red Lake, a deep karst sinkhole with steep reddish cliffs',
      },
    },
    name: { hr: 'Crveno jezero', en: 'Red Lake' },
    description: {
      hr: 'Duboka krška jama strmih crvenkastih stijena, jedna od najdubljih u Europi.',
      en: 'A deep karst sinkhole with steep reddish cliffs, one of the deepest in Europe.',
    },
  },
  {
    image: {
      src: topana,
      alt: {
        hr: 'Ostaci tvrđave Topana nad Imotskim poljem',
        en: 'The ruins of Topana Fortress above the Imotski field',
      },
    },
    name: { hr: 'Tvrđava Topana', en: 'Topana Fortress' },
    description: {
      hr: 'Utvrda nad Imotskim s pogledom ravno u Modro jezero i preko cijelog polja.',
      en: 'A fortress above Imotski looking straight down into the Blue Lake and across the whole field.',
    },
  },
  {
    image: {
      src: biokovo,
      alt: {
        hr: 'Konji na kamenitom putu ispod litica Biokova',
        en: 'Horses on a stony path below the cliffs of Biokovo',
      },
    },
    name: { hr: 'Biokovo', en: 'Biokovo' },
    description: {
      hr: 'Park prirode, vidikovac Skywalk i vrh Sveti Jure, s pogledom na otoke.',
      en: 'A nature park with the Skywalk viewpoint and Sveti Jure peak, looking out over the islands.',
    },
  },
  {
    image: {
      src: prolozacWetlands,
      alt: {
        hr: 'Prološko blato iz zraka, s vodom koja vijuga kroz zeleno polje',
        en: 'Prološko blato from above, with water winding through green fields',
      },
    },
    name: { hr: 'Prološko blato', en: 'Prološko blato' },
    description: {
      hr: 'Močvarni krajolik uz Proložac, utočište ptica i mirnih šetnji.',
      en: 'Wetlands near Proložac, a refuge for birds and quiet walks.',
    },
  },
  {
    image: {
      src: vrljika,
      alt: {
        hr: 'Kajakaši na rijeci Vrljici u hladu vrba',
        en: 'Kayakers on the Vrljika River in the shade of willows',
      },
    },
    name: { hr: 'Rijeka Vrljika', en: 'Vrljika River' },
    description: {
      hr: 'Ponornica koja vijuga Imotskim poljem — za bicikl ili šetnju uz vodu.',
      en: 'A sinking river winding through the Imotski field — for cycling or a walk by the water.',
    },
  },
];
