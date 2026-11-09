import type { ImageMetadata } from 'astro';
import type { Localized } from '../i18n/ui';
import cake from '../assets/images/jelo-imotska-torta.webp';
import wine from '../assets/images/jelo-kujundusa.webp';
import lamb from '../assets/images/jelo-janjetina.webp';
import ham from '../assets/images/jelo-prsut.webp';
import buljan from '../assets/images/gastro-buljan.webp';
import brana from '../assets/images/gastro-brana.webp';
import kodRunje from '../assets/images/gastro-kodrunje.webp';
import traverca from '../assets/images/gastro-traverca.webp';

export interface Dish {
  image: ImageMetadata;
  alt: Localized;
  name: Localized;
  description: Localized;
  imageFocus?: 30;
}

export interface Venue {
  image: ImageMetadata;
  alt: Localized;
  name: Localized;
  address: string;
  mapUrl: string;
}

export const gastronomyCopy: Localized<{
  eyebrow: string;
  title: string;
  lead: string;
  venuesTitle: string;
  map: string;
}> = {
  hr: {
    eyebrow: 'Gastronomija',
    title: 'Okusi Imotske krajine',
    lead: 'Kuhinja zagore je jednostavna i iskrena: ono što daju polje, vinograd i stado, pripremljeno polako, ispod peke ili na otvorenoj vatri.',
    venuesTitle: 'Ugostiteljstvo',
    map: 'Karta',
  },
  en: {
    eyebrow: 'Food & drink',
    title: 'Flavours of the Imotski region',
    lead: 'Hinterland cooking is simple and honest: what the fields, vineyards and flocks provide, cooked slowly under the peka bell or over an open fire.',
    venuesTitle: 'Where to eat',
    map: 'Map',
  },
};

export const dishes: Dish[] = [
  {
    image: cake,
    alt: {
      hr: 'Imotska torta s mrežastim ukrasom od tijesta',
      en: 'Imotska torta with a lattice pastry top',
    },
    name: { hr: 'Imotska torta', en: 'Imotska torta' },
    description: {
      hr: 'Kolač od badema, simbol imotskih slavlja.',
      en: 'An almond cake, the centrepiece of every Imotski celebration.',
    },
  },
  {
    image: wine,
    imageFocus: 30,
    alt: {
      hr: 'Čaša bijelog vina kujundžuše na stolu',
      en: 'A glass of white Kujundžuša wine on a table',
    },
    name: { hr: 'Kujundžuša', en: 'Kujundžuša' },
    description: {
      hr: 'Autohtona bijela sorta Imotskog polja.',
      en: 'An indigenous white grape of the Imotski field.',
    },
  },
  {
    image: lamb,
    alt: {
      hr: 'Pečena janjetina s krumpirom u okrugloj posudi',
      en: 'Roast lamb with potatoes in a round pan',
    },
    name: { hr: 'Janjetina ispod peke', en: 'Lamb under the peka' },
    description: {
      hr: 'Polagano, pod žarom, s krumpirom.',
      en: 'Slow-cooked under embers, with potatoes.',
    },
  },
  {
    image: ham,
    alt: { hr: 'Daska s pršutom, sirom i maslinama', en: 'A board of pršut, cheese and olives' },
    name: { hr: 'Pršut i sir iz mišine', en: 'Pršut and sir iz mišine' },
    description: {
      hr: 'Zagorska klasika za početak objeda.',
      en: 'Cured ham and sheepskin-aged cheese, a hinterland classic.',
    },
  },
];

const mapSearch = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export const venues: Venue[] = [
  {
    image: buljan,
    alt: {
      hr: 'Svečano postavljeni stolovi i domaći kolači u Seoskom domaćinstvu Buljan',
      en: 'Tables set for a meal and homemade pastries at Buljan Farmstead',
    },
    name: { hr: 'Seosko domaćinstvo Buljan', en: 'Buljan Farmstead' },
    address: 'Domovinskog rata 145',
    mapUrl: mapSearch('Seosko domacinstvo izletiste Buljan Zmijavci'),
  },
  {
    image: brana,
    alt: {
      hr: 'Stolovi na terasi Bufeta Brana uz rijeku i branu',
      en: 'Terrace tables by the river and weir at Bufet Brana',
    },
    name: { hr: 'Bufet Brana', en: 'Bufet Brana' },
    address: 'Domovinskog rata 101',
    mapUrl: mapSearch('Bufet Brana Zmijavci'),
  },
  {
    image: kodRunje,
    alt: {
      hr: 'Terasa restorana Kod Runje u hladu velikog stabla',
      en: 'The Kod Runje terrace in the shade of a large tree',
    },
    name: { hr: 'Kod Runje', en: 'Kod Runje' },
    address: 'Domovinskog rata 35',
    mapUrl: mapSearch('Kod Runje Zmijavci'),
  },
  {
    image: traverca,
    alt: {
      hr: 'Blagovaonica Bistroa Traverca s drvenim stolovima',
      en: 'The Bistro Traverca dining room with wooden tables',
    },
    name: { hr: 'Bistro Traverca', en: 'Bistro Traverca' },
    address: 'Dr. Franje Tuđmana 136',
    mapUrl: mapSearch('Bistro Traverca Zmijavci'),
  },
];
