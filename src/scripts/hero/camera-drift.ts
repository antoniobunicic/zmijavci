const RANGE = 3.6; // % pomaka sloja; sloj je 5 % veći od kadra sa svake strane
const EASING = 0.045;
const IDLE_MS = 2500;

const clamp = (value: number) => Math.max(-1, Math.min(1, value));

/** Dron: kursor desno → kadar se pomiče desno → sadržaj klizi ulijevo. Bez miša kadar polako sam lebdi. */
export function createCameraDrift(hero: HTMLElement, layer: HTMLElement) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  let lastPointer = 0;
  let frame: number | null = null;

  hero.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const rect = hero.getBoundingClientRect();
    target = {
      x: clamp(((event.clientX - rect.left) / rect.width) * 2 - 1),
      y: clamp(((event.clientY - rect.top) / rect.height) * 2 - 1),
    };
    lastPointer = performance.now();
  });

  hero.addEventListener('pointerleave', () => {
    target = { x: 0, y: 0 };
    lastPointer = 0;
  });

  const tick = (time: number) => {
    if (performance.now() - lastPointer > IDLE_MS) {
      target = { x: Math.sin(time / 5200) * 0.35, y: Math.cos(time / 6900) * 0.25 };
    }
    current.x += (target.x - current.x) * EASING;
    current.y += (target.y - current.y) * EASING;
    const translateX = (-current.x * RANGE).toFixed(3);
    const translateY = (-current.y * RANGE * 0.8).toFixed(3);
    const rotate = (current.x * 0.3).toFixed(3);
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
    },
  };
}
