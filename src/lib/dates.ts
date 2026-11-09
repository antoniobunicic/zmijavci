import type { Lang } from '../i18n/ui';

export interface DateRange {
  start: string;
  end?: string;
}

const LOCALES: Record<Lang, string> = { hr: 'hr-HR', en: 'en-GB' };
const RANGE_SEPARATOR = ' – ';

const format = (iso: string, lang: Lang, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(LOCALES[lang], { timeZone: 'UTC', ...options }).format(
    new Date(`${iso}T00:00:00Z`),
  );

const days = ({ start, end }: DateRange) => (end ? [start, end] : [start]);

/** "19. 12. 2026." bez vodećih nula, koje Intl dodaje za hrvatski. */
function numericCroatian(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return `${day}. ${month}. ${year}.`;
}

/** Puni zapis, npr. "19. prosinca 2026. – 3. siječnja 2027." */
export const formatLong = (range: DateRange, lang: Lang) =>
  days(range)
    .map((iso) => format(iso, lang, { day: 'numeric', month: 'long', year: 'numeric' }))
    .join(RANGE_SEPARATOR);

/** Zapis u bloku s podacima: brojčani na hrvatskom, sa skraćenim mjesecima za engleski raspon. */
export function formatFact(range: DateRange, lang: Lang): string {
  if (lang === 'en' && !range.end) return formatLong(range, lang);
  return days(range)
    .map((iso) =>
      lang === 'hr'
        ? numericCroatian(iso)
        : format(iso, lang, { day: 'numeric', month: 'short', year: 'numeric' }),
    )
    .join(RANGE_SEPARATOR);
}

/** Dijelovi datuma za velike brojeve u kalendaru. */
export const dateParts = (range: DateRange, lang: Lang) =>
  days(range).map((iso) => ({
    day: format(iso, lang, { day: 'numeric' }).replace('.', ''),
    month: format(iso, lang, { month: 'short' }).toLowerCase().slice(0, 3),
    year: iso.slice(0, 4),
  }));

/** Datum i dan u tjednu u programu, npr. "18. 12." i "petak"; na engleskom "18 Dec" zbog nedvosmislenosti. */
export function programmeDate(iso: string, lang: Lang) {
  const [, month, day] = iso.split('-');
  return {
    date: lang === 'hr' ? `${day}. ${month}.` : format(iso, lang, { day: 'numeric', month: 'short' }),
    weekday: format(iso, lang, { weekday: 'long' }),
  };
}

/** ISO 8601 s vremenskom zonom Zmijavaca, za strukturirane podatke. */
export function toZonedIso(date: string, time?: string): string {
  if (!time) return date;
  const offset = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Zagreb',
    timeZoneName: 'longOffset',
  })
    .formatToParts(new Date(`${date}T${time}:00Z`))
    .find((part) => part.type === 'timeZoneName')
    ?.value.replace('GMT', '');
  return `${date}T${time}:00${offset ?? ''}`;
}
