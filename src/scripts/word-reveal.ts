/*
 * Numerira riječi odlomka za animaciju u motion.css (svaka riječ tamni u svom dijelu scrolla).
 * Brojevi se postavljaju ovdje jer CSP ne dopušta style atribute u HTML-u.
 */
for (const paragraph of document.querySelectorAll<HTMLElement>('[data-word-reveal]')) {
  const words = paragraph.querySelectorAll<HTMLElement>('.intro__word');
  paragraph.style.setProperty('--words', String(words.length));
  words.forEach((word, index) => word.style.setProperty('--i', String(index)));
}
