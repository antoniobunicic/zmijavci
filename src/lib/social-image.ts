import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

/** Slika za društvene mreže i tražilice, u formatu 1200 × 630 s punom adresom. */
export async function socialImageUrl(source: ImageMetadata, site: URL): Promise<string> {
  const image = await getImage({ src: source, width: 1200, height: 630, format: 'jpg', fit: 'cover' });
  return new URL(image.src, site).href;
}
