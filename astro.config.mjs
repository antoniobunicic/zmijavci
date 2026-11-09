import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://zmijavci.vreva.hr',
  // Zadržava postojeće adrese stranica (npr. /znamenitosti/zmijavacki-most.html).
  build: { format: 'preserve', inlineStylesheets: 'never' },
  // Bez ugrađenih skripti i podataka, da stroga CSP politika može ostati bez 'unsafe-inline'.
  // Jedan CSS za cijelu stranicu: manje blokirajućih zahtjeva, a preglednik ga pamti između stranica.
  vite: { build: { assetsInlineLimit: 0, cssCodeSplit: false } },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      // Adrese u sitemapu moraju biti iste kao kanonske adrese stranica.
      serialize: (item) => {
        const { pathname } = new URL(item.url);
        const isSectionRoot = pathname === '/en' || pathname === '/en/' || pathname === '/';
        item.url = new URL(isSectionRoot ? pathname.replace(/\/?$/, '/') : `${pathname}.html`, item.url).href;
        return item;
      },
    }),
  ],
  devToolbar: { enabled: false },
});
