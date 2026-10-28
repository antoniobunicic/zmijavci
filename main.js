(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Hero: drone kadrovi ---------- */
  const SHOT_MS = 7500;
  const PLAYBACK_RATE = 0.8; // snimke se vrte malo usporeno, mirnije
  // Nazivi lokacija dolaze iz HTML-a (data-name na crticama), pa rade na svakom jeziku.
  const shots = [
    { dot: [46, 30] },
    { dot: [46, 30] }
  ];

  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const layer = hero.querySelector('[data-hero-layer]');
    const videos = [...hero.querySelectorAll('.hero__video')];
    const segments = [...hero.querySelectorAll('.segment')];
    const nameEl = hero.querySelector('[data-shot-name]');
    const numEl = hero.querySelector('[data-shot-num]');
    const dots = [...hero.querySelectorAll('[data-dot]')];
    const nextBtn = hero.querySelector('[data-shot-next]');

    let idx = 0;
    let timer = null;
    let heroVisible = true;

    hero.style.setProperty('--shot-ms', SHOT_MS + 'ms');

    const play = (v) => {
      v.muted = true;
      v.defaultPlaybackRate = PLAYBACK_RATE;
      v.playbackRate = PLAYBACK_RATE;
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    };

    const restartSegment = (seg) => {
      seg.classList.remove('is-active');
      void seg.offsetWidth; // ponovno pokreni CSS animaciju trake
      seg.classList.add('is-active');
    };

    const schedule = () => {
      clearTimeout(timer);
      if (!heroVisible || document.hidden) return;
      timer = setTimeout(() => goTo((idx + 1) % shots.length), SHOT_MS);
    };

    const goTo = (i) => {
      const prev = videos[idx];
      idx = i;
      const cur = videos[idx];
      const shot = shots[idx];

      cur.preload = 'auto';
      try { cur.currentTime = 0; } catch (e) {}
      play(cur);
      videos.forEach((v, j) => v.classList.toggle('is-active', j === idx));
      if (prev && prev !== cur) setTimeout(() => { if (!prev.classList.contains('is-active')) prev.pause(); }, 1500);

      segments.forEach((s, j) => {
        s.setAttribute('aria-pressed', j === idx ? 'true' : 'false');
        if (j === idx) restartSegment(s); else s.classList.remove('is-active');
      });
      if (segments[idx] && segments[idx].dataset.name) nameEl.textContent = segments[idx].dataset.name;
      numEl.textContent = String(idx + 1).padStart(2, '0');
      dots.forEach((d) => { d.style.left = shot.dot[0] + '%'; d.style.top = shot.dot[1] + '%'; });
      schedule();
    };

    segments.forEach((s) => s.addEventListener('click', () => goTo(Number(s.dataset.shot))));
    nextBtn.addEventListener('click', () => goTo((idx + 1) % shots.length));

    play(videos[0]);
    schedule();

    /* Dron: kursor desno → kadar se pomiče desno → sadržaj klizi ulijevo. */
    const RANGE = 3.6; // % pomaka sloja; sloj je 5 % veći od kadra sa svake strane
    let target = { x: 0, y: 0 };
    let cur = { x: 0, y: 0 };
    let lastPointer = 0;
    let raf = null;

    hero.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      const r = hero.getBoundingClientRect();
      target.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      target.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
      lastPointer = performance.now();
    });
    hero.addEventListener('pointerleave', () => { target = { x: 0, y: 0 }; lastPointer = 0; });

    const tick = (t) => {
      // Bez miša (npr. na mobitelu) kadar polako sam "lebdi".
      if (performance.now() - lastPointer > 2500) {
        target.x = Math.sin(t / 5200) * 0.35;
        target.y = Math.cos(t / 6900) * 0.25;
      }
      cur.x += (target.x - cur.x) * 0.045;
      cur.y += (target.y - cur.y) * 0.045;
      const tx = (-cur.x * RANGE).toFixed(3);
      const ty = (-cur.y * RANGE * 0.8).toFixed(3);
      const rot = (cur.x * 0.3).toFixed(3);
      layer.style.transform = `translate3d(${tx}%, ${ty}%, 0) rotate(${rot}deg)`;
      raf = requestAnimationFrame(tick);
    };

    const startLoop = () => { if (!reduceMotion && !raf) raf = requestAnimationFrame(tick); };
    const stopLoop = () => { if (raf) cancelAnimationFrame(raf); raf = null; };

    new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      if (heroVisible) { play(videos[idx]); startLoop(); schedule(); }
      else { videos[idx].pause(); stopLoop(); clearTimeout(timer); }
    }, { threshold: 0.05 }).observe(hero);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) clearTimeout(timer); else schedule();
    });

    startLoop();
  }

  /* ---------- Znamenitosti: vrtuljak ---------- */
  const track = document.querySelector('[data-carousel]');
  if (track) {
    const prev = document.querySelector('[data-carousel-prev]');
    const next = document.querySelector('[data-carousel-next]');
    const step = () => {
      const card = track.querySelector('.place');
      return card ? card.offsetWidth + parseFloat(getComputedStyle(track).columnGap || 24) : 600;
    };
    const update = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
    };
    prev.addEventListener('click', () => track.scrollBy({ left: -step() }));
    next.addEventListener('click', () => track.scrollBy({ left: step() }));
    track.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- Smještaj: filter ---------- */
  const filters = [...document.querySelectorAll('[data-filter]')];
  const stays = [...document.querySelectorAll('.stay[data-kind]')];
  filters.forEach((btn) => btn.addEventListener('click', () => {
    const kind = btn.dataset.filter;
    filters.forEach((b) => {
      const on = b === btn;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    stays.forEach((s) => { s.hidden = kind !== 'sve' && s.dataset.kind !== kind; });
  }));

  /* ---------- Novosti (bez pozadinskog servisa zasad) ---------- */
  const form = document.querySelector('[data-newsletter]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.classList.add('is-sent');
      form.querySelector('button').textContent = form.dataset.thanks || 'Hvala!';
    });
  }
})();
