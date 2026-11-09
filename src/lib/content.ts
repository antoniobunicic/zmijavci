import { getCollection, type CollectionEntry } from 'astro:content';

export type Landmark = CollectionEntry<'landmarks'>;
export type EventEntry = CollectionEntry<'events'>;

const byOrder = <T extends { data: { order: number } }>(a: T, b: T) => a.data.order - b.data.order;

export const getLandmarks = async () => (await getCollection('landmarks')).sort(byOrder);
export const getEvents = async () => (await getCollection('events')).sort(byOrder);

/** Sljedeće dvije znamenitosti u krug, za blok "Još znamenitosti". */
export function nextLandmarks(all: Landmark[], current: Landmark, count = 2): Landmark[] {
  const index = all.findIndex((entry) => entry.id === current.id);
  return Array.from({ length: count }, (_, step) => all[(index + step + 1) % all.length]);
}

export const otherEvents = (all: EventEntry[], current: EventEntry) =>
  all.filter((entry) => entry.id !== current.id);
