const RANGE = 3.6; // % pomaka sloja; sloj je 5 % veći od kadra sa svake strane
const SMOOTH_TIME = 0.75; // sekunde; veće = mekše i sporije praćenje kursora
const MAX_STEP = 0.05; // sekunde; nakon zastoja kadar ne smije naglo skočiti

interface Axis {
  position: number;
  velocity: number;
}

const clamp = (value: number) => Math.max(-1, Math.min(1, value));

/**
 * Prigušeno približavanje cilju (kritično prigušena opruga): brzina se mijenja postupno,
 * pa nema trzaja na početku pokreta, a put je isti na 60 i na 120 Hz.
 */
function dampTowards(axis: Axis, target: number, step: number) {
  const omega = 2 / SMOOTH_TIME;
  const x = omega * step;
  const decay = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const offset = axis.position - target;
  const drift = (axis.velocity + omega * offset) * step;
  axis.velocity = (axis.velocity - omega * drift) * decay;
  axis.position = target + (offset + drift) * decay;
}

/** Lagano stalno lebdenje drona. Zbraja se s položajem kursora, pa nikad ne mijenja smjer naglo. */
const hover = (time: number) => ({
  x: Math.sin(time / 5200) * 0.35,
  y: Math.cos(time / 6900) * 0.25,
});

/** Dron: kursor desno → kadar se pomiče desno → sadržaj klizi ulijevo. */
export function createCameraDrift(hero: HTMLElement, layer: HTMLElement) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const horizontal: Axis = { position: 0, velocity: 0 };
  const vertical: Axis = { position: 0, velocity: 0 };
  let pointer = { x: 0, y: 0 };
  let frame: number | null = null;
  let lastFrameTime: number | null = null;

  hero.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const rect = hero.getBoundingClientRect();
    pointer = {
      x: clamp(((event.clientX - rect.left) / rect.width) * 2 - 1),
      y: clamp(((event.clientY - rect.top) / rect.height) * 2 - 1),
    };
  });

  hero.addEventListener('pointerleave', () => {
    pointer = { x: 0, y: 0 };
  });

  const tick = (time: number) => {
    const step = Math.min((time - (lastFrameTime ?? time)) / 1000, MAX_STEP);
    lastFrameTime = time;

    const wave = hover(time);
    dampTowards(horizontal, clamp(pointer.x + wave.x), step);
    dampTowards(vertical, clamp(pointer.y + wave.y), step);

    const translateX = (-horizontal.position * RANGE).toFixed(3);
    const translateY = (-vertical.position * RANGE * 0.8).toFixed(3);
    const rotate = (horizontal.position * 0.3).toFixed(3);
    layer.style.transform = `translate3d(${translateX}%, ${translateY}%, 0) rotate(${rotate}deg)`;
    frame = requestAnimationFrame(tick);
  };

  return {
    start() {
      if (!reduceMotion && frame === null) frame = requestAnimationFrame(tick);
    },
    stop() {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      lastFrameTime = null;
    },
  };
}
