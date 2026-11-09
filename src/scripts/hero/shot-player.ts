import { pointOfSegment, type MapPoint } from './location-map';
import { pickVideoSrc, shouldSkipVideo } from './video-source';

const PLAYBACK_RATE = 0.8; // snimke se vrte malo usporeno, mirnije
const FALLBACK_MS = 7000; // samo ako preglednik u međuvremenu prestane dopuštati reprodukciju
const PAUSE_DELAY_MS = 1500; // prethodna snimka se zaustavlja tek kad se prijelaz završi

interface PlayerOptions {
  hero: HTMLElement;
  onShotChange: (point: MapPoint) => void;
}

export function createShotPlayer({ hero, onShotChange }: PlayerOptions) {
  const videos = [...hero.querySelectorAll<HTMLVideoElement>('.hero__video')];
  const segments = [...hero.querySelectorAll<HTMLElement>('.segment')];
  const nameElement = hero.querySelector<HTMLElement>('[data-shot-name]');
  const numberElement = hero.querySelector<HTMLElement>('[data-shot-num]');
  const poster = hero.querySelector<HTMLElement>('.hero__poster');

  let index = 0;
  let fallback: ReturnType<typeof setTimeout> | undefined;
  let restartBarOnPlay = false;
  let isVisible = true;
  let videosEnabled = false;
  let isHoldingFirstFrame = false;

  /** Snimka se počinje skidati tek kad zatreba, da posjetitelj ne plaća promet za kadrove koje neće vidjeti. */
  const assignSource = (video: HTMLVideoElement) => {
    if (videosEnabled && !video.src) video.src = pickVideoSrc(video.dataset.video ?? '');
  };

  const durationMs = (video: HTMLVideoElement) =>
    Number.isFinite(video.duration) && video.duration > 0
      ? (video.duration / PLAYBACK_RATE) * 1000
      : FALLBACK_MS;

  // Kadar traje točno koliko i usporena snimka, a traka napretka prati to trajanje.
  const syncBarDuration = (video: HTMLVideoElement) =>
    hero.style.setProperty('--shot-ms', `${Math.round(durationMs(video))}ms`);

  const setPaused = (paused: boolean) => hero.classList.toggle('is-paused', paused);
  const next = () => goTo((index + 1) % videos.length);

  function play(video: HTMLVideoElement) {
    if (!video.src || isHoldingFirstFrame) return; // izvori se postavljaju tek nakon učitavanja stranice
    video.muted = true;
    video.defaultPlaybackRate = PLAYBACK_RATE;
    video.playbackRate = PLAYBACK_RATE;
    video.play().catch((error: unknown) => {
      if (!(error instanceof DOMException) || error.name !== 'NotAllowedError') return;
      // Bez dopuštenja (npr. iOS u štednom načinu) ostaje poster, bez izmjene kadrova.
      if (!hero.classList.contains('has-video')) {
        hero.classList.add('is-static');
        return;
      }
      clearTimeout(fallback);
      fallback = setTimeout(next, FALLBACK_MS);
    });
  }

  function restartBar(segment: HTMLElement) {
    segment.classList.remove('is-active');
    void segment.offsetWidth; // ponovno pokreni CSS animaciju trake
    segment.classList.add('is-active');
  }

  // Sljedeći kadar se skida dok traje trenutni, da prijelaz ne zapne.
  function preloadNext() {
    const upcoming = videos[(index + 1) % videos.length];
    upcoming.preload = 'auto';
    assignSource(upcoming);
  }

  const posterFadeMs = () =>
    poster ? parseFloat(getComputedStyle(poster).transitionDuration) * 1000 : 0;

  /**
   * Snimka stane na prvoj sličici dok se poster pretapa. Poster i ta sličica su ista slika,
   * pa se pri prijelazu ne vide dvostruki obrisi kao kad se poster pretapa u kadar koji se već kreće.
   */
  function holdFirstFrame() {
    const [first] = videos;
    if (index !== 0) return; // posjetitelj je već prešao na drugi kadar
    isHoldingFirstFrame = true;
    first.pause();
    first.addEventListener('seeked', revealVideo, { once: true });
    first.currentTime = 0;
  }

  function revealVideo() {
    hero.classList.add('has-video');
    setTimeout(() => {
      if (!isHoldingFirstFrame) return;
      isHoldingFirstFrame = false;
      restartBarOnPlay = true;
      if (isVisible && !document.hidden) play(videos[index]);
    }, posterFadeMs());
  }

  function goTo(target: number) {
    isHoldingFirstFrame = false;
    if (videosEnabled) hero.classList.add('has-video');
    const previous = videos[index];
    index = target;
    const video = videos[index];

    clearTimeout(fallback);
    video.preload = 'auto';
    assignSource(video);
    if (video.readyState > 0) video.currentTime = 0;
    syncBarDuration(video);
    restartBarOnPlay = true;
    play(video);
    preloadNext();
    videos.forEach((item, position) => item.classList.toggle('is-active', position === index));
    if (previous !== video) {
      setTimeout(() => {
        if (!previous.classList.contains('is-active')) previous.pause();
      }, PAUSE_DELAY_MS);
    }

    segments.forEach((segment, position) => {
      const isCurrent = position === index;
      segment.setAttribute('aria-pressed', String(isCurrent));
      if (isCurrent) restartBar(segment);
      else segment.classList.remove('is-active');
    });
    if (nameElement) nameElement.textContent = segments[index].dataset.name ?? '';
    if (numberElement) numberElement.textContent = String(index + 1).padStart(2, '0');
    onShotChange(pointOfSegment(segments[index]));
  }

  videos.forEach((video, position) => {
    video.addEventListener('ended', () => {
      if (position === index) next();
    });
    video.addEventListener('loadedmetadata', () => {
      if (position === index) syncBarDuration(video);
    });
    // Traka kreće iznova kad snimka stvarno krene, da ne pobjegne dok se učitava.
    video.addEventListener('playing', () => {
      if (position !== index || !restartBarOnPlay) return;
      restartBarOnPlay = false;
      restartBar(segments[index]);
    });
  });

  segments.forEach((segment, position) => segment.addEventListener('click', () => goTo(position)));
  hero.querySelector('[data-shot-next]')?.addEventListener('click', next);

  /** Videi se učitavaju tek nakon stranice, da ne otimaju promet posteru, fontovima i stilovima. */
  function loadVideos() {
    if (shouldSkipVideo()) {
      hero.classList.add('is-static');
      return;
    }
    videosEnabled = true;
    const [first] = videos;
    first.preload = 'auto';
    assignSource(first);
    syncBarDuration(first);
    restartBarOnPlay = true;
    first.addEventListener('playing', holdFirstFrame, { once: true });
    first.addEventListener('canplaythrough', preloadNext, { once: true });
    if (isVisible && !document.hidden) play(first);
  }

  return {
    loadVideos,
    setVisible(visible: boolean) {
      isVisible = visible;
      setPaused(!visible);
      if (visible) play(videos[index]);
      else videos[index].pause();
    },
    handleDocumentVisibility() {
      setPaused(document.hidden || !isVisible);
      if (!document.hidden && isVisible) play(videos[index]);
    },
  };
}
