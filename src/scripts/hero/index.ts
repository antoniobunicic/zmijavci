import { createCameraDrift } from './camera-drift';
import { createLocationMap } from './location-map';
import { createShotPlayer } from './shot-player';

const VISIBILITY_THRESHOLD = 0.05;
const IDLE_TIMEOUT_MS = 1500;
const IDLE_FALLBACK_MS = 200;

/** Video kreće tek kad je stranica učitana i preglednik slobodan, da ne koči prvi prikaz. */
function whenPageIsIdle(callback: () => void) {
  const schedule = () => {
    if ('requestIdleCallback' in window) requestIdleCallback(callback, { timeout: IDLE_TIMEOUT_MS });
    else setTimeout(callback, IDLE_FALLBACK_MS);
  };
  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, { once: true });
}

function initHero(hero: HTMLElement, layer: HTMLElement) {
  const locationMap = createLocationMap(hero);
  const player = createShotPlayer({ hero, onShotChange: locationMap.show });
  const camera = createCameraDrift(hero, layer);

  new IntersectionObserver(
    ([entry]) => {
      player.setVisible(entry.isIntersecting);
      if (entry.isIntersecting) camera.start();
      else camera.stop();
    },
    { threshold: VISIBILITY_THRESHOLD },
  ).observe(hero);

  document.addEventListener('visibilitychange', player.handleDocumentVisibility);

  camera.start();
  whenPageIsIdle(player.loadVideos);
}

const hero = document.querySelector<HTMLElement>('[data-hero]');
const layer = hero?.querySelector<HTMLElement>('[data-hero-layer]');
if (hero && layer) initHero(hero, layer);
