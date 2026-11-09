import type { ImageMetadata } from 'astro';
import type { Localized } from '../i18n/ui';
import villaMilla from '../assets/images/villa-milla.webp';
import villaIvana from '../assets/images/villa-ivana.webp';
import hacienda from '../assets/images/hacienda-luica-dvori.webp';
import modernVilla from '../assets/images/moderna-vila.webp';

export interface Stay {
  image: ImageMetadata;
  alt: Localized;
  name: Localized;
  url: Localized;
  meta: Localized;
  price: Localized;
}

export const staysCopy: Localized<{
  eyebrow: string;
  title: string;
  lead: string;
  browseAll: string;
  priceFrom: string;
  perNight: string;
}> = {
  hr: {
    eyebrow: 'Smještaj',
    title: 'Odmor u ritmu zagore',
    lead: 'Kamene kuće s bazenom, mirne vile i obiteljski apartmani — privatnost i tišina zagore, a more je s druge strane Biokova.',
    browseAll: 'Pregledaj sav smještaj',
    priceFrom: 'od',
    perNight: '/ noć',
  },
  en: {
    eyebrow: 'Stay',
    title: 'At the pace of the hinterland',
    lead: 'Stone houses with pools, quiet villas and family apartments — the privacy and calm of the Dalmatian hinterland, with the sea just beyond Biokovo.',
    browseAll: 'See all accommodation',
    priceFrom: 'from',
    perNight: '/ night',
  },
};

export const stays: Stay[] = [
  {
    image: villaMilla,
    alt: {
      hr: 'Villa Milla, kamena kuća s bazenom u Zmijavcima',
      en: 'Villa Milla, a stone house with a pool in Zmijavci',
    },
    name: { hr: 'Villa Milla', en: 'Villa Milla' },
    url: {
      hr: 'https://www.novasol.hr/smjestaj/makarska-zmijavci-csc481',
      en: 'https://www.novasol.hr/smjestaj/makarska-zmijavci-csc481',
    },
    meta: { hr: '6 gostiju · 3 sobe · bazen', en: '6 guests · 3 bedrooms · pool' },
    price: { hr: '235 €', en: '€235' },
  },
  {
    image: villaIvana,
    alt: { hr: 'Villa Ivana s bazenom u Zmijavcima', en: 'Villa Ivana with a pool in Zmijavci' },
    name: { hr: 'Villa Ivana', en: 'Villa Ivana' },
    url: { hr: 'https://hr.airbnb.com/rooms/43777790', en: 'https://www.airbnb.com/rooms/43777790' },
    meta: { hr: '10 gostiju · 4 sobe · bazen', en: '10 guests · 4 bedrooms · pool' },
    price: { hr: '142 €', en: '€142' },
  },
  {
    image: hacienda,
    alt: {
      hr: 'Kameno imanje Hacienda Luića Dvori s bazenom, snimljeno iz zraka',
      en: 'The Hacienda Luića Dvori stone estate with a pool, seen from above',
    },
    name: { hr: 'Hacienda Luića Dvori', en: 'Hacienda Luića Dvori' },
    url: { hr: 'https://hr.airbnb.com/rooms/9325461', en: 'https://www.airbnb.com/rooms/9325461' },
    meta: { hr: '16+ gostiju · 10 soba · bazen', en: '16+ guests · 10 bedrooms · pool' },
    price: { hr: '1.150 €', en: '€1,150' },
  },
  {
    image: modernVilla,
    alt: {
      hr: 'Moderna bijela vila s bazenom u Zmijavcima, snimljena iz zraka',
      en: 'A modern white villa with a pool in Zmijavci, seen from above',
    },
    name: { hr: 'Moderna vila s bazenom', en: 'Modern villa with pool' },
    url: {
      hr: 'https://www.booking.com/hotel/hr/modern-and-luxurious-villa-with-swimming-pool-in-zmijavci.hr.html',
      en: 'https://www.booking.com/hotel/hr/modern-and-luxurious-villa-with-swimming-pool-in-zmijavci.html',
    },
    meta: { hr: '12 gostiju · bazen', en: '12 guests · pool' },
    price: { hr: '684 €', en: '€684' },
  },
];
