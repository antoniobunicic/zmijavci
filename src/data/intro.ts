import type { Localized } from '../i18n/ui';

export const introCopy: Localized<{
  eyebrow: string;
  lead: string;
  landmarksTitle: string;
  previous: string;
  next: string;
}> = {
  hr: {
    eyebrow: 'Dobro došli',
    lead: 'Zmijavci čuvaju jedinstvenu priču o prostoru, povijesti i baštini. Od ranokršćanske bazilike i srednjovjekovnih stećaka do kamenih mostova i mlinica na Vrljici.',
    landmarksTitle: 'Znamenitosti u Zmijavcima',
    previous: 'Prethodna znamenitost',
    next: 'Sljedeća znamenitost',
  },
  en: {
    eyebrow: 'Welcome',
    lead: 'Zmijavci holds a unique story of landscape, history and heritage. From an Early Christian basilica and medieval stećci to stone bridges and watermills on the Vrljika.',
    landmarksTitle: 'Landmarks in Zmijavci',
    previous: 'Previous landmark',
    next: 'Next landmark',
  },
};

export const eventsCopy: Localized<{ eyebrow: string; title: string; calendar: string }> = {
  hr: { eyebrow: 'Događanja', title: 'Zmijavci kroz godinu', calendar: 'Kalendar događanja' },
  en: { eyebrow: 'Events', title: 'Zmijavci through the year', calendar: 'Events calendar' },
};
