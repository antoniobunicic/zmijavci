const VIDEO_BASE = '/assets/video/';
const MOBILE_QUERY = '(max-width: 767px)';

interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

/** Uz štednju podataka ili spor internet ostaje samo poster. */
export function shouldSkipVideo(): boolean {
  const { connection } = navigator as Navigator & { connection?: NetworkInformation };
  return Boolean(connection?.saveData) || /(^|-)2g$/.test(connection?.effectiveType ?? '');
}

/** Lakša verzija za mobitele, inače HEVC u 2560 px gdje ga preglednik podržava, a H.264 u 1080p ostalima. */
export function pickVideoSrc(name: string): string {
  if (window.matchMedia(MOBILE_QUERY).matches) return `${VIDEO_BASE}${name}-mobile.mp4`;
  const supportsHevc = document.createElement('video').canPlayType('video/mp4; codecs="hvc1"') !== '';
  return `${VIDEO_BASE}${name}${supportsHevc ? '-hevc' : ''}.mp4`;
}
