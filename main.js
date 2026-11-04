(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Hero: drone kadrovi ---------- */
  const FALLBACK_MS = 7000; // samo ako se snimka ne može pokrenuti (npr. iOS u štednom načinu rada)
  const PLAYBACK_RATE = 0.8; // snimke se vrte malo usporeno, mirnije
  // Nazivi lokacija dolaze iz HTML-a (data-name na crticama), pa rade na svakom jeziku.
  const shots = [
    { dot: [46, 30] },
    { dot: [46, 30] },
    { dot: [39, 40] }
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

    // Sve lokacije su stalno na karti kao manje točke; aktivna dobiva svijetlu točku s pulsom.
    const spots = [...new Set(shots.map((s) => s.dot.join(',')))];
    const markers = spots.map((key) => {
      const [x, y] = key.split(',');
      const m = document.createElement('span');
      m.className = 'hero__marker';
      m.setAttribute('aria-hidden', 'true');
      m.style.left = x + '%';
      m.style.top = y + '%';
      dots[0].before(m);
      return m;
    });
    const markCurrent = (shot) => markers.forEach((m, j) => m.classList.toggle('is-current', spots[j] === shot.dot.join(',')));
    markCurrent(shots[0]);

    let idx = 0;
    let fallback = null;
    let syncBar = false;
    let heroVisible = true;

    // Kadar traje točno koliko i snimka (usporena), a traka napretka prati to trajanje.
    const shotMs = (v) => (v.duration && isFinite(v.duration) ? (v.duration / PLAYBACK_RATE) * 1000 : FALLBACK_MS);
    const setShotMs = (v) => hero.style.setProperty('--shot-ms', Math.round(shotMs(v)) + 'ms');
    const setPaused = (paused) => hero.classList.toggle('is-paused', paused);
    const next = () => goTo((idx + 1) % shots.length);

    const play = (v) => {
      v.muted = true;
      v.defaultPlaybackRate = PLAYBACK_RATE;
      v.playbackRate = PLAYBACK_RATE;
      const p = v.play();
      if (p && p.catch) p.catch((err) => {
        // Preglednik ne dopušta reprodukciju: kadrovi se izmjenjuju po satu.
        if (err && err.name === 'NotAllowedError') { clearTimeout(fallback); fallback = setTimeout(next, FALLBACK_MS); }
      });
    };

    const restartSegment = (seg) => {
      seg.classList.remove('is-active');
      void seg.offsetWidth; // ponovno pokreni CSS animaciju trake
      seg.classList.add('is-active');
    };

    const goTo = (i) => {
      const prev = videos[idx];
      idx = i;
      const cur = videos[idx];
      const shot = shots[idx];

      clearTimeout(fallback);
      cur.preload = 'auto';
      try { cur.currentTime = 0; } catch (e) {}
      setShotMs(cur);
      syncBar = true;
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
      markCurrent(shot);
    };

    videos.forEach((v, j) => {
      v.addEventListener('ended', () => { if (j === idx) next(); });
      v.addEventListener('loadedmetadata', () => { if (j === idx) setShotMs(v); });
      // Traka kreće iznova kad snimka stvarno krene, da ne pobjegne dok se učitava.
      v.addEventListener('playing', () => {
        if (j !== idx || !syncBar) return;
        syncBar = false;
        restartSegment(segments[idx]);
      });
    });

    segments.forEach((s) => s.addEventListener('click', () => goTo(Number(s.dataset.shot))));
    nextBtn.addEventListener('click', next);

    setShotMs(videos[0]);
    syncBar = true;
    play(videos[0]);

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

    /* Mobitel: naginjanje uređaja upravlja kadrom umjesto miša. */
    const TILT = 12; // stupnjeva nagiba za puni pomak
    const clamp = (v) => Math.max(-1, Math.min(1, v));
    let base = null;
    const onTilt = (e) => {
      if (e.gamma == null || e.beta == null) return;
      const angle = (screen.orientation && screen.orientation.angle) || window.orientation || 0;
      let x = e.gamma, y = e.beta;
      if (angle === 90) { x = e.beta; y = -e.gamma; }
      else if (angle === -90 || angle === 270) { x = -e.beta; y = e.gamma; }
      // Početni položaj je "sredina"; polako ga pratimo da kadar ne zapne na rubu.
      if (!base) base = { x, y };
      base.x += (x - base.x) * 0.004;
      base.y += (y - base.y) * 0.004;
      target.x = clamp((x - base.x) / TILT);
      target.y = clamp((y - base.y) / TILT);
      lastPointer = performance.now();
    };
    const DOE = window.DeviceOrientationEvent;
    if (DOE && !reduceMotion && window.matchMedia('(pointer: coarse)').matches) {
      const enableTilt = () => window.addEventListener('deviceorientation', onTilt);
      if (typeof DOE.requestPermission === 'function') {
        // iOS daje senzore tek nakon dopuštenja, a dijalog smije tražiti samo uz dodir.
        hero.addEventListener('touchend', () => {
          DOE.requestPermission().then((s) => { if (s === 'granted') enableTilt(); }).catch(() => {});
        }, { once: true });
      } else {
        enableTilt();
      }
    }

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
      setPaused(!heroVisible);
      if (heroVisible) { play(videos[idx]); startLoop(); }
      else { videos[idx].pause(); stopLoop(); }
    }, { threshold: 0.05 }).observe(hero);

    document.addEventListener('visibilitychange', () => {
      setPaused(document.hidden || !heroVisible);
      if (!document.hidden && heroVisible) play(videos[idx]);
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
