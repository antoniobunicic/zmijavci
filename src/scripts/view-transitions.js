/*
 * Prijelazi između stranica: fotografija kartice „preleti” u naslovnu fotografiju podstranice
 * i natrag. Kartice i naslovne fotografije imaju data-vt-photo s putanjom podstranice; ime
 * prijelaza dobiva samo par koji sudjeluje u ovoj navigaciji, jer imena moraju biti jedinstvena.
 *
 * Klasična skripta u <head>: pagereveal se mora prijaviti prije prvog iscrtavanja stranice.
 */
(() => {
  if (!('onpagereveal' in window)) return;

  const NAME = 'vt-photo';
  const STORAGE_KEY = 'vt-photo';

  const pathOf = (url) => new URL(url, location.href).pathname;
  const find = (key) => (key ? document.querySelector(`[data-vt-photo="${CSS.escape(key)}"]`) : null);
  const clear = () => {
    for (const el of document.querySelectorAll('[data-vt-photo]')) el.style.removeProperty('view-transition-name');
  };
  /** Fotografija izvan prozora (npr. kartica odscrollana u karuselu) ne bi trebala letjeti s ruba ekrana. */
  const isOnScreen = (el) => {
    const rect = el.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth;
  };
  const storage = {
    get() {
      try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? 'null'); } catch { return null; }
    },
    set(value) {
      try {
        if (value) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
        else sessionStorage.removeItem(STORAGE_KEY);
      } catch { /* bez spremišta nema ni para, samo obični prijelaz */ }
    },
  };

  /**
   * Fotografija iz kartice ostaje kao podloga okvira dok se veća naslovna fotografija ne učita,
   * pa nakon leta nema praznog okvira, nego mekša slika koju zatim prekrije oštra.
   */
  const showWhileLoading = (el, img, src) => {
    if (!src || new URL(src, location.href).origin !== location.origin) return;
    el.style.backgroundImage = `url(${JSON.stringify(src)})`;
    el.style.backgroundSize = 'cover';
    el.style.backgroundPosition = getComputedStyle(img).objectPosition;
  };

  addEventListener('pageswap', (event) => {
    clear();
    storage.set(null);
    const destination = event.activation?.entry?.url;
    if (!event.viewTransition || !destination) return;
    // Kartica koja vodi na odredište, a ako je nema, naslovna fotografija ove stranice
    // (povratak s podstranice na popis).
    const to = pathOf(destination);
    const here = pathOf(location.href);
    const key = find(to) ? to : find(here) ? here : null;
    const el = find(key);
    if (!el || !isOnScreen(el)) return;
    el.style.viewTransitionName = NAME;
    storage.set({ key, src: el.querySelector('img')?.currentSrc });
  });

  addEventListener('pagereveal', (event) => {
    clear();
    const saved = storage.get();
    storage.set(null);
    if (!event.viewTransition || !saved) return;
    const el = find(saved.key);
    if (!el || !isOnScreen(el)) return;
    el.style.viewTransitionName = NAME;
    const img = el.querySelector('img');
    if (img && !img.complete) {
      // Leti stara fotografija (vidi motion.css), a na mjestu je čeka ista kao podloga.
      event.viewTransition.types?.add('photo-loading');
      showWhileLoading(el, img, saved.src);
    }
    event.viewTransition.finished.finally(clear);
  });
})();
