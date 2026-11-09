import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const localizedSlugs = z.object({ hr: z.string(), en: z.string() });
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const clock = z.string().regex(/^\d{2}:\d{2}$/);

const landmarkText = z.object({
  name: z.string(),
  category: z.string(),
  summary: z.string(),
  lead: z.string(),
  imageAlt: z.string().optional(),
  facts: z.array(z.object({ label: z.string(), value: z.string() })),
  body: z.array(z.string()).min(1),
  panorama: z
    .object({ heading: z.string(), frameTitle: z.string(), caption: z.string() })
    .optional(),
});

const landmarks = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/landmarks' }),
  schema: ({ image }) =>
    z.object({
      order: z.number().int(),
      slugs: localizedSlugs,
      image: image().optional(),
      imageFocus: z.union([z.literal(62), z.literal(75)]).optional(),
      panoramaUrl: z.url().optional(),
      hr: landmarkText,
      en: landmarkText,
    }),
});

const eventText = z.object({
  title: z.string(),
  /** Duži naslov za karticu preglednika, kad se razlikuje od naslova na stranici. */
  pageTitle: z.string().optional(),
  breadcrumb: z.string(),
  category: z.string(),
  place: z.string(),
  time: z.string().optional(),
  summary: z.string(),
  lead: z.string(),
  description: z.string(),
  imageAlt: z.string(),
  readMoreLabel: z.string(),
  sections: z.array(
    z.object({
      heading: z.string(),
      paragraphs: z.array(z.string()),
      placeholder: z.string().optional(),
    }),
  ),
  award: z
    .object({ imageAlt: z.string(), eyebrow: z.string(), title: z.string(), text: z.string() })
    .optional(),
});

const events = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/events' }),
  schema: ({ image }) =>
    z.object({
      order: z.number().int(),
      slugs: localizedSlugs,
      start: isoDate,
      end: isoDate.optional(),
      startTime: clock.optional(),
      endTime: clock.optional(),
      image: image(),
      awardImage: image().optional(),
      gallery: z
        .array(z.object({ image: image(), alt: z.object({ hr: z.string(), en: z.string() }) }))
        .optional(),
      hr: eventText,
      en: eventText,
    }),
});

export const collections = { landmarks, events };
