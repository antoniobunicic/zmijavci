function initCoverGallery(root: HTMLElement) {
  const track = root.querySelector<HTMLElement>('[data-cover-track]');
  const dialog = root.querySelector<HTMLDialogElement>('[data-cover-dialog]');
  const fullImage = root.querySelector<HTMLImageElement>('[data-cover-full]');
  const counter = root.querySelector<HTMLElement>('[data-cover-current]');
  const button = (name: string) => root.querySelector<HTMLButtonElement>(`[${name}]`);
  const previous = button('data-cover-prev');
  const next = button('data-cover-next');
  const lightboxPrevious = button('data-lightbox-prev');
  const lightboxNext = button('data-lightbox-next');
  const close = button('data-cover-close');
  if (!track || !dialog || !fullImage || !counter) return;
  if (!previous || !next || !lightboxPrevious || !lightboxNext || !close) return;

  const slides = [...track.querySelectorAll<HTMLButtonElement>('[data-full]')];
  const last = slides.length - 1;
  let current = 0;
  let opened = 0;

  const clamp = (index: number) => Math.max(0, Math.min(last, index));
  const scrollToSlide = (index: number) => track.scrollTo({ left: index * track.clientWidth });

  function syncCover() {
    current = clamp(Math.round(track!.scrollLeft / track!.clientWidth));
    counter!.textContent = String(current + 1);
    previous!.disabled = current === 0;
    next!.disabled = current === last;
  }

  function showInLightbox(index: number) {
    opened = clamp(index);
    const { full, alt } = slides[opened].dataset;
    fullImage!.src = full ?? '';
    fullImage!.alt = alt ?? '';
    lightboxPrevious!.disabled = opened === 0;
    lightboxNext!.disabled = opened === last;
  }

  function stepLightbox(delta: number) {
    showInLightbox(opened + delta);
    scrollToSlide(opened);
  }

  previous.addEventListener('click', () => scrollToSlide(current - 1));
  next.addEventListener('click', () => scrollToSlide(current + 1));
  track.addEventListener('scroll', () => requestAnimationFrame(syncCover), { passive: true });
  window.addEventListener('resize', () => {
    track.scrollTo({ left: current * track.clientWidth, behavior: 'instant' });
  });

  slides.forEach((slide, index) => {
    slide.addEventListener('click', () => {
      showInLightbox(index);
      dialog.showModal();
    });
  });

  lightboxPrevious.addEventListener('click', () => stepLightbox(-1));
  lightboxNext.addEventListener('click', () => stepLightbox(1));
  close.addEventListener('click', () => dialog.close());
  // Klik izvan fotografije zatvara dijalog.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') stepLightbox(-1);
    if (event.key === 'ArrowRight') stepLightbox(1);
  });

  syncCover();
}

document.querySelectorAll<HTMLElement>('[data-cover-gallery]').forEach(initCoverGallery);
