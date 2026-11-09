import type { Lang, Localized } from './ui';

export type SectionKey = 'intro' | 'landmarks' | 'events' | 'stay' | 'food' | 'trips';
export type NavSection = Exclude<SectionKey, 'landmarks'>;

/** Sidra sekcija na naslovnici. Hrvatska i engleska verzija imaju različite adrese. */
const sectionIds: Record<SectionKey, Localized> = {
  intro: { hr: 'uvod', en: 'welcome' },
  landmarks: { hr: 'znamenitosti', en: 'landmarks' },
  events: { hr: 'dogadanja', en: 'events' },
  stay: { hr: 'smjestaj', en: 'stay' },
  food: { hr: 'gastronomija', en: 'food' },
  trips: { hr: 'izleti', en: 'day-trips' },
};

const navLabels: Record<NavSection, Localized> = {
  intro: { hr: 'Znamenitosti', en: 'Landmarks' },
  events: { hr: 'Događanja', en: 'Events' },
  stay: { hr: 'Smještaj', en: 'Stay' },
  food: { hr: 'Gastronomija', en: 'Food & drink' },
  trips: { hr: 'Izleti', en: 'Day trips' },
};

export const navOrder: NavSection[] = ['intro', 'events', 'stay', 'food', 'trips'];

export const navLabel = (section: NavSection, lang: Lang) => navLabels[section][lang];
export const sectionId = (section: SectionKey, lang: Lang) => sectionIds[section][lang];

export const homePath = (lang: Lang) => (lang === 'hr' ? '/' : '/en/');

/** Na naslovnici je dovoljno sidro, a s ostalih stranica vodi se na naslovnicu. */
export const sectionHref = (section: SectionKey, lang: Lang, onHome = false) =>
  `${onHome ? '' : homePath(lang)}#${sectionId(section, lang)}`;

export const landmarkPath = (slugs: Localized, lang: Lang) =>
  lang === 'hr' ? `/znamenitosti/${slugs.hr}.html` : `/en/landmarks/${slugs.en}.html`;

export const eventPath = (slugs: Localized, lang: Lang) =>
  lang === 'hr' ? `/dogadanja/${slugs.hr}.html` : `/en/events/${slugs.en}.html`;
