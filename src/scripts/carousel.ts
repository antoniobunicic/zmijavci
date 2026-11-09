const EDGE_TOLERANCE = 2;
const FALLBACK_STEP = 600;

function initCarousel(track: HTMLElement, previous: HTMLButtonElement, next: HTMLButtonElement) {
  const step = () => {
    const card = track.querySelector<HTMLElement>('.place');
    return card ? card.offsetWidth + parseFloat(getComputedStyle(track).columnGap) : FALLBACK_STEP;
  };

  const updateButtons = () => {
    previous.disabled = track.scrollLeft <= EDGE_TOLERANCE;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - EDGE_TOLERANCE;
  };

  previous.addEventListener('click', () => track.scrollBy({ left: -step() }));
  next.addEventListener('click', () => track.scrollBy({ left: step() }));
  track.addEventListener('scroll', () => requestAnimationFrame(updateButtons), { passive: true });
  window.addEventListener('resize', updateButtons);
  updateButtons();
}

const track = document.querySelector<HTMLElement>('[data-carousel]');
const previous = document.querySelector<HTMLButtonElement>('[data-carousel-prev]');
const next = document.querySelector<HTMLButtonElement>('[data-carousel-next]');
if (track && previous && next) initCarousel(track, previous, next);
