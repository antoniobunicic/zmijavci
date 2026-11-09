import type { Lang } from '../i18n/ui';
import { ui } from '../i18n/ui';
import { toZonedIso } from './dates';
import type { EventEntry, Landmark } from './content';

export type JsonLd = Record<string, unknown>;

const CONTEXT = 'https://schema.org';
const PUBLISHER = { '@type': 'GovernmentOrganization', name: 'Općina Zmijavci' };
const ZMIJAVCI_ADDRESS = {
  '@type': 'PostalAddress',
  addressLocality: 'Zmijavci',
  addressCountry: 'HR',
};

export const websiteSchema = (lang: Lang, url: string): JsonLd => ({
  '@context': CONTEXT,
  '@type': 'WebSite',
  name: ui[lang].siteName,
  url,
  inLanguage: lang,
  publisher: PUBLISHER,
});

export const destinationSchema = (lang: Lang, url: string, image: string): JsonLd => ({
  '@context': CONTEXT,
  '@type': 'TouristDestination',
  name: 'Zmijavci',
  description: ui[lang].homeDescription,
  url,
  image,
  address: ZMIJAVCI_ADDRESS,
});

export const landmarkSchema = (
  landmark: Landmark,
  lang: Lang,
  url: string,
  image?: string,
): JsonLd => ({
  '@context': CONTEXT,
  '@type': 'TouristAttraction',
  name: landmark.data[lang].name,
  description: landmark.data[lang].lead,
  url,
  ...(image && { image }),
  address: ZMIJAVCI_ADDRESS,
});

export function eventSchema(event: EventEntry, lang: Lang, url: string, image: string): JsonLd {
  const { start, end, startTime, endTime } = event.data;
  const text = event.data[lang];
  return {
    '@context': CONTEXT,
    '@type': 'Event',
    name: text.title,
    description: text.description,
    url,
    image,
    startDate: toZonedIso(start, startTime),
    endDate: toZonedIso(end ?? start, endTime),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: { '@type': 'Place', name: text.place, address: ZMIJAVCI_ADDRESS },
    organizer: PUBLISHER,
  };
}

export const breadcrumbSchema = (items: { name: string; url: string }[]): JsonLd => ({
  '@context': CONTEXT,
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});
